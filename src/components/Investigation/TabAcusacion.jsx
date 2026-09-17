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
    <div className="accusation-form-card">
      <div className="accusation-stamp">
        <span className="stamp">RESOLUCIÓN FINAL</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: '#8b1e1e', letterSpacing: '2px', margin: '0 0 6px 0' }}>
        FORMULARIO DE CARGOS Y CIERRE SUMARIAL
      </h3>
      <p style={{ fontSize: '13px', color: '#55442e', marginTop: '4px', marginBottom: '20px' }}>
        Presenta tus conclusiones formales ante el tribunal. Una vez enviados los cargos, el caso quedará sellado.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="accusation-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="selectAcusado">Sospechoso Acusado *</label>
            <select
              id="selectAcusado"
              className="form-control"
              value={acusadoId}
              onChange={(e) => setAcusadoId(e.target.value)}
              disabled={isEvaluating}
              required
            >
              <option value="">-- Seleccionar al culpable --</option>
              {sospechosos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.id.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="selectArma">Arma / Método del Crimen *</label>
            <select
              id="selectArma"
              className="form-control"
              value={armaId}
              onChange={(e) => setArmaId(e.target.value)}
              disabled={isEvaluating}
              required
            >
              <option value="">-- Seleccionar evidencia homicida --</option>
              {evidencias.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.objeto} ({e.id.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="textMotivo">Móvil del Crimen *</label>
            <textarea
              id="textMotivo"
              className="form-control"
              rows="3"
              placeholder="¿Por qué lo hizo? Explica la motivación oculta del perpetrador..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              disabled={isEvaluating}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="textReconstruccion">Reconstrucción de los Hechos *</label>
            <textarea
              id="textReconstruccion"
              className="form-control"
              rows="5"
              placeholder="Narra minuciosamente cómo se ejecutó el crimen, qué pistas lo demuestran y cómo se resolvió..."
              value={reconstruccion}
              onChange={(e) => setReconstruccion(e.target.value)}
              disabled={isEvaluating}
              required
            />
          </div>
        </div>

        {validationError && (
          <div style={{ color: '#8b1e1e', fontWeight: 'bold', marginTop: '16px', fontSize: '13px' }}>
            ⚠️ {validationError}
          </div>
        )}

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <button
            type="submit"
            className="btn-wood primary"
            id="btnSubmitVerdict"
            style={{ padding: '14px 28px', fontSize: '14px' }}
            disabled={isEvaluating}
          >
            ⚖ ENVIAR ACUSACIÓN AL TRIBUNAL
          </button>
        </div>

        {isEvaluating && (
          <div className="loading-state" style={{ display: 'block', marginTop: '20px' }}>
            <div className="teletype-text">EL TRIBUNAL Y EL JURADO EXAMINAN TU ACUSACIÓN...</div>
            <div className="typewriter-cursor"></div>
          </div>
        )}
      </form>
    </div>
  );
}
