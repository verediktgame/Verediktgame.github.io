import React from 'react';
import { API_PROVIDERS, PROVIDER_COMPARISON_DATA } from '../../constants/providers';
import { SafeStorage } from '../../services/storage';

export function MyApiModal({ isOpen, onClose, currentConfig, onSelectProvider }) {
  if (!isOpen) return null;

  const stats = SafeStorage.getStats();
  const currentProviderId = currentConfig?.provider || 'groq';
  const currentProvider = API_PROVIDERS[currentProviderId] || API_PROVIDERS['groq'];
  const providerStat = stats.providerStats?.[currentProviderId] || { games: 0, calls: 0 };

  const getEstimatedCost = (id) => {
    switch (id) {
      case 'groq':
      case 'gemini':
      case 'github':
        return '$0.00 USD (Capa gratuita)';
      case 'deepseek':
        return '~$0.002 a $0.005 USD';
      case 'mistral':
      case 'openrouter':
      case 'nvidia':
        return '~$0.005 a $0.01 USD (o créditos free)';
      case 'openai':
        return '~$0.025 USD';
      case 'anthropic':
        return '~$0.04 a $0.07 USD';
      case 'cohere':
        return '~$0.015 USD (o trial free)';
      default:
        return 'Variable';
    }
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }} onClick={onClose}>
      <div 
        className="modal-content paper-texture" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '900px', width: '95%', maxHeight: '92vh', overflowY: 'auto', padding: '24px' }}
      >
        <div className="dossier-stamp stamp-classified" style={{ top: 14, right: 18 }}>ARCHIVOS</div>

        <h2 style={{ fontFamily: 'var(--font-typewriter)', fontSize: '22px', marginBottom: '6px', color: 'var(--ink-black)' }}>
          📊 Mi API — Consumo, Llamadas y Comparativa
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-faded)', marginBottom: '18px' }}>
          VEREDIKT utiliza una arquitectura quirúrgica client-side (BYOK) para garantizar máxima fiabilidad sin saturar tokens.
        </p>

        {/* ACTIVE PROVIDER SUMMARY CARD */}
        <div style={{ 
          background: 'var(--paper-cream)', 
          border: '2px solid var(--manila-dark)', 
          borderRadius: '4px', 
          padding: '16px', 
          marginBottom: '20px',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-stamp-blue)', fontWeight: 'bold' }}>
                PROVEEDOR ACTIVO
              </span>
              <h3 style={{ fontSize: '18px', margin: '2px 0 0 0', fontFamily: 'var(--font-title)' }}>
                {currentProvider.name}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ 
                background: currentProvider.freeTier ? '#e8f5e9' : '#fff3e0', 
                color: currentProvider.freeTier ? '#2e7d32' : '#e65100',
                border: `1px solid ${currentProvider.freeTier ? '#a5d6a7' : '#ffcc80'}`,
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {currentProvider.freeTier ? '⚡ Capa Gratuita' : '💳 Pago por Uso'}
              </span>
              <span style={{ 
                background: currentConfig?.apiKey ? '#e0f2fe' : '#fee2e2', 
                color: currentConfig?.apiKey ? '#0369a1' : '#b91c1c',
                border: `1px solid ${currentConfig?.apiKey ? '#bae6fd' : '#fca5a5'}`,
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {currentConfig?.apiKey ? '✓ Clave Configurada' : '⚠ Sin Clave'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Modelo Seleccionado</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                {currentConfig?.customModel || currentConfig?.model || currentProvider.models?.[0]?.id}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Costo Estimado / Partida</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--ink-stamp-red)' }}>
                {getEstimatedCost(currentProviderId)}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-faded)' }}>Llamadas Realizadas</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                {providerStat.calls} llamadas ({providerStat.games} partidas)
              </div>
            </div>
          </div>
        </div>

        {/* CALLS EXPLANATION BOX */}
        <div style={{ 
          background: 'rgba(27, 61, 108, 0.04)', 
          borderLeft: '4px solid var(--ink-stamp-blue)', 
          padding: '12px 16px', 
          borderRadius: '0 4px 4px 0', 
          marginBottom: '22px',
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: 'var(--ink-stamp-blue)' }}>📋 Consumo por Partida: Exactamente 8 llamadas</strong>
          <p style={{ margin: '6px 0 0 0', color: 'var(--ink-faded)' }}>
            Para evitar respuestas truncadas, el caso se genera en <strong>6 etapas de max_tokens: 4000</strong> (Encabezado → Sospechosos → Evidencias → Preguntas → Forense → Verdad Sellada). Al acusar se realiza <strong>1 llamada para el tribunal</strong> y <strong>1 opcional de diagnóstico</strong>. El análisis forense y el resto de la investigación son 100% locales sin gasto adicional.
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <h3 style={{ fontFamily: 'var(--font-typewriter)', fontSize: '16px', marginBottom: '10px', color: 'var(--ink-black)' }}>
          🔍 Tabla Comparativa de Proveedores (10 APIs Compatibles)
        </h3>

        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontSize: '12px', 
            fontFamily: 'var(--font-mono)',
            background: 'var(--paper-cream)'
          }}>
            <thead>
              <tr style={{ background: 'var(--manila-folder)', borderBottom: '2px solid var(--manila-dark)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Proveedor</th>
                <th style={{ padding: '8px 10px' }}>Modelo Recomendado</th>
                <th style={{ padding: '8px 10px' }}>Gratis / Costo</th>
                <th style={{ padding: '8px 10px' }}>Tarjeta</th>
                <th style={{ padding: '8px 10px' }}>Latencia</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {PROVIDER_COMPARISON_DATA.map((item, idx) => {
                const isSelected = item.id === currentProviderId;
                return (
                  <tr 
                    key={item.id} 
                    style={{ 
                      borderBottom: '1px solid var(--manila-dark)',
                      background: isSelected ? 'rgba(163, 34, 34, 0.08)' : (idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent')
                    }}
                  >
                    <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>
                      {item.name}
                      {isSelected && <span style={{ marginLeft: '6px', color: 'var(--ink-stamp-red)', fontSize: '10px' }}>● ACTIVO</span>}
                    </td>
                    <td style={{ padding: '8px 10px' }}>{item.model}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ 
                        color: item.freeTier ? '#1b5e20' : '#8c2d19', 
                        fontWeight: item.freeTier ? 'bold' : 'normal' 
                      }}>
                        {item.costPerGame}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      {item.reqCard ? 'Sí' : 'No necesaria'}
                    </td>
                    <td style={{ padding: '8px 10px' }}>{item.speed}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <button 
                        type="button"
                        className="btn-paper" 
                        onClick={() => {
                          onSelectProvider(item.id);
                        }}
                        style={{ 
                          fontSize: '11px', 
                          padding: '3px 8px', 
                          opacity: isSelected ? 0.6 : 1,
                          cursor: isSelected ? 'default' : 'pointer'
                        }}
                      >
                        {isSelected ? 'Actual' : 'Elegir'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RECOMENDACIONES DE USO */}
        <div style={{ 
          background: 'rgba(0,0,0,0.03)', 
          border: '1px dashed var(--manila-dark)', 
          borderRadius: '4px', 
          padding: '12px 16px',
          fontSize: '12px',
          color: 'var(--ink-faded)',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 'bold', color: 'var(--ink-black)', marginBottom: '4px' }}>
            💡 Recomendaciones de Elección:
          </div>
          <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
            <li><strong>100% Gratis sin tarjeta:</strong> Groq (Llama 3.3 70B a ultra velocidad) o Google Gemini (Gemini 2.5 Flash).</li>
            <li><strong>Mejor prosa noir y deducción:</strong> Anthropic Claude Sonnet 4.6 (inteligencia literaria excepcional).</li>
            <li><strong>Mayor precisión al menor costo:</strong> DeepSeek V3 (fracciones de centavo de dólar por caso).</li>
            <li><strong>Para desarrolladores:</strong> GitHub Models o OpenRouter con modelos de código abierto.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn-paper btn-primary" 
            onClick={onClose}
            style={{ fontSize: '13px', padding: '8px 20px' }}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
