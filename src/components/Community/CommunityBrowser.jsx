import React, { useEffect, useState } from 'react';
import { isHogwartsDay } from '../../constants/hogwarts.js';

const INDEX_URL = '/Casos/index.json';

const POLITICA = isHogwartsDay();

function esHarryPotter(casoTxt) {
  return (casoTxt || '').toLowerCase().includes('harry potter');
}

export function CommunityBrowser({ onLoadCaseFile, onOpenImportDialog, onBack }) {
  const [casos, setCasos] = useState(null); // null = cargando
  const [error, setError] = useState('');
  const [loadingCase, setLoadingCase] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(INDEX_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((list) => {
        if (!alive) return;
        const filtrados = (Array.isArray(list) ? list : []).filter((c) => {
          const hp = esHarryPotter(c.file) || esHarryPotter(c.titulo);
          // El 1 de septiembre la comunidad muestra SOLO los expedientes de la
          // carpeta Harry Potter; el resto de los días los excluye.
          return POLITICA ? hp : !hp;
        });
        setCasos(filtrados);
      })
      .catch(() => {
        if (alive) {
          setError('No se pudo leer el archivo comunitario de casos. Podés importar uno manualmente desde tu dispositivo.');
        }
      });
    return () => { alive = false; };
  }, []);

  const loadCase = async (c) => {
    try {
      setLoadingCase(c.file);
      const url = '/Casos/' + String(c.file || '').split('/').map(encodeURIComponent).join('/');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const file = new File([text], String(c.file).split('/').pop() || 'caso.json', { type: 'application/json' });
      onLoadCaseFile(file);
    } catch (err) {
      alert(`Error al descargar el caso: ${err.message}`);
    } finally {
      setLoadingCase(null);
    }
  };

  return (
    <div className="workspace" style={{ padding: '20px 0 60px 0' }}>
      <div className="setup-dossier community-browser">
        <div className="form-header">
          <div>
            <h2 className="form-title">ARCHIVO COMUNITARIO</h2>
            <div className="form-subtitle">
              Expedientes compartidos por otros detectives. Elegí uno o importá un archivo local.
            </div>
          </div>
          <span className="stamp">COMUNIDAD</span>
        </div>

        {casos === null && !error && (
          <div className="loading-state" style={{ display: 'block', margin: '10px 0 20px 0' }}>
            <div className="teletype-text">LEYENDO ARCHIVO DE LA COMUNIDAD...</div>
            <div className="typewriter-cursor"></div>
          </div>
        )}

        {error && (
          <div style={{ color: '#8b1e1e', fontSize: '13px', fontWeight: 'bold', margin: '0 0 14px 0' }}>
            ⚠️ {error}
          </div>
        )}

        {casos !== null && !error && (
          <>
            <div className="community-count">
              {casos.length > 0
                ? `${casos.length} expediente${casos.length === 1 ? '' : 's'} disponible${casos.length === 1 ? '' : 's'} en el archivo`
                : 'Aún no hay expedientes comunitarios disponibles.'}
            </div>

            {casos.length > 0 && (
              <ul className="community-list">
                {casos.map((c) => (
                  <li key={c.file}>
                    <button
                      type="button"
                      className="community-item"
                      onClick={() => loadCase(c)}
                      disabled={Boolean(loadingCase)}
                    >
                      <span className="community-item-title">
                        {loadingCase === c.file ? 'ABRIENDO EXPEDIENTE...' : (c.titulo || 'Expediente sin título')}
                      </span>
                      <span className="community-item-file">{c.file}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="community-actions">
          <button type="button" className="btn-wood" onClick={onBack} disabled={Boolean(loadingCase)}>
            ⬅ Volver a la Mesa
          </button>
          <button
            type="button"
            className="btn-wood primary"
            onClick={onOpenImportDialog}
            disabled={Boolean(loadingCase)}
          >
            📂 Importar un caso del dispositivo (.json)
          </button>
        </div>
      </div>
    </div>
  );
}