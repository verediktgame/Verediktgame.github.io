import React from 'react';

export function TabDeclaraciones({ declaraciones = [] }) {
  return (
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '12px', marginBottom: '18px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-blue)', fontWeight: 'bold' }}>
          ACTAS TESTIMONIALES
        </span>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', margin: '4px 0' }}>
          Declaraciones de Testigos
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
          Testimonios recabados por los oficiales de ronda en las inmediaciones del suceso.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {declaraciones.map((dec, idx) => (
          <div 
            key={idx}
            style={{ 
              background: 'rgba(0,0,0,0.02)', 
              border: '1px solid var(--manila-dark)', 
              padding: '16px', 
              borderRadius: '4px',
              boxShadow: '1px 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'var(--font-typewriter)' }}>
                🗣️ {dec.testigo}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--ink-stamp-blue)', fontStyle: 'italic', background: 'rgba(27,61,108,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                {dec.relacion}
              </span>
            </div>
            <p style={{ 
              fontSize: '13px', 
              lineHeight: '1.6', 
              color: 'var(--ink-black)', 
              fontStyle: 'italic', 
              margin: 0,
              paddingLeft: '12px',
              borderLeft: '3px solid var(--ink-faded)'
            }}>
              "{dec.texto}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
