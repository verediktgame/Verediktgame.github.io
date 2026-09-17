import React, { useState } from 'react';

export function TabAcusacion({ sospechosos = [], evidencias = [], onSubmitAccusation, isEvaluating }) {
  const [acusadoId, setAcusadoId] = useState('');
  const [armaId, setArmaId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [reconstruccion, setReconstruccion] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acusadoId) {
      setValidationError('Debes señalar a un sospechoso principal.');
      return;
    }
    if (!armaId) {
      setValidationError('Debes seleccionar el arma o instrumento del delito.');
      return;
    }
    if (!motivo.trim() || motivo.trim().length < 10) {
      setValidationError('El móvil del crimen debe explicarse con al menos una oración clara.');
      return;
    }
    if (!reconstruccion.trim() || reconstruccion.trim().length < 25) {
      setValidationError('La reconstrucción debe detallar cómo ocurrieron los hechos según tu hipótesis.');
      return;
    }

    setValidationError('');
    onSubmitAccusation({
      acusadoId,
      armaId,
      motivo: motivo.trim(),
      reconstruccion: reconstruccion.trim()
    });
  };

  return (
    <div className="tab-panel active" style={{ padding: '20px' }}>
      <div style={{ borderBottom: '2px solid var(--manila-dark)', paddingBottom: '12px', marginBottom: '18px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
          TRIBUNAL DE JUSTICIA
        </span>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', margin: '4px 0' }}>
          Pliego Formal de Acusación
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
          Una vez presentado el informe al fiscal y al jurado, el caso entrará en deliberación definitiva.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* SOSPECHOSO PRINCIPAL */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
            1. ¿A quién acusa formalmente del homicidio / crimen?
          </label>
          <select 
            value={acusadoId} 
            onChange={(e) => setAcusadoId(e.target.value)}
            disabled={isEvaluating}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px'
            }}
          >
            <option value="">-- Seleccionar al sospechoso culpable --</option>
            {sospechosos.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre} ({s.id})
              </option>
            ))}
          </select>
        </div>

        {/* ARMA / INSTRUMENTO */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
            2. ¿Cuál fue el arma homicida o instrumento determinante?
          </label>
          <select 
            value={armaId} 
            onChange={(e) => setArmaId(e.target.value)}
            disabled={isEvaluating}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px'
            }}
          >
            <option value="">-- Seleccionar el arma de la lista de evidencias --</option>
            {evidencias.map(e => (
              <option key={e.id} value={e.id}>
                {e.objeto} ({e.id})
              </option>
            ))}
          </select>
        </div>

        {/* MÓVIL */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
            3. Móvil del crimen (¿Por qué lo hizo?):
          </label>
          <input 
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={isEvaluating}
            placeholder="ej: Desesperación por deudas y venganza personal..."
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px'
            }}
          />
        </div>

        {/* RECONSTRUCCIÓN */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
            4. Reconstrucción cronológica de los hechos:
          </label>
          <textarea 
            rows={4}
            value={reconstruccion}
            onChange={(e) => setReconstruccion(e.target.value)}
            disabled={isEvaluating}
            placeholder="Explicá cómo ingresó el culpable, cómo usó el arma, qué intentó ocultar y cómo coinciden las pruebas de la escena..."
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* ERROR VALIDATION */}
        {validationError && (
          <div style={{ color: 'var(--ink-stamp-red)', fontSize: '12px', fontWeight: 'bold' }}>
            ⚠️ {validationError}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn-paper btn-primary" 
            disabled={isEvaluating}
            style={{ fontSize: '14px', padding: '10px 24px', fontWeight: 'bold' }}
          >
            {isEvaluating ? 'Deliberando ante el Tribunal...' : '⚖️ Presentar Acusación al Tribunal'}
          </button>
        </div>
      </form>
    </div>
  );
}
