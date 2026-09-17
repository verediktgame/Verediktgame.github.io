import React from 'react';

export function TabEscena({ descripcionEscena, lugar }) {
  return (
    <div className="scene-container">
      <div className="scene-chalk-badge">
        <span>☠ REPORTE TÉCNICO DE ESCENA DEL CRIMEN</span>
        {lugar && <span style={{ marginLeft: '12px', opacity: 0.8 }}>// {lugar}</span>}
      </div>
      <div className="scene-text">
        {descripcionEscena || 'Cargando descripción pericial del lugar de los hechos...'}
      </div>
    </div>
  );
}
