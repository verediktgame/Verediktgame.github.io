import React, { useState, useEffect } from 'react';

export function InterrogationModal({
  isOpen,
  onClose,
  suspect,
  askedQuestionIds = [],
  onAskQuestion,
  onConfirmInterrogation
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Reset selected questions when opening for a new suspect
  useEffect(() => {
    setSelectedIds([]);
  }, [suspect?.id, isOpen]);

  if (!isOpen || !suspect) return null;

  const questions = suspect.preguntas || [];
  const isAlreadyDone = askedQuestionIds && askedQuestionIds.length >= 3;

  const toggleQuestionSelect = (qId) => {
    if (selectedIds.includes(qId)) {
      setSelectedIds(selectedIds.filter(id => id !== qId));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, qId]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length !== 3) return;
    if (onConfirmInterrogation) {
      onConfirmInterrogation(suspect.id, selectedIds);
    } else if (onAskQuestion) {
      selectedIds.forEach(id => onAskQuestion(suspect.id, id));
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="interrogation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="tape-badge">CINTA DE INTERROGATORIO // SALA B-4</div>
            <h3 className="modal-title">Interrogatorio: {suspect.nombre}</h3>
          </div>
          <button type="button" className="btn-wood" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>

        {isAlreadyDone ? (
          <>
            <div className="interrogation-instructions">
              <strong>INTERROGATORIO CERRADO:</strong> Las 3 preguntas seleccionadas ya fueron formuladas. Las 2 restantes fueron clasificadas por el defensor.
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a140d', marginBottom: '14px' }}>
              Preguntas seleccionadas: <span style={{ color: '#8b1e1e' }}>3 / 3 (Completado)</span>
            </div>

            <div className="questions-list">
              {questions.map((q) => {
                const wasAnswered = askedQuestionIds.includes(q.id);
                return (
                  <div key={q.id} className="question-item answered">
                    <div className="question-label-row">
                      <span style={{ fontWeight: 700, color: wasAnswered ? '#1e6e2f' : '#8b1e1e' }}>
                        {wasAnswered ? '✓ FORMULADA' : '✗ CLASIFICADA / SELLADA'}
                      </span>
                      <div className="question-text">{q.pregunta}</div>
                    </div>
                    <div className={`answer-box ${wasAnswered ? '' : 'redacted'}`}>
                      {wasAnswered ? (
                        <>
                          <strong>RESPUESTA:</strong> "{q.respuesta}"
                        </>
                      ) : (
                        <em>[El sospechoso se acogió a su derecho al silencio / Pregunta no formulada]</em>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="interrogation-instructions">
              <strong>REGLA DE INTERROGATORIO:</strong> Tienes permitido formular <strong>exactamente 3 preguntas</strong> antes de que el abogado defensor interrumpa la declaración. Elige con máxima prudencia; las otras 2 preguntas quedarán selladas.
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a140d', marginBottom: '14px' }}>
              Preguntas seleccionadas: <span style={{ color: '#8b1e1e' }}>{selectedIds.length} / 3</span>
            </div>

            <div className="questions-list">
              {questions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`question-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleQuestionSelect(q.id)}
                  >
                    <div className="question-label-row">
                      <input
                        type="checkbox"
                        className="question-checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                      />
                      <label className="question-text" style={{ cursor: 'pointer' }}>
                        {q.pregunta}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn-wood primary"
                disabled={selectedIds.length !== 3}
                onClick={handleConfirm}
              >
                Confirmar y Revelar Testimonio ({selectedIds.length}/3)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
