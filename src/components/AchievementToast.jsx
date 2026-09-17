import React, { useEffect } from 'react';

export function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return;

    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 3500);

    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast show" role="alert">
      <span className="achievement-icon" style={{ fontSize: '24px' }}>
        {achievement.icono || '🏆'}
      </span>
      <div>
        <div className="achievement-title" style={{ fontSize: '11px', color: '#e6c88b', textTransform: 'uppercase', letterSpacing: '1px' }}>
          ¡Logro desbloqueado!
        </div>
        <div className="achievement-name" style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
          {achievement.nombre}
        </div>
      </div>
    </div>
  );
}
