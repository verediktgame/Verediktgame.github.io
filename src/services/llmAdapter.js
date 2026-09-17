import { SafeStorage } from './storage.js';

export function parseLLMJson(text) {
  let clean = (text || '').trim();
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');
  if (first !== -1 && last !== -1) {
    clean = clean.substring(first, last + 1);
  }
  return JSON.parse(clean);
}

export async function makeLLMRequest(prompt, maxTokens = 4000, apiConfig) {
  if (!apiConfig || !apiConfig.apiKey) {
    throw new Error('No se ha configurado la clave de API. Abrí Ajustes de API en el menú superior.');
  }

  const { provider, apiKey, endpoint, model } = apiConfig;
  const targetModel = apiConfig.customModel ? apiConfig.customModel.trim() : model;

  let res;
  let data;

  if (provider === 'anthropic') {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      const err = new Error(`Error ${res.status}: ${errBody}`);
      err.status = res.status;
      throw err;
    }

    data = await res.json();
    SafeStorage.recordGameCall(provider);
    return data.content?.[0]?.text || '';
  }

  if (provider === 'gemini') {
    const geminiUrl = endpoint.replace('{model}', targetModel) + `?key=${apiKey}`;
    res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      const err = new Error(`Error ${res.status}: ${errBody}`);
      err.status = res.status;
      throw err;
    }

    data = await res.json();
    SafeStorage.recordGameCall(provider);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  if (provider === 'cohere') {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      const err = new Error(`Error ${res.status}: ${errBody}`);
      err.status = res.status;
      throw err;
    }

    data = await res.json();
    SafeStorage.recordGameCall(provider);
    return data.message?.content?.[0]?.text || '';
  }

  // OpenAI format: OpenAI, DeepSeek, Groq, NVIDIA NIM, OpenRouter, GitHub Models, Mistral
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://veredikt.app';
    headers['X-Title'] = 'Veredikt Criminal Investigation';
  }

  res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: targetModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const errBody = await res.text();
    const err = new Error(`Error ${res.status}: ${errBody}`);
    err.status = res.status;
    throw err;
  }

  data = await res.json();
  SafeStorage.recordGameCall(provider);
  const msg = data.choices?.[0]?.message;
  return msg?.content || msg?.reasoning_content || '';
}

export async function makeLLMRequestWithRetry(
  prompt,
  maxTokens = 4000,
  stepName = 'Operación',
  onRetryStatus = null,
  apiConfig = null,
  maxRetries = 3
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await makeLLMRequest(prompt, maxTokens, apiConfig);
    } catch (err) {
      attempt++;
      const isAuthError = err.status === 401 || err.status === 403;
      if (isAuthError) {
        throw new Error(`Error de autenticación (${err.status}) en ${apiConfig.provider}: Verificá que la API key sea válida.`);
      }

      if (attempt >= maxRetries) {
        throw new Error(`Falló ${stepName} tras ${maxRetries} intentos: ${err.message}`);
      }

      const isRateLimit = err.status === 429 || (err.message && err.message.toLowerCase().includes('rate limit'));
      const waitTimeMs = isRateLimit ? 5000 * attempt : 2000 * attempt;

      if (onRetryStatus) {
        const reason = isRateLimit ? 'Límite de tasa (429)' : 'Fallo temporal';
        onRetryStatus(`${stepName} — ${reason}. Reintentando en ${waitTimeMs / 1000}s... (Intento ${attempt}/${maxRetries})`);
      }

      await new Promise(r => setTimeout(r, waitTimeMs));
    }
  }
}
