#!/usr/bin/env bash
# =============================================================================
# download_skills.sh
# Clona o actualiza todos los repositorios del entorno AI Skills.
# Uso: ./download_skills.sh  |  update-skills
# =============================================================================

set -euo pipefail

# ── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ── Ruta raíz del proyecto ────────────────────────────────────────────────────
SKILLS_ROOT="/mnt/disco_local/Archivos/Proyectos_personales/Skills"

log()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
ok()     { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()   { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
err()    { echo -e "${RED}[ERROR]${RESET} $*"; }
header() {
    echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════${RESET}"
    echo -e "${BOLD}${CYAN}  $*${RESET}"
    echo -e "${BOLD}${CYAN}══════════════════════════════════════════${RESET}"
}

# ── Función principal: clonar o actualizar ────────────────────────────────────
# Uso: sync_repo <carpeta_destino> <nombre_repo> <url_github>
sync_repo() {
    local dest_dir="$1"
    local repo_name="$2"
    local repo_url="$3"
    local full_path="${dest_dir}/${repo_name}"

    mkdir -p "$dest_dir"

    if [[ -d "${full_path}/.git" ]]; then
        log "Actualizando: ${BOLD}${repo_name}${RESET}"
        # Detectar rama principal (main o master)
        local branch
        branch=$(git -C "$full_path" symbolic-ref refs/remotes/origin/HEAD 2>/dev/null \
                 | sed 's@^refs/remotes/origin/@@' || echo "main")
        if git -C "$full_path" pull --ff-only origin "$branch" 2>&1; then
            ok "${repo_name} → actualizado"
        else
            warn "${repo_name} → pull con conflictos, haciendo fetch limpio"
            git -C "$full_path" fetch --all
        fi

    elif [[ -d "$full_path" && ! -d "${full_path}/.git" ]]; then
        warn "${repo_name} existe pero NO es un repo Git válido. Limpiando y re-clonando..."
        rm -rf "$full_path"
        if git clone --depth=1 "$repo_url" "$full_path"; then
            ok "${repo_name} → clonado"
        else
            err "${repo_name} → fallo al clonar (¿repo privado o URL incorrecta?)"
        fi

    else
        log "Clonando: ${BOLD}${repo_name}${RESET} desde ${repo_url}"
        if git clone --depth=1 "$repo_url" "$full_path"; then
            ok "${repo_name} → clonado"
        else
            err "${repo_name} → fallo al clonar (¿repo privado o URL incorrecta?)"
        fi
    fi
}

# =============================================================================
# MAPA DE REPOSITORIOS
# Formato de cada entrada: "subcarpeta|nombre_local|url_completa"
# Se usa | como separador para que Bash nunca rompa las URLs al iterar
# =============================================================================
declare -a REPOS=(
    # ── core-frameworks ───────────────────────────────────────────────────────
    "core-frameworks|OmniRoute|https://github.com/diegosouzapw/OmniRoute"
    "core-frameworks|graphify|https://github.com/Graphify-Labs/graphify"
    "core-frameworks|gsd-core|https://github.com/open-gsd/gsd-core"
    "core-frameworks|ralph|https://github.com/snarktank/ralph"
    "core-frameworks|opencode-skills|https://github.com/farmage/opencode-skills"

    # ── engineering-skills ────────────────────────────────────────────────────
    "engineering-skills|ponytail|https://github.com/DietrichGebert/ponytail"
    "engineering-skills|agent-skills|https://github.com/addyosmani/agent-skills"
    "engineering-skills|coderabbit-skills|https://github.com/coderabbitai/skills"
    "engineering-skills|senior-architect-agent|https://github.com/aetox-skills/senior-architect-agent"

    # ── design-and-taste ─────────────────────────────────────────────────────
    "design-and-taste|emil-skills|https://github.com/emilkowalski/skills"
    "design-and-taste|taste-skill|https://github.com/leonxlnx/taste-skill"
    "design-and-taste|impeccable|https://github.com/pbakaus/impeccable"

    # ── specialized-agents ───────────────────────────────────────────────────
    "specialized-agents|agency-agents|https://github.com/msitarzewski/agency-agents"
    "specialized-agents|firecrawl|https://github.com/firecrawl/firecrawl"
)

# =============================================================================
# EJECUCIÓN
# =============================================================================
header "AI Skills Sync — $(date '+%Y-%m-%d %H:%M:%S')"
log "Raíz: ${SKILLS_ROOT}"

mkdir -p "$SKILLS_ROOT"

current_folder=""
for entry in "${REPOS[@]}"; do
    IFS='|' read -r subfolder repo_name repo_url <<< "$entry"
    dest="${SKILLS_ROOT}/${subfolder}"

    if [[ "$subfolder" != "$current_folder" ]]; then
        header "📁 ${subfolder}"
        current_folder="$subfolder"
    fi

    sync_repo "$dest" "$repo_name" "$repo_url"
done

header "✅ Sincronización completa"
echo -e "Repositorios disponibles en: ${BOLD}${SKILLS_ROOT}${RESET}\n"
