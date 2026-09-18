import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync, createReadStream, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';

const CASOS_DIR = 'Casos';

// Publica la carpeta Casos/ en el sitio: la copia a dist/ en el build y la
// sirve durante `npm run dev` en /Casos/*. Fuente única: la carpeta Casos/.
function servirCasos() {
  return {
    name: 'veredikt-servir-casos',
    closeBundle() {
      if (existsSync(CASOS_DIR)) {
        cpSync(CASOS_DIR, join('dist', CASOS_DIR), { recursive: true });
      }
    },
    configureServer(server) {
      server.middlewares.use('/Casos', (req, res, next) => {
        const rel = decodeURIComponent((req.url || '').split('?')[0]);
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
