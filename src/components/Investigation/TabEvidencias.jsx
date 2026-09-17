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
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
              CADENA DE CUSTODIA
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', margin: '4px 0' }}>
              Evidencias Físicas y Forenses
            </h2>
          </div>

          {/* PERMANENT FORENSIC COUNTER — ALWAYS VISIBLE */}
          <div style={{ 
            background: forensicsAvailable > 0 ? 'rgba(27, 61, 108, 0.08)' : 'rgba(163, 34, 34, 0.08)', 
            border: `2px solid ${forensicsAvailable > 0 ? 'var(--ink-stamp-blue)' : 'var(--ink-stamp-red)'}`,
            padding: '8px 14px',
            borderRadius: '4px',
            fontFamily: 'var(--font-typewriter)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-faded)', textTransform: 'uppercase' }}>
              Cupo de Laboratorio
            </div>
            <div style={{ 
              fontSize: '15px', 
              fontWeight: 'bold', 
              color: forensicsAvailable > 0 ? 'var(--ink-stamp-blue)' : 'var(--ink-stamp-red)' 
            }}>
              🔬 Análisis disponibles: {forensicsAvailable} / {maxForensics}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '8px' }}>
          El laboratorio de balística y dactiloscopia solo dispone de reactivos para procesar a fondo <strong>2 evidencias</strong> por expediente. Elegí cuidadosamente.
        </p>
      </div>

      {/* EVIDENCE CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {evidencias.map((ev) => {
          const isAnalyzed = analyzedEvidenceIds.includes(ev.id);
          const canAnalyze = forensicsAvailable > 0 && !isAnalyzed;

          return (
            <div 
              key={ev.id}
              className="evidence-card paper-texture"
              style={{ 
                border: isAnalyzed ? '2px solid var(--ink-stamp-blue)' : '1px solid var(--manila-dark)', 
                padding: '16px', 
                borderRadius: '4px',
                position: 'relative',
                boxShadow: '1px 1px 5px rgba(0,0,0,0.05)'
              }}
            >
              {isAnalyzed && (
                <div 
                  className="dossier-stamp" 
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    right: '16px', 
                    color: 'var(--ink-stamp-blue)',
                    borderColor: 'var(--ink-stamp-blue)',
                    fontSize: '11px',
                    padding: '3px 8px',
                    transform: 'rotate(-4deg)'
                  }}
                >
                  FORENSE PROCESADO
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🏷️</span>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--ink-faded)', textTransform: 'uppercase' }}>
                    EVIDENCIA #{ev.id}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '17px', margin: '2px 0 6px 0' }}>
                    {ev.objeto}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-black)', lineHeight: '1.45' }}>
                    <strong>Descripción:</strong> {ev.descripcion}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '4px' }}>
                    <strong>Hallado en:</strong> {ev.ubicacion}
                  </div>
                </div>
              </div>

              {/* FORENSIC REPORT SECTION */}
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px dashed var(--manila-dark)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {isAnalyzed ? (
                  <div style={{ 
                    background: 'rgba(27, 61, 108, 0.05)', 
                    borderLeft: '3px solid var(--ink-stamp-blue)', 
                    padding: '10px 14px', 
                    width: '100%',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: '1.5'
                  }}>
                    <strong style={{ color: 'var(--ink-stamp-blue)', display: 'block', marginBottom: '4px' }}>
                      🔬 RESULTADO DEL ANÁLISIS FORENSE:
                    </strong>
                    {ev.analisisForense}
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '12px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
                      Sin informe pericial químico o dactilar.
                    </span>
                    <button 
                      type="button" 
                      className="btn-paper" 
                      onClick={() => onAnalyzeEvidence(ev.id)}
                      disabled={!canAnalyze}
                      style={{ 
                        fontSize: '12px', 
                        padding: '6px 14px',
                        opacity: canAnalyze ? 1 : 0.4,
                        cursor: canAnalyze ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {canAnalyze ? '🔬 Enviar al Laboratorio Forense' : 'Sin cupo de análisis (0/2)'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
