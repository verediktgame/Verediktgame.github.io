import React from 'react';

export function TabEvidencias({
  evidencias = [],
  analyzedEvidenceIds = [],
  onAnalyzeEvidence
}) {
  const maxForensics = 2;
  const forensicsUsed = analyzedEvidenceIds.length;
  const forensicsAvailable = Math.max(0, maxForensics - forensicsUsed);

  return (
    <div>
      <div className="evidences-toolbar">
        <div className="forensic-counter">
          <span>LABORATORIO FORENSE CENTRAL:</span>
          <span>Análisis disponibles:</span>
          <span className="counter-badge" id="forensicCountBadge">
            {forensicsAvailable} / {maxForensics}
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#5d4a34' }}>
          * Selecciona con cuidado qué objetos someter al laboratorio pericial.
        </div>
      </div>

      <div className="evidences-grid">
        {evidencias.map((e, idx) => {
          const isAnalyzed = analyzedEvidenceIds.includes(e.id);
          return (
            <div key={e.id} className="evidence-bag" id={`bag-${e.id}`}>
              <div className="evidence-tag">
                <div className="tag-header">
                  <span className="tag-title">DEPT. EVIDENCIAS // CADENA DE CUSTODIA</span>
                  <span className="tag-barcode">||| | |||| | ||</span>
                </div>
                <div className="evidence-item-name">
                  EVIDENCIA #{idx + 1}: {e.objeto}
                </div>
                <div className="evidence-desc">{e.descripcion}</div>
                <div className="evidence-location">
                  <strong>HALLADA EN:</strong> {e.ubicacion}
                </div>

                <div id={`forensicSection-${e.id}`} style={{ marginTop: '12px' }}>
                  {isAnalyzed ? (
                    <div className="forensic-result">
                      <strong>DICTAMEN DEL LABORATORIO FORENSE:</strong>{' '}
                      {e.analisisForense}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-wood"
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => onAnalyzeEvidence(e.id)}
                      disabled={forensicsAvailable <= 0}
                    >
                      🔬 Solicitar análisis forense
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
