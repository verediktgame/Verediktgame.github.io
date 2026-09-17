import React from 'react';
import { LOGROS, getStats } from '../../constants/achievements';

export function AchievementsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stats = getStats();
  const unlockedSet = new Set(stats.logrosDesbloqueados || []);
  const totalUnlocked = LOGROS.filter(l => unlockedSet.has(l.id)).length;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div 
        className="dossier-sheet achievements-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '780px', 
          width: '95%', 
          maxHeight: '85vh', 
          overflowY: 'auto',
          padding: '32px 36px' 
        }}
      >
        <div className="tape top-left"></div>
        <div className="tape top-right"></div>

        {/* HEADER */}
        <div className="sheet-header" style={{ marginBottom: '20px' }}>
          <div>
            <div className="tape-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
              REGISTRO DE MÉRITOS & CONDECORACIONES
            </div>
            <h2 className="case-title" style={{ fontSize: '24px', margin: 0 }}>
              🏆 VITRINA DE LOGROS
            </h2>
            <div className="case-meta-line" style={{ marginTop: '4px' }}>
              Trofeos desbloqueados: <strong>{totalUnlocked} de {LOGROS.length}</strong>
            </div>
          </div>
          <button type="button" className="btn-wood" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>

        {/* ACHIEVEMENTS GRID */}
        <div 
          className="achievements-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '16px',
            marginTop: '16px' 
          }}
        >
          {LOGROS.map((logro) => {
            const isUnlocked = unlockedSet.has(logro.id);
            const isHarry = logro.id === 'harry';

            // Special rules for Harry Potter 9¾
            let displayIcon = isHarry ? '?' : (isUnlocked ? logro.icono : '?');
            let displayName = logro.nombre;
            let displayDesc = isHarry ? '...' : (isUnlocked ? logro.descripcion : 'Logro bloqueado. Investigá para descubrir el misterio...');
            let cardBorder = isUnlocked 
              ? (isHarry ? '2px solid #d4af37' : '2px solid #8b6914') 
              : '1px solid #4a3826';
            let cardBg = isUnlocked ? '#faf5e8' : '#1e1610';
            let textColor = isUnlocked ? '#1c160e' : '#7d6c5b';
            let titleColor = isUnlocked 
              ? (isHarry ? '#946e08' : '#8b1e1e') 
              : '#6b5846';

            return (
              <div
                key={logro.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${isHarry && isUnlocked ? 'harry-gold' : ''}`}
                style={{
                  background: cardBg,
                  border: cardBorder,
                  borderRadius: '4px',
                  padding: '16px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  boxShadow: isUnlocked 
                    ? (isHarry ? '0 0 12px rgba(212, 175, 55, 0.4)' : '1px 2px 6px rgba(0,0,0,0.1)') 
                    : 'none',
                  transition: 'transform 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* ICON BOX */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    minWidth: '46px',
                    background: isUnlocked ? (isHarry ? '#fef3c7' : '#f0e6cf') : '#150f0b',
                    border: isUnlocked ? (isHarry ? '1.5px solid #d4af37' : '1.5px solid #a89370') : '1px solid #38281a',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isHarry && isUnlocked ? '22px' : '24px',
                    fontWeight: 'bold',
                    color: isUnlocked ? (isHarry ? '#946e08' : '#3d2e1e') : '#554231'
                  }}
                >
                  {displayIcon}
                </div>

                {/* INFO */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '15px',
                        fontFamily: 'var(--font-title)',
                        color: titleColor,
                        letterSpacing: '1px'
                      }}
                    >
                      {displayName}
                    </h3>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        textTransform: 'uppercase',
                        background: isUnlocked ? (isHarry ? '#d4af37' : '#2b5a2b') : '#2c1e15',
                        color: isUnlocked ? (isHarry ? '#1a1200' : '#d5ebd5') : '#665342'
                      }}
                    >
                      {isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '6px 0 0 0',
                      fontSize: '12.5px',
                      color: textColor,
                      lineHeight: '1.4',
                      fontFamily: isUnlocked ? 'var(--font-mono)' : 'sans-serif',
                      fontStyle: isUnlocked && !isHarry ? 'normal' : 'italic'
                    }}
                  >
                    {displayDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
