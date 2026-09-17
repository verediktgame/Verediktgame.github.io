import { obfuscateTruth, deobfuscateTruth } from './storage.js';

export function exportCaseToJson(publicInfo, truth) {
  const exportPayload = {
    version: "4.0",
    exportedAt: new Date().toISOString(),
    publicInfo,
    truthObfuscated: obfuscateTruth(truth)
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (publicInfo.titulo || 'expediente_veredikt')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 30);
  a.href = url;
  a.download = `caso_${safeTitle}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importCaseFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let publicInfo = data.publicInfo || (data.titulo ? data : null);
        let truth = null;

        if (data.truthObfuscated) {
          truth = deobfuscateTruth(data.truthObfuscated);
        } else if (data.truth) {
          truth = data.truth;
        }

        if (!publicInfo || !publicInfo.sospechosos || !publicInfo.evidencias) {
          throw new Error('El archivo JSON no contiene un expediente policial válido.');
        }

        resolve({ publicInfo, truth });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(file);
  });
}
