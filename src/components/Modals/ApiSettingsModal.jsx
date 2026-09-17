import React, { useState, useEffect } from 'react';
import { API_PROVIDERS } from '../../constants/providers';
import { SafeStorage } from '../../services/storage';
import { makeLLMRequest } from '../../services/llmAdapter';

export function ApiSettingsModal({ isOpen, onClose, currentConfig, onSaveConfig }) {
  const [providerId, setProviderId] = useState(currentConfig?.provider || 'groq');
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [endpoint, setEndpoint] = useState(currentConfig?.endpoint || '');
  const [model, setModel] = useState(currentConfig?.model || '');
  const [customModel, setCustomModel] = useState(currentConfig?.customModel || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, msg: string }

  useEffect(() => {
    if (isOpen && currentConfig) {
      setProviderId(currentConfig.provider || 'groq');
      setApiKey(currentConfig.apiKey || SafeStorage.getProviderKey(currentConfig.provider || 'groq') || '');
      setEndpoint(currentConfig.endpoint || '');
      setModel(currentConfig.model || '');
      setCustomModel(currentConfig.customModel || '');
      setTestResult(null);
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const currentProviderDef = API_PROVIDERS[providerId] || API_PROVIDERS['groq'];

  const handleProviderChange = (e) => {
    const newId = e.target.value;
    const def = API_PROVIDERS[newId];
    setProviderId(newId);
    setApiKey(SafeStorage.getProviderKey(newId) || '');
    setEndpoint(def?.endpoint || '');
    setModel(def?.models?.[0]?.id || '');
    setCustomModel('');
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const configToTest = {
        provider: providerId,
        apiKey: apiKey.trim(),
        endpoint: endpoint.trim(),
        model,
        customModel: customModel.trim()
      };
      const prompt = "Respondé con una sola palabra: OK";
      const reply = await makeLLMRequest(prompt, 50, configToTest);
      if (reply && reply.length > 0) {
        setTestResult({
          success: true,
          msg: `¡Conexión exitosa con ${currentProviderDef.name}! Respuesta recibida.`
        });
      } else {
        setTestResult({
          success: false,
          msg: "El servidor respondió pero no devolvió texto."
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        msg: `Error en la prueba: ${err.message || 'Verificá tu clave y conexión'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const updated = {
      provider: providerId,
      apiKey: apiKey.trim(),
      endpoint: endpoint.trim(),
      model,
      customModel: customModel.trim()
    };
    SafeStorage.setApiConfig(updated);
    onSaveConfig(updated);
    onClose();
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }} onClick={onClose}>
      <div 
        className="modal-content paper-texture" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="dossier-stamp stamp-classified" style={{ top: 12, right: 16 }}>CONFIDENCIAL</div>
        
        <h2 style={{ fontFamily: 'var(--font-typewriter)', fontSize: '20px', marginBottom: '8px', color: 'var(--ink-black)' }}>
          ⚙️ Ajustes de Proveedor de Inteligencia Artificial
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-faded)', marginBottom: '16px', lineHeight: 1.4 }}>
          Configurá la conexión para la generación y el veredicto del caso. Tu clave se almacena exclusivamente en tu navegador (BYOK).
        </p>

        {/* PROVEEDOR SELECT */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
            Proveedor de IA:
          </label>
          <select 
            value={providerId} 
            onChange={handleProviderChange}
            style={{ 
              width: '100%', 
              padding: '8px 10px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '14px'
            }}
          >
            {Object.values(API_PROVIDERS).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.freeTier ? '⚡ [Gratis / Free Tier]' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* INSTRUCCIONES PROVEEDOR */}
        <div style={{ 
          background: 'rgba(0,0,0,0.04)', 
          padding: '8px 12px', 
          borderRadius: '4px', 
          fontSize: '12px', 
          color: 'var(--ink-faded)', 
          marginBottom: '14px',
          borderLeft: '3px solid var(--ink-stamp-blue)'
        }}>
          <span>{currentProviderDef.instructions}</span>{' '}
          <a 
            href={currentProviderDef.docUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--ink-stamp-blue)', textDecoration: 'underline', fontWeight: 'bold' }}
          >
            Obtener clave aquí →
          </a>
        </div>

        {/* API KEY INPUT */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
            API Key de {currentProviderDef.name}:
          </label>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={currentProviderDef.placeholderKey || "Pegá tu clave de API aquí..."}
            style={{ 
              width: '100%', 
              padding: '8px 10px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px'
            }}
          />
        </div>

        {/* MODEL SELECT */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
            Modelo de Inteligencia Artificial:
          </label>
          <select 
            value={customModel ? 'custom' : model} 
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom') {
                setModel('custom');
                if (!customModel) setCustomModel('');
              } else {
                setModel(val);
                setCustomModel('');
              }
            }}
            style={{ 
              width: '100%', 
              padding: '8px 10px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '13px'
            }}
          >
            {(currentProviderDef.models || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.recommended ? '★ (Recomendado)' : ''}
              </option>
            ))}
            <option value="custom">✏️ Modelo Personalizado...</option>
          </select>
        </div>

        {/* CUSTOM MODEL OPTION (SHOWN OR HIGHLIGHTED WHEN CUSTOM IS SELECTED) */}
        {(model === 'custom' || customModel) && (
          <div style={{ 
            marginBottom: '14px', 
            background: 'rgba(139, 30, 30, 0.04)', 
            padding: '10px 12px', 
            border: '1px dashed var(--ink-stamp-red)', 
            borderRadius: '4px' 
          }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--ink-stamp-red)', marginBottom: '4px' }}>
              Identificador del Modelo Personalizado:
            </label>
            <input 
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="ej: gpt-4o, claude-3-7-sonnet, deepseek-ai/deepseek-v4-flash-0731"
              autoFocus
              style={{ 
                width: '100%', 
                padding: '8px 10px', 
                fontFamily: 'var(--font-mono)', 
                background: 'var(--paper-cream)', 
                border: '1px solid var(--ink-stamp-red)', 
                borderRadius: '2px',
                fontSize: '13px'
              }}
            />
            <div style={{ fontSize: '11px', color: 'var(--ink-faded)', marginTop: '4px' }}>
              Ingresá el ID exacto del modelo tal como figura en la documentación de {currentProviderDef.name}.
            </div>
          </div>
        )}

        {/* ENDPOINT INPUT */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--ink-faded)', marginBottom: '4px' }}>
            URL Endpoint (avanzado):
          </label>
          <input 
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '6px 10px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--paper-cream)', 
              border: '1px solid var(--manila-dark)', 
              borderRadius: '2px',
              fontSize: '12px',
              color: 'var(--ink-faded)'
            }}
          />
        </div>

        {/* TEST RESULT NOTIFICATION */}
        {testResult && (
          <div style={{ 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '16px', 
            fontSize: '13px',
            backgroundColor: testResult.success ? 'rgba(34, 139, 34, 0.12)' : 'rgba(178, 34, 34, 0.12)',
            border: `1px solid ${testResult.success ? '#2e7d32' : '#c62828'}`,
            color: testResult.success ? '#1b5e20' : '#b71c1c'
          }}>
            {testResult.success ? '✓ ' : '⚠ '} {testResult.msg}
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-paper" 
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey.trim()}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            {isTesting ? 'Probando...' : '🔍 Probar Conexión'}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn-paper" 
              onClick={onClose}
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn-paper btn-primary" 
              onClick={handleSave}
              style={{ fontSize: '13px', padding: '8px 18px', fontWeight: 'bold' }}
            >
              💾 Guardar Ajustes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
