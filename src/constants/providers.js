export const API_PROVIDERS = {
  openai: {
    id: "openai",
    name: "OpenAI",
    nombre: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: true,
    freeTier: false,
    docUrl: "https://platform.openai.com/api-keys",
    instructions: "Creá tu clave en la consola de OpenAI. Requiere saldo prepago cargado.",
    placeholderKey: "sk-proj-...",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Recomendado)", recommended: true, max_output: 16384 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Económico)", max_output: 16384 },
      { id: "o3-mini", name: "o3-mini (Razonamiento)", max_output: 64000 },
      { id: "gpt-6-astra", name: "GPT-6 Astra", max_output: 128000 },
      { id: "gpt-5.6-sol", name: "GPT-5.6 Sol", max_output: 128000 },
      { id: "gpt-5.6-terra", name: "GPT-5.6 Terra", max_output: 64000 },
      { id: "gpt-5.6-luna", name: "GPT-5.6 Luna", max_output: 128000 }
    ]
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    nombre: "Anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    formato: "anthropic",
    auth: "x-api-key",
    requiresCard: true,
    freeTier: false,
    docUrl: "https://console.anthropic.com/settings/keys",
    instructions: "Creá tu clave en Anthropic Console. Máxima prosa noir y deducción lógica.",
    placeholderKey: "sk-ant-api03-...",
    models: [
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6 (Recomendado)", recommended: true, max_output: 64000 },
      { id: "claude-fable-5-1", name: "Claude Fable 5.1", max_output: 128000 },
      { id: "claude-opus-5", name: "Claude Opus 5", max_output: 128000 },
      { id: "claude-sonnet-5", name: "Claude Sonnet 5", max_output: 64000 },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", max_output: 8192 },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", max_output: 8192 }
    ]
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    nombre: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    formato: "gemini",
    auth: "query-key",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://aistudio.google.com/app/apikey",
    instructions: "Obtené tu clave gratis en Google AI Studio sin necesidad de ingresar tarjeta.",
    placeholderKey: "AIzaSy...",
    models: [
      { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Estable - Recomendado)", recommended: true, max_output: 64000 },
      { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", max_output: 64000 },
      { id: "gemini-3.8-live-extended-thinking", name: "Gemini 3.8 Live Extended Thinking", max_output: 16384 },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", max_output: 64000 },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", max_output: 64000 },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", max_output: 64000 },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", max_output: 32768 }
    ]
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    nombre: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: true,
    freeTier: false,
    docUrl: "https://platform.deepseek.com/api_keys",
    instructions: "Plataforma DeepSeek. Costos extremadamente bajos por caso (~$0.003 USD).",
    placeholderKey: "sk-...",
    models: [
      { id: "deepseek-chat", name: "DeepSeek V3 (Chat - Recomendado)", recommended: true, max_output: 8192 },
      { id: "deepseek-flash", name: "DeepSeek V4.1 Flash", max_output: 128000 },
      { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", max_output: 384000 },
      { id: "deepseek-reasoner", name: "DeepSeek R1 (Reasoner)", max_output: 8192 }
    ]
  },
  groq: {
    id: "groq",
    name: "Groq Cloud",
    nombre: "Groq Cloud",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://console.groq.com/keys",
    instructions: "100% Gratis sin tarjeta en Groq Console. Respuestas a ultra velocidad (LPUs).",
    placeholderKey: "gsk_...",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Recomendado)", recommended: true, max_output: 32768 },
      { id: "llama-3-3-70b-versatile", name: "Llama 3.3 70B Versatile (Alias v4)", max_output: 32768 },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", max_output: 8192 },
      { id: "gemma-2-9b-it", name: "Gemma 2 9B IT", max_output: 8192 }
    ]
  },
  nvidia: {
    id: "nvidia",
    name: "NVIDIA NIM",
    nombre: "NVIDIA NIM",
    endpoint: "https://corsproxy.io/?https://integrate.api.nvidia.com/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://build.nvidia.com",
    instructions: "NVIDIA NIM API Catalog con 1,000 créditos gratuitos para desarrolladores.",
    placeholderKey: "nvapi-...",
    models: [
      { id: "deepseek-ai/deepseek-v4-flash-0731", name: "DeepSeek V4 Flash (NVIDIA NIM - Recomendado)", recommended: true, max_output: 16384 },
      { id: "deepseek-v4-flash-0731", name: "DeepSeek V4 Flash (NIM)", max_output: 4096 },
      { id: "nemotron-3-ultra-550b", name: "Nemotron 3 Ultra 550B", max_output: 4096 },
      { id: "mistral-large-3", name: "Mistral Large 3", max_output: 8192 },
      { id: "llama-3-2-90b-vision", name: "Llama 3.2 90B Vision", max_output: 4096 },
      { id: "moonshotai/kimi-k3", name: "Kimi K3 (Moonshot / NVIDIA NIM)", max_output: 16384 },
      { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B Instruct", max_output: 4096 },
      { id: "mistralai/mistral-large-2-instruct", name: "Mistral Large 2", max_output: 4096 }
    ]
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    nombre: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://openrouter.ai/keys",
    instructions: "Agregador multimodelo con acceso a modelos libres ':free' y comerciales.",
    placeholderKey: "sk-or-v1-...",
    models: [
      { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (Free)", recommended: true, max_output: 8192 },
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", max_output: 4096 },
      { id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B Instruct (Free)", max_output: 4096 },
      { id: "nvidia/nemotron-3.5-lightning:free", name: "Nemotron 3.5 Lightning (Free)", max_output: 8192 },
      { id: "thinkingmachines/inkling-small:free", name: "Inkling Small (Free)", max_output: 8192 },
      { id: "poolside/laguna-s-2.1:free", name: "Laguna S 2.1 (Free)", max_output: 8192 },
      { id: "thinkingmachines/inkling:free", name: "Inkling (Free)", max_output: 8192 },
      { id: "poolside/laguna-xs-2.1:free", name: "Laguna XS 2.1 (Free)", max_output: 8192 },
      { id: "cohere/north-mini-code:free", name: "North Mini Code (Free)", max_output: 8192 },
      { id: "z-ai/glm-5.2:free", name: "GLM 5.2 (Free)", max_output: 8192 },
      { id: "nvidia/nemotron-3.5-content-safety:free", name: "Nemotron 3.5 Content Safety (Free)", max_output: 8192 },
      { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "Nemotron 3 Ultra (Free)", max_output: 8192 },
      { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", name: "Nemotron 3 Nano Omni (Free)", max_output: 8192 },
      { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B A4B (Free)", max_output: 8192 },
      { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B (Free)", max_output: 8192 },
      { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron 3 Super (Free)", max_output: 8192 }
    ]
  },
  github: {
    id: "github",
    name: "GitHub Models",
    nombre: "GitHub Models",
    endpoint: "https://models.inference.ai.azure.com/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://github.com/marketplace/models",
    instructions: "Utilizá tu Personal Access Token (PAT) de GitHub con acceso a Marketplace Models.",
    placeholderKey: "ghp_... o github_pat_...",
    models: [
      { id: "gpt-4o", name: "GPT-4o (GitHub Marketplace)", recommended: true, max_output: 4096 },
      { id: "mistral-large", name: "Mistral Large (GitHub)", max_output: 8192 },
      { id: "Mistral-large-2407", name: "Mistral Large 2407 (GitHub)", max_output: 4096 }
    ]
  },
  cohere: {
    id: "cohere",
    name: "Cohere",
    nombre: "Cohere",
    endpoint: "https://api.cohere.com/v2/chat",
    formato: "cohere",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://dashboard.cohere.com/api-keys",
    instructions: "Cohere Dashboard con capa de prueba gratuita de hasta 1000 llamadas al mes.",
    placeholderKey: "...",
    models: [
      { id: "command-r-plus", name: "Command R+ (Recomendado)", recommended: true, max_output: 4096 },
      { id: "command-r-plus-08-2024", name: "Command R+ (08-2024)", max_output: 4096 },
      { id: "command-r-08-2024", name: "Command R (08-2024)", max_output: 4096 }
    ]
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    nombre: "Mistral AI",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    formato: "openai",
    auth: "bearer",
    requiresCard: false,
    freeTier: true,
    docUrl: "https://console.mistral.ai/api-keys",
    instructions: "Consola de Mistral AI con capa La Plateforme Free Tier.",
    placeholderKey: "...",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large (Recomendado)", recommended: true, max_output: 8192 },
      { id: "codestral-latest", name: "Codestral", max_output: 8192 },
      { id: "mistral-small-latest", name: "Mistral Small", max_output: 8192 }
    ]
  }
};

export const PROVIDER_COMPARISON_DATA = [
  {
    id: "groq",
    name: "Groq Cloud",
    model: "Llama 3.3 70B",
    costPerGame: "100% Gratis",
    freeTier: true,
    reqCard: false,
    speed: "Ultra rápida (< 1.5s)"
  },
  {
    id: "gemini",
    name: "Google Gemini",
    model: "Gemini 3.6 Flash",
    costPerGame: "100% Gratis (~50 req/d)",
    freeTier: true,
    reqCard: false,
    speed: "Muy rápida (~2s)"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    model: "Claude Sonnet 4.6",
    costPerGame: "~$0.04 a $0.06 USD",
    freeTier: false,
    reqCard: true,
    speed: "Alta precisión (~3.5s)"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    model: "DeepSeek V3",
    costPerGame: "~$0.003 USD",
    freeTier: false,
    reqCard: true,
    speed: "Rápida (~2.5s)"
  },
  {
    id: "openai",
    name: "OpenAI",
    model: "GPT-4o",
    costPerGame: "~$0.025 USD",
    freeTier: false,
    reqCard: true,
    speed: "Rápida (~2s)"
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    model: "DeepSeek V4 Flash / Kimi K3",
    costPerGame: "Free (1000 créditos)",
    freeTier: true,
    reqCard: false,
    speed: "Muy rápida (~2s)"
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    model: "DeepSeek R1 / Llama 3.3",
    costPerGame: "Modelos :free disponibles",
    freeTier: true,
    reqCard: false,
    speed: "Variable (~3s)"
  },
  {
    id: "github",
    name: "GitHub Models",
    model: "GPT-4o / Mistral",
    costPerGame: "Gratis con token PAT",
    freeTier: true,
    reqCard: false,
    speed: "Rápida (~2s)"
  },
  {
    id: "mistral",
    name: "Mistral AI",
    model: "Mistral Large",
    costPerGame: "Capa gratuita disponible",
    freeTier: true,
    reqCard: false,
    speed: "Rápida (~2s)"
  },
  {
    id: "cohere",
    name: "Cohere",
    model: "Command R+",
    costPerGame: "Trial 1000 req/mes",
    freeTier: true,
    reqCard: false,
    speed: "Moderada (~3s)"
  }
];
