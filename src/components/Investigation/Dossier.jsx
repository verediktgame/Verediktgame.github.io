import React, { useState } from 'react';
import { TabInforme } from './TabInforme';
import { TabDeclaraciones } from './TabDeclaraciones';
import { TabSospechosos } from './TabSospechosos';
import { TabEscena } from './TabEscena';
import { TabEvidencias } from './TabEvidencias';
import { TabAcusacion } from './TabAcusacion';

export function Dossier({
  publicInfo,
  onSelectSuspectToInterrogate,
  interrogationsState,
  analyzedEvidenceIds,
  onAnalyzeEvidence,
  onSubmitAccusation,
  isEvaluating
}) {
  const [activeTab, setActiveTab] = useState('informe');

  if (!publicInfo) return null;

  const tabs = [
    { id: 'informe', label: '📄 INFORME POLICIAL' },
    { id: 'declaraciones', label: `🗣️ DECLARACIONES (${publicInfo.declaraciones?.length || 0})` },
    { id: 'sospechosos', label: `👥 SOSPECHOSOS (${publicInfo.sospechosos?.length || 0})` },
    { id: 'escena', label: '📍 ESCENA DEL CRIMEN' },
    { id: 'evidencias', label: `🔬 EVIDENCIAS (${publicInfo.evidencias?.length || 0})` },
    { id: 'acusacion', label: '⚖️ EMITIR ACUSACIÓN', highlight: true }
  ];

  return (
    <div className="dossier-wrapper" style={{ maxWidth: '1020px', margin: '20px auto 50px auto', padding: '0 16px' }}>
      {/* DOSSIER FOLDER TABS */}
      <div className="folder-tab-bar" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={`tab-button ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: t.highlight || activeTab === t.id ? 'bold' : 'normal',
              color: t.highlight ? 'var(--ink-stamp-red)' : 'var(--ink-black)',
              background: activeTab === t.id ? 'var(--paper-cream)' : 'var(--manila-tab)',
              border: '1px solid var(--manila-dark)',
              borderBottom: activeTab === t.id ? 'none' : '1px solid var(--manila-dark)',
              cursor: 'pointer',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* DOSSIER SHEET BODY */}
      <div className="paper-texture" style={{ 
        border: '1px solid var(--manila-dark)', 
        borderTop: 'none', 
        minHeight: '520px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <div className="dossier-stamp stamp-classified" style={{ top: 16, right: 20 }}>
          EXPEDIENTE ABIERTO
        </div>

        {activeTab === 'informe' && <TabInforme publicInfo={publicInfo} />}
        {activeTab === 'declaraciones' && <TabDeclaraciones declaraciones={publicInfo.declaraciones} />}
        {activeTab === 'sospechosos' && (
          <TabSospechosos 
            sospechosos={publicInfo.sospechosos} 
            onSelectSuspectToInterrogate={onSelectSuspectToInterrogate}
            interrogationsState={interrogationsState}
          />
        )}
        {activeTab === 'escena' && (
          <TabEscena 
            descripcionEscena={publicInfo.descripcionEscena} 
            lugar={publicInfo.lugar || publicInfo.ciudad} 
          />
        )}
        {activeTab === 'evidencias' && (
          <TabEvidencias 
            evidencias={publicInfo.evidencias} 
            analyzedEvidenceIds={analyzedEvidenceIds}
            onAnalyzeEvidence={onAnalyzeEvidence}
          />
        )}
        {activeTab === 'acusacion' && (
          <TabAcusacion 
            sospechosos={publicInfo.sospechosos} 
            evidencias={publicInfo.evidencias}
            onSubmitAccusation={onSubmitAccusation}
            isEvaluating={isEvaluating}
          />
        )}
      </div>
    </div>
  );
}
