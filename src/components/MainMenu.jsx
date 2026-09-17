import React, { useRef } from 'react';
import { importCaseFromJson } from '../services/caseFileIO';
import { API_PROVIDERS } from '../constants/providers';
import { DeskClock } from './DeskClock';
import { SteamingCoffee } from './SteamingCoffee';
import { checkHarryPotterEasterEgg } from '../constants/harryPotterCase';

export function MainMenu({
  onStartNew,
  onLoadDemo,
  onCaseLoaded,
  onOpenSettings,
  onOpenMyApi,
  onStartCoopSetup,
  onOpenAchievements,
  onLoadHarryPotter,
  currentConfig
}) {
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

  const handleNuevoCasoClick = () => {
    // Check Harry Potter Easter Egg (9:45 - 10:00)
    if (checkHarryPotterEasterEgg()) {
      onLoadHarryPotter();
      return;
    }
    onStartNew();
  };

  return (
    <div className="workspace" style={{ paddingBottom: '60px' }}>
      <div className="detective-desk-surface">
        {/* DESK HEADER BAR: CLOCK, DEPT TITLE, STEAMING COFFEE */}
        <div className="desk-objects-bar">
          <div className="desk-corner-left">
            <SteamingCoffee />
          </div>

          <div className="desk-center-branding">
            <div className="desk-agency-badge">PRECINCT NO. 7 // HOMICIDE DIVISION</div>
            <h1 className="desk-brand-title">VEREDIKT</h1>
            <div className="desk-brand-subtitle">
              MESA DE ARCHIVOS CRIMINALES & DEDUCCIÓN FORENSE
            </div>
          </div>

          <div className="desk-corner-right">
            <DeskClock />
          </div>
        </div>

        {/* QUICK SETTINGS & STATUS BAR */}
        <div className="desk-status-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#bca685' }}>Motor de IA activo:</span>
            <span className="desk-provider-tag" onClick={onOpenSettings} title="Cambiar proveedor o modelo">
              {provider.name}
            </span>
            <span className={`status-dot ${hasKey ? 'active' : 'inactive'}`} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="desk-tool-btn"
              onClick={onOpenMyApi}
              title="Estadísticas y comparativa de modelos"
            >
              📊 Mi API
            </button>
            <button
              type="button"
              className="desk-tool-btn"
              onClick={onOpenSettings}
              title="Configuración de claves y endpoints"
            >
              ⚙️ Ajustes
            </button>
          </div>
        </div>

        {/* FOLDERS GRID (ESCRITORIO NOIR) */}
        <div className="folders-grid">
          {/* 1. NUEVO CASO */}
          <button
            type="button"
            className="folder-btn folder-primary"
            onClick={handleNuevoCasoClick}
          >
            <div className="folder-tab">EXPEDIENTE 01</div>
            <div className="folder-content">
              <span className="folder-icon">📁</span>
              <div className="folder-title">NUEVO CASO</div>
              <div className="folder-desc">
                La IA genera un expediente policial inédito con sospechosos y pistas forenses.
              </div>
            </div>
            <div className="folder-stamp-mark">GENERAR</div>
          </button>

          {/* 2. COMUNIDAD (IMPORTAR) */}
          <button
            type="button"
            className="folder-btn folder-community"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="folder-tab">COMUNIDAD</div>
            <div className="folder-content">
              <span className="folder-icon">📂</span>
              <div className="folder-title">COMUNIDAD</div>
              <div className="folder-desc">
                Importar caso (.json) creado o compartido por otro detective.
              </div>
            </div>
            <div className="folder-stamp-mark">IMPORTAR</div>
          </button>

          {/* 3. MIS CASOS (CASO DEMO / HISTORIAL) */}
          <button
            type="button"
            className="folder-btn folder-history"
            onClick={onLoadDemo}
          >
            <div className="folder-tab">ARCHIVO LOCAL</div>
            <div className="folder-content">
              <span className="folder-icon">🗄️</span>
              <div className="folder-title">MIS CASOS</div>
              <div className="folder-desc">
                Abrir caso modelo precargado (offline) sin consumir tokens de API.
              </div>
            </div>
            <div className="folder-stamp-mark">OFFLINE</div>
          </button>

          {/* 4. LOGROS */}
          <button
            type="button"
            className="folder-btn folder-achievements"
            onClick={onOpenAchievements}
          >
            <div className="folder-tab">CONDECORACIONES</div>
            <div className="folder-content">
              <span className="folder-icon">🏆</span>
              <div className="folder-title">LOGROS</div>
              <div className="folder-desc">
                Tus trofeos periciales, casos resueltos a tiempo y méritos policiales.
              </div>
            </div>
            <div className="folder-stamp-mark">TROFEOS</div>
          </button>

          {/* 5. MODO COOPERATIVO (FULL WIDTH) */}
          <button
            type="button"
            className="folder-btn folder-coop full-span"
            onClick={onStartCoopSetup}
          >
            <div className="folder-tab">EQUIPO FORENSE</div>
            <div className="folder-content-coop">
              <span className="folder-icon" style={{ fontSize: '38px' }}>👥</span>
              <div>
                <div className="folder-title" style={{ fontSize: '20px' }}>MODO COOPERATIVO</div>
                <div className="folder-desc" style={{ fontSize: '13px' }}>
                  Varios detectives en la misma pantalla. Todos analizan el mismo caso y envían su deducción en turnos secretos.
                </div>
              </div>
            </div>
            <div className="folder-stamp-mark">2–4 JUGADORES</div>
          </button>
        </div>

        {/* HIDDEN FILE INPUT FOR IMPORT */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json,application/json"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
