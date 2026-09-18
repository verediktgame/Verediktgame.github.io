import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync, createReadStream, statSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, normalize, extname, posix } from 'node:path';

const CASOS_DIR = 'Casos';

// Recorre Casos/ y arma el índice de expedientes (file relativo + título que
// muestra). Leer el título en build evita que el cliente tenga que descargar
// cada expediente solo para listarlos.
function buildCasosIndex() {
  const list = [];
  if (!existsSync(CASOS_DIR)) return list;

  const walk = (baseDir, relDir) => {
    const dirPath = join(baseDir, relDir);
    let entries;
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const rel = relDir ? posix.join(relDir, ent.name) : ent.name;
      if (ent.isDirectory()) {
        walk(baseDir, rel);
      } else if (ent.isFile() && extname(ent.name).toLowerCase() === '.json' && ent.name.toLowerCase() !== 'index.json') {
        let titulo = '';
        try {
          const data = JSON.parse(readFileSync(join(baseDir, rel), 'utf8'));
          titulo = (data?.publicInfo?.titulo || data?.titulo || '').trim();
        } catch {}
        list.push({ file: rel, titulo });
      }
    }
  };

  walk(CASOS_DIR, '');
  list.sort((a, b) => (a.titulo || a.file).localeCompare(b.titulo || b.file));
  return list;
}

// Publica la carpeta Casos/ en el sitio: la copia a dist/ en el build y la
// sirve durante `npm run dev` en /Casos/*. Fuente única: la carpeta Casos/.
function servirCasos() {
  return {
    name: 'veredikt-servir-casos',
    closeBundle() {
      if (!existsSync(CASOS_DIR)) return;
      cpSync(CASOS_DIR, join('dist', CASOS_DIR), { recursive: true });
      writeFileSync(
        join('dist', CASOS_DIR, 'index.json'),
        JSON.stringify(buildCasosIndex(), null, 2),
        'utf8'
      );
    },
    configureServer(server) {
      server.middlewares.use('/Casos', (req, res, next) => {
        const rel = decodeURIComponent((req.url || '').split('?')[0]);
        if (rel === '/index.json') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(buildCasosIndex(), null, 2));
          return;
        }
        const filePath = normalize(join(CASOS_DIR, rel));
        const dentroDeCasos = filePath === CASOS_DIR || filePath.startsWith(CASOS_DIR + '/');
        if (!dentroDeCasos || !existsSync(filePath) || !statSync(filePath).isFile()) {
          return next();
        }
        res.setHeader('Content-Type', extname(filePath) === '.json' ? 'application/json; charset=utf-8' : 'application/octet-stream');
        createReadStream(filePath).pipe(res);
      });
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), servirCasos()],
  server: {
    port: 5173,
    open: false
  }
});
