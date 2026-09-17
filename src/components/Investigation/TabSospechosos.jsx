import React from 'react';

export function TabSospechosos({ sospechosos = [], onSelectSuspectToInterrogate, interrogationsState = {} }) {
  return (
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '12px', marginBottom: '18px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
          PERSONAS DE INTERÉS
        </span>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', margin: '4px 0' }}>
          Fichas de Sospechosos
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
          Examiná sus perfiles y coartadas. Podés interrogar a cada uno con preguntas específicas para detectar inconsistencias.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {sospechosos.map((s) => {
          const askedCount = (interrogationsState[s.id] || []).length;

          return (
            <div 
              key={s.id}
              className="suspect-card paper-texture"
              style={{ 
                border: '1px solid var(--manila-dark)', 
                padding: '16px', 
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ 
                    width: '46px', 
                    height: '54px', 
                    background: '#1a1714', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px',
                    borderRadius: '2px'
                  }}>
                    👤
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
                      REGISTRO #{s.id}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '17px', margin: '2px 0' }}>
                      {s.nombre}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--ink-black)', marginBottom: '8px', lineHeight: 1.4 }}>
                  <strong>Perfil:</strong> {s.perfil}
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--ink-faded)', marginBottom: '14px', lineHeight: 1.4 }}>
                  <strong>Coartada:</strong> <em>"{s.coartada}"</em>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px dashed var(--manila-dark)', 
                paddingTop: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>
                  Preguntadas: {askedCount}/3
                </span>
                <button 
                  type="button" 
                  className="btn-paper"
                  onClick={() => onSelectSuspectToInterrogate(s)}
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  🎙️ Interrogar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
