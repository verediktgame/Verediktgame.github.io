import React from 'react';
import { PASOS_GENERACION } from '../services/caseGenerator';

export function ProgressBar({ currentStep, statusText }) {
  const percentage = Math.min(100, Math.round(((Math.min(currentStep, 6) - 1) / 5) * 100));

  return (
    <div className="case-gen-progress-container" style={{ margin: '20px 0' }}>
      <div className="progress-bar-track" style={{ height: '8px', background: 'var(--manila-tab)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--manila-dark)' }}>
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${currentStep >= 7 ? 100 : percentage}%`, 
            height: '100%', 
            background: 'var(--ink-stamp-red)', 
            transition: 'width 0.4s ease' 
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', flexWrap: 'wrap', gap: '6px' }}>
        {PASOS_GENERACION.map((step) => {
          const isDone = currentStep > step.id || currentStep >= 7;
          const isActive = currentStep === step.id;
          return (
            <div 
              key={step.id} 
              style={{ 
                fontSize: '11px', 
                fontFamily: 'var(--font-mono)',
                color: isDone ? '#1b5e20' : isActive ? 'var(--ink-stamp-red)' : 'var(--ink-faded)',
                fontWeight: isActive ? 'bold' : 'normal',
                opacity: (isDone || isActive) ? 1 : 0.6
              }}
            >
              {isDone ? '✓ ' : isActive ? '▶ ' : '○ '}
              {step.desc}
            </div>
          );
        })}
      </div>

      <div 
        className="teletype-text" 
        style={{ 
          marginTop: '12px', 
          fontSize: '12px', 
          fontStyle: 'italic', 
          color: 'var(--ink-faded)', 
          textAlign: 'center',
          minHeight: '18px' 
        }}
      >
        {statusText || (PASOS_GENERACION[currentStep - 1]?.label || 'Procesando expediente...')}
      </div>
    </div>
  );
}
