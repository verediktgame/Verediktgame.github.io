import React from 'react';

export function TabDeclaraciones({ declaraciones = [] }) {
  return (
    <div className="witness-list">
      {declaraciones.length === 0 ? (
        <div className="official-report-text">No constan declaraciones testimoniales en el legajo.</div>
      ) : (
        declaraciones.map((w, idx) => (
          <div key={idx} className="witness-card">
            <div className="witness-header">
              <div className="witness-name">
                <span>TESTIGO #{idx + 1}: {w.testigo}</span>
                <span className="witness-badge">{w.relacion}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#72624a', fontFamily: 'var(--font-typewriter)' }}>
                ACTA TOMADA
              </span>
            </div>
            <div className="witness-text">"{w.texto}"</div>
          </div>
        ))
      )}
    </div>
  );
}
