import React from 'react';

export function TabEscena({ descripcionEscena, lugar }) {
  return (
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '12px', marginBottom: '18px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-blue)', fontWeight: 'bold' }}>
          INSPECCIÓN OCULAR
        </span>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', margin: '4px 0' }}>
          Escena del Crimen
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
          Detalle minucioso del entorno, indicios ambientales y estado del lugar al arribo de la patrulla.
        </p>
      </div>

      <div style={{ 
        background: 'rgba(0,0,0,0.02)', 
        border: '1px solid var(--manila-dark)', 
        padding: '20px', 
        borderRadius: '4px',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.04)'
      }}>
        <div style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
          📍 UBICACIÓN CONSIGNADA: {lugar}
        </div>
        <p style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '14px', 
          lineHeight: '1.8', 
          color: 'var(--ink-black)', 
          whiteSpace: 'pre-line',
          margin: 0
        }}>
          {descripcionEscena}
        </p>
      </div>
    </div>
  );
}
