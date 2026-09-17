import React, { useState } from 'react';
import { exportCaseToJson } from '../../services/caseFileIO';

export function CoopRankingScreen({
  coopResults = [], // [{ player: 'Lucas', score: 85, condena: '...', desglose: {...} }, ...]
  truth,
  publicInfo,
  onPlayAgain,
  onGoHome
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Ranking, 2: Hechos Reales, 3: Sentencia

  if (!coopResults || coopResults.length === 0 || !truth) return null;

  // Sort players descending by score
  const sorted = [...coopResults].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sorted[0];

  const handleExport = () => {
    exportCaseToJson(publicInfo, truth);
  };

  return (
    <div className="workspace" style={{ paddingBottom: '60px' }}>
      <div className="verdict-dossier coop-verdict-dossier">
        <div className="tape top-left"></div>
        <div className="tape top-right"></div>

        {/* STEP 1: RANKING COOPERATIVO */}
        {currentStep === 1 && (
          <div className="verdict-step active">
            <div className="sheet-header" style={{ marginBottom: '24px' }}>
              <div>
                <div className="tape-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
                  EXPEDIENTE DE INVESTIGACIÓN CONJUNTA
                </div>
                <h2 className="case-title" style={{ fontSize: '26px', margin: 0 }}>
                  🏆 RANKING FINAL DE DETECTIVES
                </h2>
                <div className="case-meta-line" style={{ marginTop: '4px' }}>
                  Caso: <strong>{publicInfo.titulo}</strong> | Veredicto del Tribunal Supremo
                </div>
              </div>
              <span className="stamp" style={{ color: '#d4af37', borderColor: '#d4af37' }}>
                PODIO OFICIAL
              </span>
            </div>

            {/* WINNER SPOTLIGHT */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2b2014 0%, #17110a 100%)',
                border: '2px solid #d4af37',
                borderRadius: '6px',
                padding: '24px',
                color: '#f6ede0',
                textAlign: 'center',
                marginBottom: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>👑</div>
              <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#e6c88b' }}>
                DETECTIVE GANADOR / RESOLUCIÓN MÁS PRECISA
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-title)', margin: '6px 0', color: '#fff' }}>
                {winner.player}
              </div>
              <div style={{ fontSize: '32px', fontFamily: 'var(--font-typewriter)', color: '#d4af37', fontWeight: 'bold' }}>
                {winner.score} <span style={{ fontSize: '18px', color: '#c4b59f' }}>/ 100 pts</span>
              </div>
              <div style={{ fontSize: '13px', color: '#ded1bd', fontStyle: 'italic', marginTop: '6px' }}>
                "{winner.condena || 'Condena ejemplar lograda ante el jurado'}"
              </div>
            </div>

            {/* RANKING TABLE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {sorted.map((res, idx) => {
                const rankLabels = ['1°', '2°', '3°', '4°'];
                const rankBadgeColors = ['#d4af37', '#a8a8a8', '#cd7f32', '#705b45'];

                return (
                  <div
                    key={idx}
                    style={{
                      background: '#faf6ea',
                      border: '1px solid #c9b994',
                      borderLeft: `6px solid ${rankBadgeColors[idx] || '#8b1e1e'}`,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      boxShadow: '1px 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span
                        style={{
                          fontSize: '22px',
                          fontWeight: 'bold',
                          fontFamily: 'var(--font-typewriter)',
                          color: rankBadgeColors[idx] || '#333',
                          minWidth: '36px'
                        }}
                      >
                        {rankLabels[idx] || `${idx + 1}°`}
                      </span>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#1a130b' }}>
                          {res.player}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#55422d', fontStyle: 'italic', marginTop: '2px' }}>
                          "{res.condena || 'Resolución penal del caso'}"
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-typewriter)', color: res.score >= 50 ? '#1b5e20' : '#8b1e1e' }}>
                        {res.score} pts
                      </div>
                      <div style={{ fontSize: '11px', color: '#7a664e' }}>
                        {res.desglose?.culpable?.acerto ? '✓ Culpable acertado' : '✗ Culpable fallido'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION TO STEP 2 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-wood primary"
                onClick={() => setCurrentStep(2)}
                style={{ padding: '12px 26px', fontSize: '14px' }}
              >
                Ver los Hechos Reales del Caso ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LA VERDAD OCULTA (SECUENCIA REAL) */}
        {currentStep === 2 && (
          <div className="verdict-step active">
            <div className="sheet-header" style={{ marginBottom: '20px' }}>
              <div>
                <div className="tape-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
                  PASO 2 // REVELACIÓN DE LA VERDAD
                </div>
                <h2 className="case-title" style={{ fontSize: '24px', margin: 0 }}>
                  CÓMO OCURRIERON REALMENTE LOS HECHOS
                </h2>
              </div>
              <span className="stamp" style={{ color: 'var(--ink-stamp-blue)', borderColor: 'var(--ink-stamp-blue)' }}>
                REVELADO
              </span>
            </div>

            {/* SECUENCIA REAL */}
            <div
              style={{
                background: 'rgba(27, 61, 108, 0.05)',
                border: '1px solid var(--manila-dark)',
                padding: '20px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                lineHeight: '1.8',
                marginBottom: '24px',
                whiteSpace: 'pre-line',
                color: '#1a140d'
              }}
            >
              {truth.secuenciaReal || 'Detalle reservado en sumario.'}
            </div>

            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', color: 'var(--ink-stamp-blue)', marginBottom: '12px', letterSpacing: '1px' }}>
              PISTAS CLAVE QUE EL EQUIPO DEBIÓ HABER NOTADO:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {(truth.pistasClave || []).map((clue, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#faf6ea',
                    borderLeft: '4px solid var(--ink-stamp-blue)',
                    border: '1px solid #c9b994',
                    borderLeftWidth: '4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#1c160e'
                  }}
                >
                  📌 {clue}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-wood"
                onClick={() => setCurrentStep(1)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                ⬅ Volver al Podio
              </button>

              <button
                type="button"
                className="btn-wood primary"
                onClick={() => setCurrentStep(3)}
                style={{ fontSize: '13px', padding: '10px 22px', fontWeight: 'bold' }}
              >
                Paso 3: Sentencia y Condena Judicial ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESOLUCIÓN Y SENTENCIA */}
        {currentStep === 3 && (
          <div className="verdict-step active">
            <div className="sheet-header" style={{ marginBottom: '24px' }}>
              <div>
                <div className="tape-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
                  PASO 3 // DICTAMEN FINAL DEL TRIBUNAL
                </div>
                <h2 className="case-title" style={{ fontSize: '24px', margin: 0 }}>
                  FALLO DEFINITIVO Y CONDENA PENAL
                </h2>
              </div>
              <span className="stamp" style={{ color: 'var(--ink-stamp-red)', borderColor: 'var(--ink-stamp-red)' }}>
                SENTENCIA
              </span>
            </div>

            <div
              style={{
                background: '#faf6eb',
                border: '2px solid #8b1e1e',
                padding: '28px',
                borderRadius: '4px',
                textAlign: 'center',
                marginBottom: '32px',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#8b1e1e',
                  letterSpacing: '2px',
                  marginBottom: '14px'
                }}
              >
                {winner.condena || 'SENTENCIA DEL TRIBUNAL SUPERIOR'}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#1f1a14',
                  maxWidth: '700px',
                  margin: '0 auto',
                  textAlign: 'justify'
                }}
              >
                {winner.narrativaCondena || 'Habiéndose analizado el sumario y las acusaciones presentadas por el cuerpo de detectives, la corte ratifica la sentencia definitiva.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <button
                type="button"
                className="btn-wood"
                onClick={() => setCurrentStep(2)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                ⬅ Volver a los Hechos
              </button>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-wood"
                  onClick={handleExport}
                  title="Guardar este expediente completo en tu equipo"
                  style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 'bold' }}
                >
                  ↓ Exportar Caso (.json)
                </button>

                <button
                  type="button"
                  className="btn-wood primary"
                  onClick={onPlayAgain}
                  style={{ fontSize: '13px', padding: '8px 18px', fontWeight: 'bold' }}
                >
                  ⎌ Iniciar Nueva Partida Cooperativa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
