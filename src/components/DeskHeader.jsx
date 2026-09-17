import React from 'react';
import { API_PROVIDERS } from '../constants/providers';

export function DeskHeader({ currentConfig, onOpenSettings, onOpenMyApi, onGoHome, currentScreen }) {
  const provider = API_PROVIDERS[currentConfig?.provider] || API_PROVIDERS['groq'];
  const hasKey = Boolean(currentConfig?.apiKey);

  return (
    <header className="desk-header">
      <div className="dept-badge" onClick={onGoHome} style={{ cursor: 'pointer' }} title="Volver al sumario principal">
        <div className="badge-star">★</div>
        <div>
          <div className="dept-title">VEREDIKT</div>
          <div className="dept-sub">DIVISIÓN DE HOMICIDIOS & FORENSE</div>
        </div>
      </div>

      <div className="header-actions">
        {currentScreen !== 'menu' && (
          <button 
            type="button"
            className="btn-wood" 
            onClick={onGoHome}
            title="Volver a la mesa de entrada"
          >
            ◀ Mesa de Entrada
          </button>
        )}

        <button 
          type="button"
          className="btn-wood secondary" 
          onClick={onOpenMyApi}
          title="Ver consumo, estadísticas y comparativa de 10 APIs"
        >
          📊 Mi API
          <span className="header-provider-pill">
            {provider.name}
          </span>
        </button>

        <button 
          type="button"
          className="btn-wood" 
          onClick={onOpenSettings}
          title="Configurar proveedor, modelo o clave de API"
        >
          ⚙️ Ajustes
          <span className={`header-key-indicator ${hasKey ? 'active' : 'missing'}`}>
            {hasKey ? '●' : '!'}
          </span>
        </button>
      </div>
    </header>
  );
}
