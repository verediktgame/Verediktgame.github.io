import React, { useState, useEffect } from 'react';
import { TabInforme } from './TabInforme';
import { TabDeclaraciones } from './TabDeclaraciones';
import { TabSospechosos } from './TabSospechosos';
import { TabEscena } from './TabEscena';
import { TabEvidencias } from './TabEvidencias';
import { TabAcusacion } from './TabAcusacion';
import { CoopTurnAccusation } from '../Coop/CoopTurnAccusation';
import { DetectiveNotes } from './DetectiveNotes';

export function Dossier({
  publicInfo,
  onSelectSuspectToInterrogate,
  interrogationsState,
  analyzedEvidenceIds,
  onAnalyzeEvidence,
  onSubmitAccusation,
  isEvaluating,
  isCoop = false,
  players = [],
  currentPlayerIndex = 0,
  onSubmitPlayerTurn
}) {
  const [activeTab, setActiveTab] = useState('informe');

  // Number-key shortcuts to jump between folders (1..5, 6 = accusation)
  useEffect(() => {
    const keyToTab = {
      '1': 'informe',
      '2': 'escena',
      '3': 'declaraciones',
      '4': 'evidencias',
      '5': 'sospechosos',
      '6': 'acusacion'
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) return;
      if (document.querySelector('.modal-overlay.active, .modal-backdrop.active')) return;
      const tab = keyToTab[e.key];
      if (tab) {
        e.preventDefault();
        setActiveTab(tab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!publicInfo) return null;

  return (
    <div className="workspace" style={{ paddingBottom: '60px' }}>
      <section id="screenInvestigation" className="screen active">
        <div className="investigation-container">
          {/* Manila folder tabs */}
          <nav className="folder-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'informe' ? 'active' : ''}`}
              onClick={() => setActiveTab('informe')}
              title="Atajo: 1"
            >
              1. INFORME OFICIAL
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'escena' ? 'active' : ''}`}
              onClick={() => setActiveTab('escena')}
              title="Atajo: 2"
            >
              2. ESCENA DEL CRIMEN
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'declaraciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('declaraciones')}
              title="Atajo: 3"
            >
              3. DECLARACIONES ({publicInfo.declaraciones?.length || 0})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'evidencias' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidencias')}
              title="Atajo: 4"
            >
              4. EVIDENCIAS FORENSES ({publicInfo.evidencias?.length || 0})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'sospechosos' ? 'active' : ''}`}
              onClick={() => setActiveTab('sospechosos')}
              title="Atajo: 5"
            >
              5. SOSPECHOSOS ({publicInfo.sospechosos?.length || 0})
            </button>
            <button
              type="button"
              className={`tab-btn accusation-tab ${activeTab === 'acusacion' ? 'active' : ''}`}
              onClick={() => setActiveTab('acusacion')}
              title="Atajo: 6"
            >
              {isCoop ? '⚖️ ACUSACIÓN POR TURNOS' : '⚖ ACUSACIÓN FINAL'}
            </button>
          </nav>

          {/* The Paper Dossier Sheet */}
          <div className="dossier-sheet">
            <div className="tape top-left"></div>
            <div className="tape top-right"></div>

            {/* Header of current sheet */}
            <div className="sheet-header">
              <div>
                <h2 className="case-title" id="displayTituloCaso">
                  {publicInfo.titulo || 'EXPEDIENTE CRIMINAL'}
                </h2>
                <div className="case-meta-line" id="displayMetaCaso">
                  LUGAR: {publicInfo.lugar || publicInfo.ciudad || 'Desconocido'} | FECHA: {publicInfo.fecha || publicInfo.epoca || 'Reciente'}
                  {isCoop && (
                    <span style={{ marginLeft: '12px', color: '#8b1e1e', fontWeight: 'bold' }}>
                      [MODO COOPERATIVO: {players.length} DETECTIVES]
                    </span>
                  )}
                </div>
              </div>
              <div id="caseStatusStamp">
                <span className="stamp">SUMARIO ABIERTO</span>
              </div>
            </div>

            {/* TAB PANELS */}
            {activeTab === 'informe' && (
              <div id="tabInforme" className="tab-panel active">
                <TabInforme publicInfo={publicInfo} />
              </div>
            )}

            {activeTab === 'declaraciones' && (
              <div id="tabDeclaraciones" className="tab-panel active">
                <TabDeclaraciones declaraciones={publicInfo.declaraciones} />
              </div>
            )}

            {activeTab === 'sospechosos' && (
              <div id="tabSospechosos" className="tab-panel active">
                <TabSospechosos
                  sospechosos={publicInfo.sospechosos}
                  onSelectSuspectToInterrogate={onSelectSuspectToInterrogate}
                  interrogationsState={interrogationsState}
                />
              </div>
            )}

            {activeTab === 'escena' && (
              <div id="tabEscena" className="tab-panel active">
                <TabEscena
                  descripcionEscena={publicInfo.descripcionEscena}
                  lugar={publicInfo.lugar || publicInfo.ciudad}
                />
              </div>
            )}

            {activeTab === 'evidencias' && (
              <div id="tabEvidencias" className="tab-panel active">
                <TabEvidencias
                  evidencias={publicInfo.evidencias}
                  analyzedEvidenceIds={analyzedEvidenceIds}
                  onAnalyzeEvidence={onAnalyzeEvidence}
                />
              </div>
            )}

            {activeTab === 'acusacion' && (
              <div id="tabAcusacion" className="tab-panel active">
                {isCoop ? (
                  <CoopTurnAccusation
                    players={players}
                    currentPlayerIndex={currentPlayerIndex}
                    sospechosos={publicInfo.sospechosos}
                    evidencias={publicInfo.evidencias}
                    onSubmitPlayerTurn={onSubmitPlayerTurn}
                    isEvaluating={isEvaluating}
                  />
                ) : (
                  <TabAcusacion
                    sospechosos={publicInfo.sospechosos}
                    evidencias={publicInfo.evidencias}
                    onSubmitAccusation={onSubmitAccusation}
                    isEvaluating={isEvaluating}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FLOATING DETECTIVE NOTES DRAWER */}
      <DetectiveNotes
        caseTitle={publicInfo.titulo}
        currentPlayerName={isCoop && players.length > 0 ? players[currentPlayerIndex] : null}
        isCoop={isCoop}
      />
    </div>
  );
}
