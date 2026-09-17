import React, { useState, useRef } from 'react';
import { CIUDADES_FAMOSAS, searchCitiesNominatim } from '../../constants/cities';
import { ProgressBar } from '../ProgressBar';

export function CoopSetup({
  onStartCoop,
  isGenerating,
  currentStep,
  statusText,
  genError,
  onRetry,
  onBack,
  onOpenSettings,
  hasApiKey
}) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Detective 1', 'Detective 2']);
  const [ciudad, setCiudad] = useState(CIUDADES_FAMOSAS[0]);
  const [dificultad, setDificultad] = useState('Normal');

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  const adjustPlayers = (delta) => {
    const nextCount = Math.min(4, Math.max(2, numPlayers + delta));
    if (nextCount === numPlayers) return;

    setNumPlayers(nextCount);
    setPlayerNames(prev => {
      const updated = [...prev];
      while (updated.length < nextCount) {
        updated.push(`Detective ${updated.length + 1}`);
      }
      return updated.slice(0, nextCount);
    });
  };

  const handleNameChange = (index, value) => {
    setPlayerNames(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleCityInput = (e) => {
    const val = e.target.value;
    setCiudad(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setSuggestions(CIUDADES_FAMOSAS);
      setShowDropdown(true);
      return;
    }

    const filteredLocal = CIUDADES_FAMOSAS.filter(c =>
      c.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filteredLocal);
    setShowDropdown(true);

    if (val.length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        const nominatimResults = await searchCitiesNominatim(val);
        const combined = Array.from(new Set([...filteredLocal, ...nominatimResults]));
        setSuggestions(combined);
      }, 350);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasApiKey) {
      alert('⚠️ No has configurado tu clave de API todavía. Te abrimos la ventana de configuración.');
      onOpenSettings();
      return;
    }

    const cleanNames = playerNames.map((name, i) => name.trim() || `Detective ${i + 1}`);
    onStartCoop(cleanNames, ciudad, dificultad);
  };

  return (
    <div className="workspace" style={{ padding: '20px 0 60px 0' }}>
      <div className="setup-dossier coop-setup">
        <div className="tape top-left"></div>
        <div className="tape top-right"></div>

        <div className="form-header">
          <div>
            <div className="tape-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
              MODO COOPERATIVO // MISMA PANTALLA
            </div>
            <h2 className="form-title">EQUIPO DE INVESTIGACIÓN POLICIAL</h2>
            <div className="form-subtitle">
              Todos los detectives examinan el mismo legajo, sospechosos y evidencias. Al final, cada detective elabora su pliego de cargos en secreto y compiten por el mejor veredicto.
            </div>
          </div>
          <span className="stamp">CO-OP TEAM</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* NUMBER OF DETECTIVES */}
            <div className="form-group full-width">
              <label className="form-label">Número de detectives (2–4 participantes) *</label>
              <div className="number-selector" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: '#faf6ea', border: '1px solid #b8a67e', padding: '6px 16px', borderRadius: '4px', width: 'fit-content' }}>
                <button
                  type="button"
                  className="btn-wood"
                  style={{ padding: '4px 14px', fontSize: '18px', fontWeight: 'bold' }}
                  onClick={() => adjustPlayers(-1)}
                  disabled={numPlayers <= 2 || isGenerating}
                >
                  −
                </button>
                <span id="playerCount" style={{ fontSize: '20px', fontFamily: 'var(--font-typewriter)', fontWeight: 'bold', color: '#1c160e', minWidth: '30px', textAlign: 'center' }}>
                  {numPlayers}
                </span>
                <button
                  type="button"
                  className="btn-wood"
                  style={{ padding: '4px 14px', fontSize: '18px', fontWeight: 'bold' }}
                  onClick={() => adjustPlayers(1)}
                  disabled={numPlayers >= 4 || isGenerating}
                >
                  +
                </button>
              </div>
            </div>

            {/* PLAYER NAMES */}
            <div className="form-group full-width">
              <label className="form-label">Identificación de los Detectives *</label>
              <div id="playerNamesContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {playerNames.map((name, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#68543e', textTransform: 'uppercase', fontFamily: 'var(--font-typewriter)' }}>
                      Detective #{idx + 1}
                    </span>
                    <input
                      type="text"
                      className="form-control player-name-input"
                      value={name}
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                      placeholder={`Detective ${idx + 1}`}
                      disabled={isGenerating}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CIUDAD / AMBIENTACIÓN */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="inputCity">
                Ciudad / Ambientación *
              </label>
              <input
                id="inputCity"
                type="text"
                className="form-control"
                value={ciudad}
                onChange={handleCityInput}
                onFocus={() => {
                  setSuggestions(CIUDADES_FAMOSAS);
                  setShowDropdown(true);
                }}
                placeholder="Ej: Buenos Aires, Londres victoriano, Chicago años 30..."
                disabled={isGenerating}
                required
              />

              {showDropdown && suggestions.length > 0 && !isGenerating && (
                <div
                  className="suggestions-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: 'var(--paper-cream)',
                    border: '1px solid var(--manila-dark)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        borderBottom: '1px dashed #d5c8ad',
                        color: '#1a140d'
                      }}
                      onClick={() => {
                        setCiudad(item);
                        setShowDropdown(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DIFICULTAD */}
            <div className="form-group">
              <label className="form-label" htmlFor="selectDiff">
                Nivel de Dificultad *
              </label>
              <select
                id="selectDiff"
                className="form-control"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                disabled={isGenerating}
              >
                <option value="Fácil">Fácil (Pistas directas, coartada débil)</option>
                <option value="Normal">Normal (Contradicciones creíbles, 4 sospechosos)</option>
                <option value="Difícil">Difícil (Red herrings, coartadas sólidas)</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-wood"
              onClick={onBack}
              disabled={isGenerating}
            >
              ◀ Volver al Menú
            </button>

            <button
              type="submit"
              className="btn-wood primary"
              style={{ padding: '12px 28px', fontSize: '14px' }}
              disabled={isGenerating}
            >
              🚀 Iniciar Investigación en Equipo
            </button>
          </div>
        </form>

        {/* PROGRESS BAR WHILE GENERATING */}
        {isGenerating && (
          <div style={{ marginTop: '24px' }}>
            <ProgressBar currentStep={currentStep} totalSteps={6} statusText={statusText} />
          </div>
        )}

        {/* ERROR BOX */}
        {genError && (
          <div className="generation-error-box" style={{ marginTop: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
              ⚠️ Interrupción en el sumario policial:
            </div>
            <div>{genError}</div>
            <button
              type="button"
              className="btn-wood"
              style={{ marginTop: '12px' }}
              onClick={onRetry}
            >
              ⎌ Reintentar Generación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
