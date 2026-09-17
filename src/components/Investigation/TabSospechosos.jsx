import React from 'react';

export function TabSospechosos({ sospechosos = [], onSelectSuspectToInterrogate, interrogationsState = {} }) {
  return (
    <div className="suspects-grid">
      {sospechosos.map((s) => {
        const isInterrogated = Boolean(interrogationsState[s.id] && interrogationsState[s.id].length > 0);

        return (
          <div key={s.id} className="suspect-card" id={`card-suspect-${s.id}`}>
            {isInterrogated && (
              <div className="stamp stamp-interrogated">
                INTERROGADO
              </div>
            )}
            <div className="mugshot-frame">
              <div className="height-lines"></div>
              <div className="height-marks">
                <div>6'0"</div>
                <div>5'9"</div>
                <div>5'6"</div>
                <div>5'3"</div>
                <div>5'0"</div>
              </div>
              <div className="mugshot-avatar">
                <svg viewBox="0 0 100 120" style={{ width: '90px', height: '110px', fill: '#2c251c' }}>
                  <circle cx="50" cy="35" r="22" />
                  <path d="M15 110 C 15 70, 85 70, 85 110 Z" />
                </svg>
              </div>
              <div className="police-placard">
                POLICE DEPT // ID: {s.id.toUpperCase()}
              </div>
            </div>
            <div className="suspect-info">
              <div className="suspect-name">{s.nombre}</div>
              <div className="suspect-profile">{s.perfil}</div>
              <div className="suspect-alibi">
                <strong>COARTADA DECLARADA:</strong> {s.coartada}
              </div>
            </div>
            <div className="suspect-card-actions">
              <button
                type="button"
                className="btn-wood primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onSelectSuspectToInterrogate(s)}
              >
                🎙 {isInterrogated ? 'Ver Interrogatorio' : 'Interrogar Sospechoso'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
