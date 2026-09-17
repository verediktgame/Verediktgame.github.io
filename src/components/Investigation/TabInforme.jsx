import React from 'react';

export function TabInforme({ publicInfo }) {
  if (!publicInfo) return null;

  return (
    <div className="report-grid">
      <div className="victim-card">
        <div className="victim-silhouette">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C9.243 2 7 4.243 7 7c0 2.134 1.344 3.953 3.23 4.655C6.442 12.637 4 15.932 4 20h16c0-4.068-2.442-7.363-6.23-8.345C15.656 10.953 17 9.134 17 7c0-2.757-2.243-5-5-5z" />
          </svg>
        </div>
        <div className="victim-meta">
          <div><strong>VÍCTIMA:</strong> <span>{publicInfo.victima?.nombre || 'Sin identificar'}</span></div>
          <div style={{ marginTop: '10px' }}><strong>DESCRIPCIÓN / ANTECEDENTES:</strong></div>
          <div style={{ color: '#4a3c2a', marginTop: '4px' }}>{publicInfo.victima?.descripcion || '-'}</div>
        </div>
      </div>

      <div>
        <div className="official-report-text">
          {publicInfo.informeGeneral || 'Cargando sumario oficial...'}
        </div>
      </div>
    </div>
  );
}
