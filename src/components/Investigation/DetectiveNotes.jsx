import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function DetectiveNotes({ caseTitle = '', currentPlayerName = null, isCoop = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Storage key: individual in coop mode, per-case otherwise
  const safeTitle = (caseTitle || 'actual').trim().replace(/\s+/g, '_');
  const storageKey = isCoop && currentPlayerName
    ? `veredikt_notes_${safeTitle}_${currentPlayerName.trim()}`
    : `veredikt_notes_${safeTitle}`;

  // Load notes on mount or when case/player changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setNotes(saved || '');
    } catch (e) {
      console.error('Error loading notes:', e);
    }
  }, [storageKey]);

  // Handle note change
  const handleChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    try {
      localStorage.setItem(storageKey, val);
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  };

  // Close drawer with Escape (only when open)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clear notes
  const handleClear = () => {
    if (window.confirm('¿Seguro que deseás borrar todas las notas de este expediente?')) {
      setNotes('');
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.error('Error clearing notes:', err);
      }
    }
  };

  return createPortal(
    <>
      {/* VERTICAL FLOATING TAB BUTTON ON RIGHT EDGE */}
      <button
        type="button"
        className={`notes-edge-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Abrir cuaderno de notas del detective"
        aria-expanded={isOpen}
      >
        <span className="notes-btn-icon">📝</span>
        <span className="notes-btn-text">NOTAS</span>
      </button>

      {/* SLIDING SIDE DRAWER */}
      <aside id="notesPanel" className={`notes-panel ${isOpen ? 'open' : ''}`}>
        <div className="notes-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📝</span>
            <div>
              <span className="notes-title">CUADERNO DE NOTAS</span>
              {isCoop && currentPlayerName && (
                <div style={{ fontSize: '11px', color: '#9e2b2b', fontWeight: 'bold' }}>
                  Detective: {currentPlayerName}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="notes-close-btn"
            onClick={() => setIsOpen(false)}
            title="Cerrar panel de notas"
          >
            ✕
          </button>
        </div>

        <textarea
          id="detectiveNotes"
          className="notes-textarea"
          value={notes}
          onChange={handleChange}
          placeholder={`Anotá tus sospechas, conexiones entre pistas, teorías...

Ejemplo:
— Marco tiene coartada débil para las 22hs
— La huella en el vaso no coincide con ningún sospechoso conocido
— Elena mintió sobre su ubicación`}
        />

        <div className="notes-footer">
          <button type="button" className="notes-clear-btn" onClick={handleClear}>
            🗑 Borrar todo
          </button>
          <span className="notes-counter" id="notesCounter">
            {notes.length} caracteres
          </span>
        </div>
      </aside>
    </>,
    document.body
  );
}
