import React, { useState } from 'react';
import { exportCaseToJson } from '../../services/caseFileIO';

export function VerdictScreen({
  verdictResult,
  truth,
  publicInfo,
  onPlayAgain,
  onGoHome
}) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!verdictResult || !truth) return null;

  const des = verdictResult.desglose || {};
  const totalScore = verdictResult.puntajeTotal !== undefined ? verdictResult.puntajeTotal : (verdictResult.puntaje || 0);

  const handleExport = () => {
    exportCaseToJson(publicInfo, truth);
  };

  return (
    <div className="workspace" style={{ paddingBottom: '60px' }}>
      <div className="verdict-dossier">
        
        {/* STEP 1: EVALUACIÓN JUDICIAL */}
        {currentStep === 1 && (
          <div className="verdict-step active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink-stamp-red)', paddingBottom: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', color: 'var(--ink-black)', margin: 0 }}>
                PASO 1: EVALUACIÓN JUDICIAL
              </h2>
              <span className="dossier-stamp stamp-classified" style={{ position: 'static' }}>VEREDICTO</span>
            </div>

            {/* SCORE BADGE */}
            <div className="score-badge-large" style={{ textAlign: 'center', margin: '24px 0', padding: '16px', background: 'rgba(0,0,0,0.03)', border: '1px dashed var(--manila-dark)', borderRadius: '4px' }}>
              <div style={{ fontSize: '46px', fontFamily: 'var(--font-title)', fontWeight: 'bold', color: totalScore >= 50 ? '#1b5e20' : '#8b1e1e' }}>
                {totalScore} / 100
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--ink-faded)' }}>
                Puntuación Total de Peritaje
              </div>
            </div>

            {/* BREAKDOWN GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--paper-cream)', border: '1px solid var(--manila-dark)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Identificación del Asesino (+40)</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: des.culpable?.acerto ? '#1b5e20' : '#8b1e1e' }}>
                  {des.culpable?.acerto ? '✓ ACERTADO (+40 pts)' : '✗ FALLIDO (0 pts)'}
                </div>
              </div>

              <div style={{ background: 'var(--paper-cream)', border: '1px solid var(--manila-dark)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Arma / Método (+20)</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: des.arma?.acerto ? '#1b5e20' : '#8b1e1e' }}>
                  {des.arma?.acerto ? '✓ ACERTADO (+20 pts)' : '✗ FALLIDO (0 pts)'}
                </div>
              </div>

              <div style={{ background: 'var(--paper-cream)', border: '1px solid var(--manila-dark)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Móvil del Crimen (+20)</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: des.movil?.acerto ? '#1b5e20' : '#8b1e1e' }}>
                  {des.movil?.acerto ? '✓ ACERTADO (+20 pts)' : '✗ FALLIDO (0 pts)'}
                </div>
              </div>

              <div style={{ background: 'var(--paper-cream)', border: '1px solid var(--manila-dark)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Calidad de Reconstrucción (+20)</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: (des.reconstruccion?.puntos || 0) >= 10 ? '#1b5e20' : '#8b1e1e' }}>
                  +{des.reconstruccion?.puntos || 0} / 20 pts
                </div>
              </div>
            </div>

            {/* RECONSTRUCTION COMMENT */}
            <div style={{ background: 'rgba(0,0,0,0.03)', borderLeft: '4px solid var(--ink-stamp-red)', padding: '14px 18px', borderRadius: '0 4px 4px 0', marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--ink-stamp-red)', letterSpacing: '1.5px', marginBottom: '4px' }}>
                DICTAMEN SOBRE TU RECONSTRUCCIÓN:
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-black)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                {des.reconstruccion?.comentario || "Sin observaciones adicionales."}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn-wood primary" 
                onClick={() => setCurrentStep(2)}
                style={{ fontSize: '13px', padding: '10px 20px', fontWeight: 'bold' }}
              >
                Paso 2: Cómo Ocurrió Realmente ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LA VERDAD OCULTA */}
        {currentStep === 2 && (
          <div className="verdict-step active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink-stamp-red)', paddingBottom: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', color: 'var(--ink-black)', margin: 0 }}>
                PASO 2: LA VERDAD OCULTA
              </h2>
              <span className="dossier-stamp" style={{ position: 'static', color: 'var(--ink-stamp-blue)', borderColor: 'var(--ink-stamp-blue)' }}>
                REVELADO
              </span>
            </div>

            {/* SECUENCIA REAL */}
            <div style={{ 
              background: 'rgba(27, 61, 108, 0.04)', 
              border: '1px solid var(--manila-dark)', 
              padding: '18px', 
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13.5px',
              lineHeight: '1.7',
              marginBottom: '24px',
              whiteSpace: 'pre-line'
            }}>
              {truth.secuenciaReal || "Detalle reservado en sumario."}
            </div>

            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', color: 'var(--ink-stamp-blue)', marginBottom: '12px', letterSpacing: '1px' }}>
              PISTAS CLAVE QUE DEBISTE HABER NOTADO:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {(truth.pistasClave || []).map((clue, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'var(--paper-cream)', 
                    borderLeft: '3px solid var(--ink-stamp-blue)', 
                    padding: '8px 12px', 
                    fontSize: '13px' 
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
                ⬅ Volver al Puntaje
              </button>

              <button 
                type="button" 
                className="btn-wood primary" 
                onClick={() => setCurrentStep(3)}
                style={{ fontSize: '13px', padding: '10px 20px', fontWeight: 'bold' }}
              >
                Paso 3: Sentencia y Condena ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SENTENCIA JUDICIAL */}
        {currentStep === 3 && (
          <div className="verdict-step active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink-stamp-red)', paddingBottom: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', color: 'var(--ink-black)', margin: 0 }}>
                PASO 3: SENTENCIA JUDICIAL
              </h2>
              <span className="dossier-stamp stamp-classified" style={{ position: 'static' }}>FALLO DEFINITIVO</span>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.03)', 
              border: '2px solid var(--manila-dark)', 
              padding: '24px', 
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{ 
                fontFamily: 'var(--font-title)', 
                fontSize: '26px', 
                fontWeight: 'bold', 
                color: 'var(--ink-stamp-red)', 
                letterSpacing: '2px', 
                marginBottom: '14px' 
              }}>
                {verdictResult.condena || "RESOLUCIÓN JUDICIAL"}
              </div>

              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '14px', 
                lineHeight: '1.7', 
                color: 'var(--ink-black)', 
                maxWidth: '680px', 
                margin: '0 auto',
                textAlign: 'justify' 
              }}>
                {verdictResult.narrativaCondena || ""}
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
                  style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 'bold', color: 'var(--ink-stamp-blue)' }}
                >
                  ↓ Exportar Caso (.json)
                </button>

                <button 
                  type="button" 
                  className="btn-wood primary" 
                  onClick={onPlayAgain}
                  style={{ fontSize: '13px', padding: '8px 18px', fontWeight: 'bold' }}
                >
                  ⎌ Investigar un Nuevo Caso
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
