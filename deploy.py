#!/usr/bin/env python3
"""
Deploy de VEREDIKT a GitHub Pages.

Uso:
    python3 deploy.py                 # build + sube main + publica gh-pages
    python3 deploy.py -m "mi mensaje" # con mensaje de commit propio

Qué hace, en orden:
  1. Verifica git, node y npm.
  2. Buildea el sitio con Vite (incluye automáticamente la carpeta Casos/).
  3. Commitea todos los cambios y los sube a la rama main.
  4. Publica el contenido de dist/ en la rama gh-pages.
  5. GitHub Pages sirve solo (tarda ~1 minuto).

El token de GitHub se busca, en este orden:
  - variable de entorno GITHUB_TOKEN
  - archivo .deploy_token (gitignoreado)
  - archivo .env  (línea: GITHUB_TOKEN=...)
Si no lo encuentra, lo pide por consola y ofrece guardarlo.
"""

import os
import re
import sys
import shutil
import getpass
import argparse
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAIN_BRANCH = "main"
PAGES_BRANCH = "gh-pages"
DIST = ROOT / "dist"
TOKEN_FILE = ROOT / ".deploy_token"
LIVE_URL = "https://verediktgame.github.io/"

RESET = "\033[0m"
CYAN = "\033[1;36m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
RED = "\033[1;31m"
BOLD = "\033[1m"


def log(msg):
    print(f"{CYAN}▶ {msg}{RESET}")


def ok(msg):
    print(f"{GREEN}✓ {msg}{RESET}")


def warn(msg):
    print(f"{YELLOW}⚠ {msg}{RESET}")


def fail(msg):
    print(f"{RED}✗ {msg}{RESET}")
    sys.exit(1)


def run(cmd, cwd=ROOT, check=True, redact=None, quiet=False):
    """Ejecuta un comando, captura la salida y (si redact) oculta el token."""
    printable = " ".join(str(c) for c in cmd)
    if redact:
        printable = printable.replace(redact, "****")
    if not quiet:
        print(f"  $ {printable}")
    result = subprocess.run(
        [str(c) for c in cmd],
        cwd=str(cwd),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    out = result.stdout or ""
    if redact:
        out = out.replace(redact, "****")
    if out.strip() and not quiet:
        print("    " + out.strip().replace("\n", "\n    "))
    if check and result.returncode != 0:
        fail(f"Falló el comando: {printable}")
    return result


def git_out(args, cwd=ROOT):
    return subprocess.run(
        ["git", *args], cwd=str(cwd), text=True,
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    ).stdout.strip()


def ensure_gitignore():
    """El token nunca debe subirse al repo."""
    gi = ROOT / ".gitignore"
    text = gi.read_text() if gi.exists() else ""
    if ".deploy_token" not in text:
        with gi.open("a") as f:
            if text and not text.endswith("\n"):
                f.write("\n")
            f.write("\n# Deploy: secreto local (nunca commitear)\n.deploy_token\n")
        ok("Agregado .deploy_token a .gitignore")


def read_token_from_file(path):
    if not path.exists():
        return None
    for line in path.read_text().splitlines():
        line = line.strip()
        if line.startswith("GITHUB_TOKEN="):
            value = line[len("GITHUB_TOKEN="):].strip().strip('"').strip("'")
            if value:
                return value
    return None


def get_token():
    token = (os.environ.get("GITHUB_TOKEN") or "").strip()
    if token:
        return token
    if TOKEN_FILE.exists():
        token = TOKEN_FILE.read_text().strip()
        if token:
            return token
    token = read_token_from_file(ROOT / ".env")
    if token:
        return token

    warn("No encontré un token de GitHub.")
    print("  Generá uno en https://github.com/settings/tokens con permiso 'repo'.")
    token = getpass.getpass("  Pegá tu token (no se muestra): ").strip()
    if not token:
        fail("Sin token no puedo subir a GitHub.")
    try:
        TOKEN_FILE.write_text(token + "\n")
        os.chmod(TOKEN_FILE, 0o600)
        ok(f"Token guardado en {TOKEN_FILE.name} (está en .gitignore).")
    except OSError as e:
        warn(f"No pude guardar el token: {e}")
    return token


def remote_slug():
    remote = git_out(["remote", "get-url", "origin"])
    if not remote:
        fail("El repo no tiene remote 'origin'.")
    remote = re.sub(r"^https?://[^@/]+@", "https://", remote)
    remote = re.sub(r"^git@github\.com:", "https://github.com/", remote)
    match = re.search(r"github\.com[:/](.+?)(?:\.git)?$", remote)
    if not match:
        fail(f"No entiendo el remote: {remote}")
    return match.group(1)


def auth_url(token):
    return f"https://x-access-token:{token}@github.com/{remote_slug()}.git"


def author_args():
    args = []
    if not git_out(["config", "user.name"]):
        args += ["-c", "user.name=verediktgame"]
    if not git_out(["config", "user.email"]):
        args += ["-c", "user.email=verediktgame@gmail.com"]
    return args


def build():
    log("Buildeando el sitio (npm run build)...")
    run(["npm", "run", "build"])
    if not (DIST / "index.html").exists():
        fail("El build no generó dist/index.html.")
    ok("Build listo.")


def commit_and_push_main(token, url, message):
    log("Guardando cambios en main...")
    run(["git", "add", "-A"])
    changes = git_out(["status", "--porcelain"])
    if changes:
        print(f"{BOLD}  Archivos a subir:{RESET}")
        for line in changes.splitlines():
            print(f"    {line}")
        run(["git", *author_args(), "commit", "-m", message])
    else:
        ok("No hay cambios nuevos en el código.")

    log("Sincronizando con GitHub...")
    pull = run(["git", "pull", "--rebase", url, MAIN_BRANCH], redact=token, check=False)
    if pull.returncode != 0:
        run(["git", "rebase", "--abort"], check=False, quiet=True)
        fail("Hubo un conflicto al sincronizar. Resolvelo a mano y reintentá.")

    run(["git", "push", url, f"{MAIN_BRANCH}:{MAIN_BRANCH}"], redact=token)
    ok("main actualizado.")


def pages_base_ref():
    for ref in (f"refs/heads/{PAGES_BRANCH}", f"refs/remotes/origin/{PAGES_BRANCH}"):
        if subprocess.run(
            ["git", "rev-parse", "--verify", "--quiet", ref],
            cwd=str(ROOT), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        ).returncode == 0:
            return ref
    return None


def deploy_pages(token, url, message):
    log("Publicando en gh-pages...")
    # Refresca la ref local con el tip real del remoto: sin esto el worktree
    # parte de un gh-pages viejo y el push cae en non-fast-forward cuando
    # alguien pusheó gh-pages desde otro lugar.
    run(["git", "fetch", "-q", url,
         f"{PAGES_BRANCH}:refs/remotes/origin/{PAGES_BRANCH}"],
        redact=token, check=False)
    base = pages_base_ref()
    if base is None:
        fail(f"No encuentro la rama {PAGES_BRANCH} en el repo.")

    tmp = Path(tempfile.mkdtemp(prefix="veredikt-pages-"))
    try:
        run(["git", "worktree", "add", "--force", "--detach", str(tmp), base])
        for entry in tmp.iterdir():
            if entry.name == ".git":
                continue
            shutil.rmtree(entry) if entry.is_dir() else entry.unlink()

        for entry in DIST.iterdir():
            dest = tmp / entry.name
            shutil.copytree(entry, dest) if entry.is_dir() else shutil.copy2(entry, dest)

        run(["git", "add", "-A"], cwd=tmp)
        staged = git_out(["status", "--porcelain"], cwd=tmp)
        if staged:
            run(["git", *author_args(), "commit", "-m", message], cwd=tmp)
        else:
            ok("gh-pages ya estaba al día.")
        # El push es force a propósito: gh-pages es solo output de build (dist/)
        # y se sube por URL con token, así que --force-with-lease no puede
        # resolver la ref de comparación (da "stale info"). El fetch previo
        # mantiene el base al día; force solo sobreescribe output generado.
        run(["git", "push", "--force", url, f"HEAD:{PAGES_BRANCH}"], cwd=tmp, redact=token)
        ok("gh-pages actualizado.")
    finally:
        run(["git", "worktree", "remove", "--force", str(tmp)], check=False, quiet=True)
        if tmp.exists():
            shutil.rmtree(tmp, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(description="Deploy de Veredikt a GitHub Pages.")
    parser.add_argument("-m", "--message", default=None, help="Mensaje de commit.")
    args = parser.parse_args()

    os.chdir(ROOT)
    print(f"{BOLD}VEREDIKT → GitHub Pages{RESET}")

    for tool in ("git", "node", "npm"):
        if shutil.which(tool) is None:
            fail(f"No encontré '{tool}'. Instalalo y volvé a intentar.")

    ensure_gitignore()
    token = get_token()
    url = auth_url(token)
    message = args.message or f"Deploy {datetime.now():%Y-%m-%d %H:%M}"

    build()
    commit_and_push_main(token, url, message)
    deploy_pages(token, url, message)

    print()
    ok(f"Listo. En ~1 minuto estará en {LIVE_URL}")
    print("  Casos servidos en " + LIVE_URL + "Casos/")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        warn("Cancelado.")
        sys.exit(130)
