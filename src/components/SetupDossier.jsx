import React, { useState, useRef } from 'react';
import { CIUDADES_FAMOSAS, searchCitiesNominatim } from '../constants/cities';
import { ProgressBar } from './ProgressBar';

export function SetupDossier({ onGenerate, isGenerating, currentStep, statusText, genError, onRetry, onBack, onOpenSettings, hasApiKey }) {
  const [ciudad, setCiudad] = useState(CIUDADES_FAMOSAS[0]);
  const [dificultad, setDificultad] = useState('Normal');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
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

  const handleSelectCity = (cityName) => {
    setCiudad(cityName);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasApiKey) {
      alert("⚠️ No has configurado tu clave de API todavía. Te abrimos la ventana de configuración.");
      onOpenSettings();
      return;
    }
    onGenerate(ciudad, dificultad);
  };

  return (
    <div className="workspace" style={{ padding: '20px 0 60px 0' }}>
      <div className="setup-dossier">
        <div className="form-header">
          <div>
            <h2 className="form-title">PARÁMETROS DEL SUMARIO</h2>
            <div className="form-subtitle">
              Elegí una ciudad o dejá que la IA elija libremente. La época histórica, atmósfera y trama serán adaptadas.
            </div>
          </div>
          <span className="stamp">NOIR ARCHIVE</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* LUGAR / AMBIENTACIÓN */}
            <div className="form-group">
              <label className="form-label" htmlFor="inputCiudad">
                Lugar / Ambientación
              </label>
              <div className="city-input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  id="inputCiudad" 
                  className="form-control" 
                  value={ciudad}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (!ciudad) setSuggestions(CIUDADES_FAMOSAS);
                    setShowDropdown(true);
                  }}
                  disabled={isGenerating}
                  placeholder="Ej: Buenos Aires, Tokio, 'Pueblo costero en los 70'..." 
                  autoComplete="off"
                  style={{ width: '100%' }}
                />
                
                {showDropdown && suggestions.length > 0 && (
                  <div className="city-dropdown" style={{ display: 'block', zIndex: 100 }}>
                    {suggestions.map((item, idx) => (
                      <div 
                        key={idx}
                        className="city-option"
                        onClick={() => handleSelectCity(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#887459', marginTop: '4px' }}>
                Elegí una opción del listado o escribí cualquier ciudad/país/año libremente.
              </div>
            </div>

            {/* NIVEL DE DIFICULTAD */}
            <div className="form-group">
              <label className="form-label" htmlFor="selectDificultad">
                Nivel de Complejidad Criminal
              </label>
              <select 
                id="selectDificultad" 
                className="form-control"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                disabled={isGenerating}
              >
                <option value="Fácil">Fácil — 3 sospechosos, pistas directas, coartada débil</option>
                <option value="Normal">Normal — 4 sospechosos, pistas mixtas, coartadas creíbles</option>
                <option value="Difícil">Difícil — 4 sospechosos, coartada sólida y red herrings</option>
              </select>
              <div style={{ fontSize: '11px', color: '#887459', marginTop: '4px' }}>
                Determina la cantidad de sospechosos e inconsistencias sutiles.
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '14px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn-wood" 
              onClick={onBack}
              disabled={isGenerating}
            >
              ⬅ Volver a la Mesa
            </button>

            <button 
              type="submit" 
              className="btn-wood primary" 
              disabled={isGenerating}
              style={{ padding: '10px 24px', fontSize: '13px' }}
            >
              {isGenerating ? '🔍 Forjando Sumario Criminal...' : '🔍 Iniciar Investigación y Generar Caso'}
            </button>
          </div>

          {/* PROGRESS BAR BOX */}
          {isGenerating && (
            <div style={{ marginTop: '24px' }}>
              <ProgressBar currentStep={currentStep} statusText={statusText} />
            </div>
          )}

          {/* ERROR DISPLAY BOX */}
          {genError && (
            <div style={{ 
              marginTop: '20px',
              background: 'rgba(178, 34, 34, 0.08)', 
              border: '1.5px solid #8b1e1e', 
              padding: '16px 20px', 
              borderRadius: '4px',
              color: '#8b1e1e'
            }}>
              <strong style={{ fontSize: '13px' }}>⚠️ Incidencia durante la generación del sumario:</strong>
              <p style={{ margin: '6px 0 12px 0', fontSize: '12px', color: '#1a140d' }}>{genError}</p>
              <button 
                type="button" 
                className="btn-wood" 
                onClick={onRetry}
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                🔄 Reintentar Generación
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
