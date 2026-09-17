import React from 'react';

export function TabInforme({ publicInfo }) {
  if (!publicInfo) return null;

  return (
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '14px', marginBottom: '18px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
          PARTE OFICIAL DE INTERVENCIÓN
        </span>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', margin: '4px 0 8px 0' }}>
          {publicInfo.titulo}
        </h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--ink-faded)' }}>
          <div><strong>📍 Jurisdicción:</strong> {publicInfo.lugar || publicInfo.ciudad}</div>
          <div><strong>📅 Fecha/Época:</strong> {publicInfo.fecha || publicInfo.epoca}</div>
        </div>
      </div>

      {/* VÍCTIMA */}
      <div style={{ 
        background: 'rgba(163, 34, 34, 0.04)', 
        border: '1px solid var(--manila-dark)', 
        borderLeft: '4px solid var(--ink-stamp-red)', 
        padding: '14px 18px', 
        borderRadius: '0 4px 4px 0',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--ink-stamp-red)', textTransform: 'uppercase' }}>
          DATOS DE LA VÍCTIMA
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'var(--font-title)', margin: '4px 0' }}>
          {publicInfo.victima?.nombre}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ink-black)', lineHeight: 1.5 }}>
          {publicInfo.victima?.descripcion}
        </div>
      </div>

      {/* INFORME GENERAL */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-typewriter)', fontSize: '16px', marginBottom: '8px' }}>
          Resumen de las Actuaciones Policiales
        </h3>
        <p style={{ 
          fontSize: '13.5px', 
          lineHeight: '1.7', 
          fontFamily: 'var(--font-mono)', 
          color: 'var(--ink-black)', 
          whiteSpace: 'pre-line',
          background: 'rgba(0,0,0,0.02)',
          padding: '16px',
          border: '1px dashed var(--manila-dark)',
          borderRadius: '4px'
        }}>
          {publicInfo.informeGeneral}
        </p>
      </div>
    </div>
  );
}
