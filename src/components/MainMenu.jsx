import React, { useRef } from 'react';
import { importCaseFromJson } from '../services/caseFileIO';
import { API_PROVIDERS } from '../constants/providers';

export function MainMenu({ onStartNew, onLoadDemo, onCaseLoaded, onOpenSettings, onOpenMyApi, currentConfig }) {
  const fileInputRef = useRef(null);
  const provider = API_PROVIDERS[currentConfig?.provider] || API_PROVIDERS['groq'];
  const hasKey = Boolean(currentConfig?.apiKey);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importCaseFromJson(file);
      onCaseLoaded(imported);
    } catch (err) {
      alert(`Error al importar el archivo: ${err.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="workspace" style={{ paddingBottom: '60px' }}>
      <div className="cover-dossier">
        {/* PHYSICAL NOIR ELEMENTS */}
        <div className="clip-metal" />
        <div className="coffee-stain" />

        {/* QUICK ACCESS BAR — top right of the dossier */}
        <div className="cover-quick-bar">
          <button 
            type="button" 
            className="cover-quick-btn"
            onClick={onOpenMyApi}
            title="Ver consumo y comparativa de 10 proveedores de IA"
          >
            <span className="cover-quick-icon">📊</span>
            <span className="cover-quick-label">Mi API</span>
          </button>
          <div className="cover-quick-divider" />
          <button 
            type="button" 
            className="cover-quick-btn"
            onClick={onOpenSettings}
            title="Configurar proveedor, modelo y clave de API"
          >
            <span className="cover-quick-icon">⚙️</span>
            <span className="cover-quick-label">Ajustes</span>
          </button>
        </div>

        {/* COVER HEADER */}
        <div className="cover-header">
          <div className="cover-badge-text">División de Crímenes No Resueltos & Delitos Graves</div>
          <h1 className="cover-main-title">VEREDIKT</h1>
          <div className="cover-case-label">SUMARIO POLICIAL CONFIDENCIAL // LEGAJO PENAL</div>
        </div>

        {/* STAMPS */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="stamp">CLASIFICADO</span>
          <span className="stamp blue" style={{ marginLeft: '16px' }}>SUMARIO #1947</span>
        </div>

        {/* COVER CONTENT & METADATA */}
        <div className="cover-content">
          <p className="cover-warning">
            <strong>ADVERTENCIA OFICIAL:</strong> Los documentos contenidos en este legajo corresponden a escenas del crimen, declaraciones juradas, peritajes dactiloscópicos y testimonios bajo reserva sumaria. Toda deducción apresurada puede absolver a un culpable o encarcelar a un inocente.
          </p>
          <div className="cover-grid-meta">
            <div><strong>PROTOCOLO:</strong> IA Quirúrgica (6 Fases)</div>
            <div><strong>SISTEMA:</strong> BYOK (Claves Seguras en Navegador)</div>
            <div><strong>ESTADO DEL SUMARIO:</strong> Activo / Pendiente</div>
            <div><strong>PERITAJES FORENSES:</strong> Estrictamente limitados (2 máx)</div>
          </div>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="cover-actions">
          <button 
            type="button" 
            className="btn-wood primary btn-big-action" 
            onClick={onStartNew}
          >
            📁 Abrir Nuevo Expediente Criminal
          </button>

          <button 
            type="button" 
            className="btn-wood secondary btn-big-action" 
            onClick={onLoadDemo}
            title="Jugar de inmediato el caso del relojero Pendelton sin consumir tokens"
          >
            🕵️ Caso de Muestra Modelo (Modo Offline)
          </button>

          <button 
            type="button" 
            className="btn-wood btn-import-case" 
            onClick={() => fileInputRef.current?.click()}
            title="Cargar un expediente previamente guardado en formato JSON"
          >
            📂 Importar Expediente Guardado (.json)
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* STATUS STRIP — active connection info */}
        <div className="cover-status-strip">
          <div className="cover-status-left">
            <span className="cover-status-dot" data-active={hasKey ? 'true' : 'false'} />
            <span className="cover-status-text">
              {hasKey 
                ? <>Canal activo: <strong>{provider.name}</strong> {provider.freeTier ? '(Free Tier)' : ''}</>
                : <>Sin clave configurada — <button type="button" className="cover-status-link" onClick={onOpenSettings}>configurar ahora</button></>
              }
            </span>
          </div>
          <div className="cover-status-right">
            <span className="cover-status-proto">PROTOCOLO BYOK v4.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}
