import React, { useState } from 'react';

export function CoopTurnAccusation({
  players = [],
  currentPlayerIndex = 0,
  sospechosos = [],
  evidencias = [],
  onSubmitPlayerTurn,
  isEvaluating
}) {
  const [acusadoId, setAcusadoId] = useState('');
  const [armaId, setArmaId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [reconstruccion, setReconstruccion] = useState('');
  const [validationError, setValidationError] = useState('');

  const currentDetectiveName = players[currentPlayerIndex] || `Detective ${currentPlayerIndex + 1}`;
  const totalPlayers = players.length;
  const isLastPlayer = currentPlayerIndex >= totalPlayers - 1;

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
    if (!reconstruccion.trim() || reconstruccion.trim().length < 20) {
      setValidationError('La reconstrucción debe detallar tu hipótesis de cómo ocurrió el hecho.');
      return;
    }

    setValidationError('');
    onSubmitPlayerTurn({
      acusadoId,
      armaId,
      motivo: motivo.trim(),
      reconstruccion: reconstruccion.trim()
    });

    // Reset fields for the next player
    setAcusadoId('');
    setArmaId('');
    setMotivo('');
    setReconstruccion('');
  };

  return (
    <div className="accusation-form-card coop-turn-card">
      <div className="accusation-stamp">
        <span className="stamp">TURNO SECRETO</span>
      </div>

      <div style={{ borderBottom: '2px dashed #8b1e1e', paddingBottom: '16px', marginBottom: '22px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: '#8b1e1e', textTransform: 'uppercase' }}>
          TURNO DE ACUSACIÓN COOPERATIVO
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', color: '#1a130b', margin: '4px 0 6px 0' }}>
          Detective {currentPlayerIndex + 1} de {totalPlayers}: <span style={{ color: '#8b1e1e' }}>{currentDetectiveName}</span>
        </h2>
        <div style={{ background: '#2c1e15', color: '#f3e8d2', padding: '6px 14px', borderRadius: '3px', display: 'inline-block', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>
          🤫 [El resto de los detectives mira para otro lado]
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="accusation-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="selectAcusadoCoop">
              Sospechoso Acusado *
            </label>
            <select
              id="selectAcusadoCoop"
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
            <label className="form-label" htmlFor="selectArmaCoop">
              Arma / Método Homicida *
            </label>
            <select
              id="selectArmaCoop"
              className="form-control"
              value={armaId}
              onChange={(e) => setArmaId(e.target.value)}
              disabled={isEvaluating}
              required
            >
              <option value="">-- Seleccionar evidencia determinante --</option>
              {evidencias.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.objeto} ({e.id.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="textMotivoCoop">
              Móvil del Crimen *
            </label>
            <textarea
              id="textMotivoCoop"
              className="form-control"
              rows="3"
              placeholder="¿Por qué lo hizo? Explica la motivación oculta..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              disabled={isEvaluating}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="textReconstruccionCoop">
              Reconstrucción de los Hechos *
            </label>
            <textarea
              id="textReconstruccionCoop"
              className="form-control"
              rows="5"
              placeholder="Detallá minuciosamente cómo se ejecutó el crimen según tu deducción..."
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

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            className="btn-wood primary"
            style={{ padding: '14px 28px', fontSize: '14px' }}
            disabled={isEvaluating}
          >
            {isLastPlayer
              ? '⚖ Enviar Todas las Acusaciones al Tribunal'
              : `Confirmar Acusación y Pasar al Detective ${currentPlayerIndex + 2} ➔`}
          </button>
        </div>

        {isEvaluating && (
          <div className="loading-state" style={{ display: 'block', marginTop: '20px' }}>
            <div className="teletype-text">
              EL TRIBUNAL EXAMINA LAS DEDUCCIONES DE CADA DETECTIVE EN SECUENCIA...
            </div>
            <div className="typewriter-cursor"></div>
          </div>
        )}
      </form>
    </div>
  );
}
