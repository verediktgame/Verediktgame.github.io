import React from 'react';

export function InterrogationModal({
  isOpen,
  onClose,
  suspect,
  askedQuestionIds = [],
  onAskQuestion
}) {
  if (!isOpen || !suspect) return null;

  const questions = suspect.preguntas || [];
  const maxQuestions = 3;
  const questionsAskedCount = askedQuestionIds.length;
  const questionsLeft = Math.max(0, maxQuestions - questionsAskedCount);

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }} onClick={onClose}>
      <div 
        className="modal-content paper-texture" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          width: '92%', 
          maxHeight: '85vh', 
          overflowY: 'auto',
          padding: '24px'
        }}
      >
        <div className="dossier-stamp stamp-classified" style={{ top: 12, right: 16 }}>SALA DE INTERROGATORIO</div>

        {/* SUSPECT HEADER */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', borderBottom: '1px dashed var(--manila-dark)', paddingBottom: '14px' }}>
          <div style={{ 
            width: '64px', 
            height: '74px', 
            background: '#1a1714', 
            border: '2px solid var(--ink-faded)', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            color: '#fff',
            fontFamily: 'var(--font-typewriter)',
            fontSize: '11px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            <span>MUGSHOT</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-stamp-red)', fontWeight: 'bold' }}>
              FICHA DE SOSPECHOSO #{suspect.id}
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', margin: '2px 0 4px 0' }}>
              {suspect.nombre}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ink-faded)', margin: 0 }}>
              <strong>Perfil:</strong> {suspect.perfil}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--ink-faded)', margin: '2px 0 0 0' }}>
              <strong>Coartada inicial:</strong> <em>"{suspect.coartada}"</em>
            </p>
          </div>
        </div>

        {/* COUNTER */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'rgba(0,0,0,0.03)', 
          padding: '8px 12px', 
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
            Límite de preguntas por sospechoso:
          </span>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: questionsLeft > 0 ? 'var(--ink-stamp-blue)' : 'var(--ink-stamp-red)' 
          }}>
            Preguntas disponibles: {questionsLeft} / {maxQuestions}
          </span>
        </div>

        {/* QUESTIONS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {questions.map((q, idx) => {
            const isAsked = askedQuestionIds.includes(q.id);
            const canAsk = questionsLeft > 0 && !isAsked;

            return (
              <div 
                key={q.id || idx}
                style={{ 
                  background: isAsked ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.02)',
                  border: isAsked ? '1px solid var(--ink-faded)' : '1px dashed var(--manila-dark)',
                  borderRadius: '4px',
                  padding: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--ink-black)' }}>
                    ❓ {q.pregunta}
                  </div>
                  {!isAsked ? (
                    <button
                      type="button"
                      className="btn-paper"
                      onClick={() => onAskQuestion(suspect.id, q.id)}
                      disabled={!canAsk}
                      style={{ 
                        fontSize: '11px', 
                        padding: '4px 10px', 
                        whiteSpace: 'nowrap',
                        opacity: canAsk ? 1 : 0.4,
                        cursor: canAsk ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {canAsk ? 'Interrogar' : 'Sin cupo'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      ✓ RESPONDIDA
                    </span>
                  )}
                </div>

                {isAsked && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '8px 10px', 
                    background: 'rgba(0,0,0,0.04)', 
                    borderLeft: '3px solid var(--ink-stamp-blue)',
                    fontSize: '12.5px',
                    fontStyle: 'italic',
                    color: 'var(--ink-black)',
                    lineHeight: '1.45'
                  }}>
                    "{q.respuesta}"
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CLOSE BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn-paper" 
            onClick={onClose}
            style={{ fontSize: '13px', padding: '8px 20px' }}
          >
            Finalizar Interrogatorio
          </button>
        </div>

      </div>
    </div>
  );
}
