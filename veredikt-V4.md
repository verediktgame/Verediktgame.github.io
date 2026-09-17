# VEREDIKT — Integración de APIs y Sistema de Llamadas v4

## Contexto
Veredikt consume exactamente **8 llamadas por partida completa**:
- 6 llamadas de generación del caso (pasos 1A → 1F)
- 1 llamada de evaluación del veredicto
- 1 llamada de prueba de conexión (al configurar la API)

Esto define el límite máximo de partidas por día según el plan de cada proveedor.

---

## MEJORA 1 — Proveedores y modelos hardcodeados

Reemplazar el selector de proveedor y modelo actuales por esta estructura completa. El jugador elige proveedor → el selector de modelo se filtra automáticamente.

### Estructura de datos de proveedores (JS)

```javascript
const API_PROVIDERS = [
  {
    id: "openai",
    nombre: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    formato: "openai", // Para el adaptador de llamadas
    auth: "bearer",
    requiere_tarjeta: true,
    tiene_capa_gratis: false,
    limite_diario: null, // Sin tope diario fijo — depende del saldo
    llamadas_por_partida: 8,
    partidas_por_dia: null, // Ilimitado según saldo
    consola: "https://openai.com",
    modelos: [
      { id: "gpt-6-astra",   nombre: "GPT-6 Astra",   max_output: 128000 },
      { id: "gpt-5.6-sol",   nombre: "GPT-5.6 Sol",   max_output: 128000 },
      { id: "gpt-5.6-terra", nombre: "GPT-5.6 Terra",  max_output: 64000  },
      { id: "gpt-5.6-luna",  nombre: "GPT-5.6 Luna",  max_output: 128000 }
    ]
  },
  {
    id: "anthropic",
    nombre: "Anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    formato: "anthropic",
    auth: "x-api-key",
    requiere_tarjeta: true,
    tiene_capa_gratis: false,
    limite_diario: null,
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://anthropic.com",
    modelos: [
      { id: "claude-fable-5-1",  nombre: "Claude Fable 5.1",  max_output: 128000 },
      { id: "claude-opus-5",     nombre: "Claude Opus 5",     max_output: 128000 },
      { id: "claude-sonnet-5",   nombre: "Claude Sonnet 5",   max_output: 64000  },
      { id: "claude-sonnet-4-6", nombre: "Claude Sonnet 4.6", max_output: 64000  }
    ]
  },
  {
    id: "gemini",
    nombre: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    formato: "gemini",
    auth: "query-key", // Se envía como ?key=
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: 50, // Aprox. capa gratuita
    llamadas_por_partida: 8,
    partidas_por_dia: 6, // 50 / 8 = 6 partidas completas
    consola: "https://aistudio.google.com",
    modelos: [
      { id: "gemini-3.8-flash",                    nombre: "Gemini 3.8 Flash",                  max_output: 64000 },
      { id: "gemini-3.8-live-extended-thinking",   nombre: "Gemini 3.8 Live Extended Thinking", max_output: 16384 },
      { id: "gemini-3.6-flash",                    nombre: "Gemini 3.6 Flash (Estable)",        max_output: 64000 }
    ]
  },
  {
    id: "deepseek",
    nombre: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    formato: "openai", // Compatible con formato OpenAI
    auth: "bearer",
    requiere_tarjeta: true,
    tiene_capa_gratis: false,
    limite_diario: null,
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://platform.deepseek.com",
    modelos: [
      { id: "deepseek-flash",   nombre: "DeepSeek V4.1 Flash", max_output: 128000 },
      { id: "deepseek-v4-pro",  nombre: "DeepSeek V4 Pro",     max_output: 384000 }
    ]
  },
  {
    id: "groq",
    nombre: "Groq Cloud",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: 14400, // RPD según modelo
    llamadas_por_partida: 8,
    partidas_por_dia: 999, // Prácticamente ilimitado (14400 RPD)
    consola: "https://console.groq.com",
    modelos: [
      { id: "llama-3-3-70b-versatile", nombre: "Llama 3.3 70B Versatile", max_output: 32768 },
      { id: "gemma-2-9b-it",           nombre: "Gemma 2 9B IT",           max_output: 8192  }
    ]
  },
  {
    id: "nvidia",
    nombre: "NVIDIA NIM",
    endpoint: "https://integrate.api.nvidia.com/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: null, // 40 RPM, sin tope diario fijo
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://build.nvidia.com",
    modelos: [
      { id: "nemotron-3-ultra-550b",    nombre: "Nemotron 3 Ultra 550B",    max_output: 4096 },
      { id: "mistral-large-3",          nombre: "Mistral Large 3",          max_output: 8192 },
      { id: "llama-3-2-90b-vision",     nombre: "Llama 3.2 90B Vision",     max_output: 4096 },
      { id: "deepseek-v4-flash-0731",   nombre: "DeepSeek V4 Flash (NIM)",  max_output: 4096 }
    ]
  },
  {
    id: "openrouter",
    nombre: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: null, // Regulado por balance comunitario
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://openrouter.ai",
    modelos: [
      { id: "deepseek/deepseek-r1:free", nombre: "DeepSeek R1 (Free)", max_output: 8192 },
      { id: "meta-llama/llama-3-8b-instruct:free", nombre: "Llama 3 8B Instruct (Free)", max_output: 4096 }
    ]
  },
  {
    id: "github",
    nombre: "GitHub Models",
    endpoint: "https://models.inference.ai.azure.com/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: null, // RPM limitado, sin tope diario publicado
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://github.com/marketplace/models",
    modelos: [
      { id: "gpt-4o",        nombre: "GPT-4o (GitHub)",        max_output: 4096 },
      { id: "mistral-large", nombre: "Mistral Large (GitHub)",  max_output: 8192 }
    ]
  },
  {
    id: "cohere",
    nombre: "Cohere",
    endpoint: "https://api.cohere.com/v2/chat",
    formato: "cohere", // Formato propio
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: 33, // 1000 llamadas/mes ÷ 30 días
    llamadas_por_partida: 8,
    partidas_por_dia: 4, // 33 / 8 = 4 partidas completas por día promedio
    consola: "https://dashboard.cohere.com",
    modelos: [
      { id: "command-r-plus", nombre: "Command R+", max_output: 4096 }
    ]
  },
  {
    id: "mistral",
    nombre: "Mistral AI",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiere_tarjeta: false,
    tiene_capa_gratis: true,
    limite_diario: null,
    llamadas_por_partida: 8,
    partidas_por_dia: null,
    consola: "https://console.mistral.ai",
    modelos: [
      { id: "codestral-latest", nombre: "Codestral", max_output: 8192 }
    ]
  }
];
```

---

## MEJORA 2 — Adaptador de llamadas por formato

Cada proveedor tiene un formato de request/response distinto. Centralizar en un único adaptador:

```javascript
async function makeLLMRequest(prompt, maxTokens) {
  const cfg = AppState.apiConfig; // { provider, apiKey, modelId }
  const provider = API_PROVIDERS.find(p => p.id === cfg.provider);

  let response;

  if (provider.formato === "openai") {
    response = await fetch(provider.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model: cfg.modelId,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    return { text: data.choices[0].message.content };

  } else if (provider.formato === "anthropic") {
    response = await fetch(provider.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: cfg.modelId,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    return { text: data.content[0].text };

  } else if (provider.formato === "gemini") {
    const url = provider.endpoint.replace("{model}", cfg.modelId) + `?key=${cfg.apiKey}`;
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    return { text: data.candidates[0].content.parts[0].text };

  } else if (provider.formato === "cohere") {
    response = await fetch(provider.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model: cfg.modelId,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Error ${response.status}`);
    return { text: data.message.content[0].text };
  }
}
```

---

## MEJORA 3 — Sistema de reintentos automáticos

Toda llamada a la IA debe reintentar automáticamente antes de mostrar error al usuario. Envolver `makeLLMRequest` con esta lógica:

```javascript
async function makeLLMRequestWithRetry(prompt, maxTokens, stepName, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        updateProgressLabel(`${stepName} — Reintentando (${attempt}/${maxRetries})...`);
        await sleep(1500 * attempt); // Espera creciente entre reintentos
      }

      const result = await makeLLMRequest(prompt, maxTokens);

      // Validar que no sea JSON truncado
      const parsed = parseLLMJson(result.text);
      return parsed; // Éxito

    } catch (err) {
      lastError = err;

      // Error 429 (rate limit) — esperar más antes de reintentar
      if (err.message?.includes('429') || err.message?.toLowerCase().includes('rate limit')) {
        updateProgressLabel(`${stepName} — Límite de llamadas alcanzado, esperando...`);
        await sleep(5000 * attempt);
        continue;
      }

      // Error de autenticación — no reintentar, fallar inmediatamente
      if (err.message?.includes('401') || err.message?.includes('403')) {
        throw new Error(`API Key inválida o sin permisos. Verificá la configuración.`);
      }

      // Cualquier otro error — reintentar
      console.warn(`${stepName} falló en intento ${attempt}:`, err.message);
    }
  }

  // Si agotó los reintentos
  throw new Error(`${stepName} — No se pudo completar después de ${maxRetries} intentos. ${lastError?.message || ''}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Reemplazar todas las llamadas en `generateCase()` de `makeLLMRequest(prompt, tokens)` por `makeLLMRequestWithRetry(prompt, tokens, "① Encabezado del caso")` etc., pasando el nombre del paso correspondiente.

---

## MEJORA 4 — Sección "Mi API" dentro del juego

Agregar una pantalla o modal accesible desde el menú (ícono 📊 o "Mi API") que muestre la siguiente información personalizada según el proveedor configurado.

### Renderizado dinámico

```javascript
function renderApiInfo() {
  const cfg = AppState.apiConfig;
  const provider = API_PROVIDERS.find(p => p.id === cfg?.provider);

  if (!provider) {
    return `<p>Configurá tu API para ver esta información.</p>`;
  }

  const llamadasPorPartida = provider.llamadas_por_partida; // Siempre 8
  const tieneGratis = provider.tiene_capa_gratis;
  const limiteDiario = provider.limite_diario;
  const partidasPorDia = provider.partidas_por_dia;

  let limiteLine = '';
  if (limiteDiario) {
    limiteLine = `
      <div class="api-stat">
        <span class="stat-label">Límite diario estimado</span>
        <span class="stat-value">${limiteDiario} llamadas/día</span>
      </div>
      <div class="api-stat highlight">
        <span class="stat-label">Partidas completas por día</span>
        <span class="stat-value">${partidasPorDia} partidas</span>
      </div>
    `;
  } else {
    limiteLine = `
      <div class="api-stat">
        <span class="stat-label">Límite diario</span>
        <span class="stat-value">Sin tope fijo (según saldo/plan)</span>
      </div>
    `;
  }

  return `
    <div class="api-info-panel">
      <h3>${provider.nombre}</h3>
      <div class="api-badge ${tieneGratis ? 'free' : 'paid'}">
        ${tieneGratis ? '✓ Tiene capa gratuita' : '💳 Solo de pago'}
      </div>

      <div class="api-stats">
        <div class="api-stat">
          <span class="stat-label">Modelo activo</span>
          <span class="stat-value">${cfg.modelId}</span>
        </div>
        <div class="api-stat">
          <span class="stat-label">Llamadas por partida</span>
          <span class="stat-value">${llamadasPorPartida} llamadas</span>
        </div>
        ${limiteLine}
      </div>

      <div class="api-note">
        <strong>¿Cómo se usan las llamadas?</strong><br>
        Cada caso se genera en 6 pasos independientes para evitar respuestas cortadas.
        Al enviar tu acusación se realiza 1 llamada más de evaluación.
        La prueba de conexión consume 1 llamada adicional.
      </div>

      <a href="${provider.consola}" target="_blank" class="btn-consola">
        Ir a la consola de ${provider.nombre} →
      </a>
    </div>
  `;
}
```

### Tabla de referencia rápida (hardcodeada en HTML)

Mostrar esta tabla en la sección "Mi API" debajo del panel personalizado:

| Proveedor | Capa Gratis | Llamadas/día (free) | Partidas/día (aprox.) | Tarjeta |
|---|---|---|---|---|
| OpenAI | ✗ | Sin tope (saldo) | Según saldo | Sí |
| Anthropic | ✗ | Sin tope (saldo) | Según saldo | Sí |
| Google Gemini | ✓ | ~50 | ~6 | No |
| DeepSeek | ✗ | Sin tope (saldo) | Según saldo | Sí |
| Groq Cloud | ✓ | 14,400 | ~999 | No |
| NVIDIA NIM | ✓ | 40 RPM | ~999 | No |
| OpenRouter | ✓ | Variable | Variable | No |
| GitHub Models | ✓ | RPM limitado | ~999 | No |
| Cohere | ✓ | ~33 | ~4 | No |
| Mistral AI | ✓ | Variable | Variable | No |

> **Recomendación gratuita sin tarjeta:** Groq Cloud con Llama 3.3 70B Versatile es la mejor opción para jugar sin límites.

---

## Notas para el agente

- El selector de proveedor debe filtrar automáticamente los modelos disponibles al cambiar.
- Al cambiar de proveedor, limpiar el campo de modelo y mostrar el placeholder "Seleccioná un modelo".
- Gemini usa un endpoint con `{model}` en la URL — reemplazarlo dinámicamente antes del fetch.
- Cohere usa una estructura de response distinta — el adaptador ya lo maneja.
- GitHub Models usa el mismo endpoint de Azure AI Inference con el token de GitHub como Bearer.
- OpenRouter requiere opcionalmente los headers `HTTP-Referer` y `X-Title` — agregarlos como `https://veredikt.app` y `Veredikt` respectivamente para identificar la app.
- Todos los `max_tokens` de las 6 llamadas de generación deben mantenerse en 4000.
- El sistema de reintentos aplica a las 6 llamadas de generación Y a la llamada de evaluación del veredicto.
- La llamada de prueba de conexión NO usa reintentos — debe fallar rápido para dar feedback inmediato.
