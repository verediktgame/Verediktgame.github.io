import { makeLLMRequestWithRetry, parseLLMJson } from './llmAdapter.js';
import { SafeStorage, obfuscateTruth } from './storage.js';

export const PASOS_GENERACION = [
  { id: 1, label: "① Abriendo el expediente...", desc: "Generando víctima y escena" },
  { id: 2, label: "② Identificando sospechosos...", desc: "Perfiles y coartadas" },
  { id: 3, label: "③ Recolectando evidencias...", desc: "Pistas y declaraciones" },
  { id: 4, label: "④ Preparando interrogatorios...", desc: "Preguntas y respuestas" },
  { id: 5, label: "⑤ Procesando laboratorio forense...", desc: "Análisis químicos y huellas" },
  { id: 6, label: "⑥ Sellando la verdad del caso...", desc: "Resolución definitiva" }
];

export function buildPrompt1A(ciudad, dificultad) {
  const ciudadParam = (!ciudad || ciudad.includes("Aleatoria")) ? "Aleatoria" : ciudad.trim();
  return `Sos el autor de un juego de misterio policial. Generá solo el encabezado de un caso criminal.

PARÁMETROS:
- Ciudad: ${ciudadParam}
- Dificultad: ${dificultad}

Decidí vos: el tipo de crimen, la época histórica y la atmósfera según la ciudad.
Si la ciudad es "Aleatoria", elegí vos cualquier ciudad y época del mundo.

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "titulo": "string — título dramático del caso",
  "ciudad": "string — ciudad y país",
  "epoca": "string — ej: Buenos Aires, 1943 o Londres, 1987",
  "tipo_crimen": "string — ej: homicidio, desaparición, fraude",
  "atmosfera": "string — 1 oración describiendo el tono del caso",
  "victima": {
    "nombre": "string",
    "descripcion": "string — 1 oración"
  },
  "descripcionEscena": "string — 2 oraciones describiendo el lugar del crimen",
  "informeGeneral": "string — 2 oraciones del informe policial oficial"
}`;
}

export function buildPrompt1B(base, dificultad) {
  return `Sos el autor de un juego de misterio policial. Generá los sospechosos del caso.

CONTEXTO DEL CASO:
- Título: ${base.titulo}
- Ciudad/Época: ${base.epoca}
- Crimen: ${base.tipo_crimen}
- Víctima: ${base.victima.nombre} — ${base.victima.descripcion}
- Escena: ${base.descripcionEscena}

REGLAS:
- Dificultad "${dificultad}": ${dificultad === 'Fácil' ? '3 sospechosos, culpable con coartada débil' : dificultad === 'Normal' ? '4 sospechosos, más de uno creíble' : '4 sospechosos, culpable con coartada sólida y red herrings'}
- Uno de ellos ES el culpable real — decidí vos cuál
- Cada campo: máximo 2 oraciones
- Los ids van de s1 a s3 o s4 según corresponda

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "culpable_id": "s2",
  "sospechosos": [
    {
      "id": "s1",
      "nombre": "string",
      "perfil": "string",
      "coartada": "string"
    }
  ]
}`;
}

export function buildPrompt1C(base, sospechosos, culpableId, dificultad) {
  const culpableObj = sospechosos.find(s => s.id === culpableId);
  const culpableNombre = culpableObj ? culpableObj.nombre : culpableId;

  return `Sos el autor de un juego de misterio policial. Generá las evidencias y declaraciones de testigos.

CONTEXTO DEL CASO:
- Título: ${base.titulo}
- Época: ${base.epoca}
- Crimen: ${base.tipo_crimen}
- Escena: ${base.descripcionEscena}
- Culpable real: ${culpableNombre}
- Arma/método: decidí vos cuál evidencia será el arma principal

REGLAS:
- ${dificultad === 'Fácil' ? '4 evidencias' : '5 evidencias'}
- El arma principal debe tener una ubicación coherente con la escena
- Las otras evidencias pueden señalar a inocentes o ser ambiguas
- Exactamente 2 testigos con declaraciones que aporten pistas reales pero incompletas
- Cada campo: máximo 2 oraciones

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "arma_id": "e1",
  "evidencias": [
    {
      "id": "e1",
      "objeto": "string",
      "descripcion": "string",
      "ubicacion": "string"
    }
  ],
  "declaraciones": [
    {
      "testigo": "string",
      "relacion": "string",
      "texto": "string"
    }
  ]
}`;
}

export function buildPrompt1D(base, sospechosos, culpableId) {
  const listaSospechosos = sospechosos.map(s =>
    `- ${s.id}: ${s.nombre} | Perfil: ${s.perfil} | Coartada: ${s.coartada}`
  ).join('\n');

  return `Sos el autor de un juego de misterio policial. Generá exactamente 5 preguntas con respuestas para cada sospechoso.

CASO:
- Crimen: ${base.tipo_crimen} en ${base.epoca}
- Víctima: ${base.victima.nombre}
- Culpable real: ${culpableId}

SOSPECHOSOS:
${listaSospechosos}

REGLAS CRÍTICAS:
- 5 preguntas por sospechoso, sin excepción
- Para el culpable (${culpableId}): al menos 1 respuesta contiene una contradicción sutil o detalle que lo delata si se presta atención
- Para cada inocente: al menos 1 pregunta es un red herring que puede confundir
- Cada respuesta: máximo 2 oraciones, en primera persona del sospechoso
- Las preguntas deben ser coherentes con el perfil y la coartada de cada uno

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown.
Si hay 3 sospechosos el JSON tiene 3 claves, si hay 4 tiene 4 claves:

{
  "preguntas": {
    "s1": [
      { "id": "p1", "pregunta": "string", "respuesta": "string" },
      { "id": "p2", "pregunta": "string", "respuesta": "string" },
      { "id": "p3", "pregunta": "string", "respuesta": "string" },
      { "id": "p4", "pregunta": "string", "respuesta": "string" },
      { "id": "p5", "pregunta": "string", "respuesta": "string" }
    ]
  }
}`;
}

export function buildPrompt1E(base, sospechosos, culpableId, evidencias, armaId, dificultad) {
  const listaEvidencias = evidencias.map(e =>
    `- ${e.id}: ${e.objeto} | Ubicación: ${e.ubicacion}`
  ).join('\n');

  const culpableObj = sospechosos.find(s => s.id === culpableId);
  const culpableNombre = culpableObj ? culpableObj.nombre : culpableId;
  const armaObj = evidencias.find(e => e.id === armaId);
  const armaNombre = armaObj ? armaObj.objeto : armaId;

  return `Sos el jefe del laboratorio forense. Generá el informe de análisis para cada evidencia.

CASO:
- Crimen: ${base.tipo_crimen} en ${base.epoca}
- Culpable: ${culpableNombre}
- Arma principal: ${armaNombre} (id: ${armaId})

EVIDENCIAS:
${listaEvidencias}

REGLAS:
- El análisis del arma principal (${armaId}) debe contener prueba forense concreta que vincule al culpable (huellas, ADN, fibras, etc.)
- Las otras evidencias: pueden ser neutras, ambiguas o señalar a inocentes
- Dificultad "${dificultad}": ${dificultad === 'Difícil' ? 'las pruebas son ambiguas excepto en el arma principal' : 'las pruebas son más directas'}
- Tono técnico/científico. Máximo 2 oraciones por evidencia.

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "forense": {
    "e1": "string",
    "e2": "string"
  }
}`;
}

export function buildPrompt1F(base, sospechosos, culpableId, evidencias, armaId) {
  const culpableObj = sospechosos.find(s => s.id === culpableId);
  const culpableNombre = culpableObj ? culpableObj.nombre : culpableId;
  const armaObj = evidencias.find(e => e.id === armaId);
  const armaNombre = armaObj ? armaObj.objeto : armaId;

  const resumenCompleto = `
Título: ${base.titulo}
Época: ${base.epoca}
Víctima: ${base.victima.nombre}
Culpable: ${culpableNombre} (${culpableId})
Arma: ${armaNombre} (${armaId})
Sospechosos: ${sospechosos.map(s => s.nombre).join(', ')}
Evidencias: ${evidencias.map(e => e.objeto).join(', ')}
`;

  return `Sos el autor de un juego de misterio policial. Generá la verdad sellada del caso.

RESUMEN DEL CASO:
${resumenCompleto}

REGLAS:
- secuenciaReal: narración dramática de cómo ocurrió el crimen, coherente con TODO lo del caso. Máximo 4 oraciones.
- pistasClave: exactamente 3, referenciando elementos concretos del caso que el jugador debió notar
- movil: el motivo real del crimen. Máximo 2 oraciones.
- Las 4 condenas deben variar dramáticamente en tono y consecuencias

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "truth": {
    "culpable": "${culpableId}",
    "arma": "${armaId}",
    "movil": "string",
    "secuenciaReal": "string",
    "pistasClave": ["string", "string", "string"],
    "rubrica": {
      "acerto_culpable": 40,
      "acerto_movil": 20,
      "acerto_arma": 20,
      "calidad_reconstruccion_max": 20
    },
    "condenas": {
      "80_100": "string — cadena perpetua, tono definitivo",
      "50_79": "string — condena parcial, la defensa redujo la pena",
      "20_49": "string — condena mínima, casi sin consecuencias",
      "0_19": "string — absolución, el culpable queda libre"
    }
  }
}`;
}

export async function generateCaseWithLLM(ciudad, dificultad, apiConfig, onProgress) {
  let base, sospechosoData, evidenciaData, preguntasData, forenseData, truthData;

  const updateProgress = (stepIndex, text) => {
    if (onProgress) {
      onProgress(stepIndex, text);
    }
  };

  // PASO 1
  updateProgress(1, PASOS_GENERACION[0].label);
  const r1A = await makeLLMRequestWithRetry(
    buildPrompt1A(ciudad, dificultad),
    4000,
    "Paso 1: Encabezado del caso",
    (msg) => updateProgress(1, msg),
    apiConfig
  );
  base = parseLLMJson(r1A);
  if (!base.titulo || !base.victima || !base.descripcionEscena || !base.informeGeneral) {
    throw new Error("Paso 1 incompleto en la respuesta del modelo.");
  }

  // PASO 2
  updateProgress(2, PASOS_GENERACION[1].label);
  const r1B = await makeLLMRequestWithRetry(
    buildPrompt1B(base, dificultad),
    4000,
    "Paso 2: Sospechosos",
    (msg) => updateProgress(2, msg),
    apiConfig
  );
  sospechosoData = parseLLMJson(r1B);
  if (!sospechosoData.sospechosos?.length || !sospechosoData.culpable_id) {
    throw new Error("Paso 2 incompleto en la respuesta del modelo.");
  }
  const { culpable_id: culpableId, sospechosos } = sospechosoData;

  // PASO 3
  updateProgress(3, PASOS_GENERACION[2].label);
  const r1C = await makeLLMRequestWithRetry(
    buildPrompt1C(base, sospechosos, culpableId, dificultad),
    4000,
    "Paso 3: Evidencias y testigos",
    (msg) => updateProgress(3, msg),
    apiConfig
  );
  evidenciaData = parseLLMJson(r1C);
  if (!evidenciaData.evidencias?.length || !evidenciaData.arma_id || !evidenciaData.declaraciones) {
    throw new Error("Paso 3 incompleto en la respuesta del modelo.");
  }
  const { arma_id: armaId, evidencias, declaraciones } = evidenciaData;

  // PASO 4
  updateProgress(4, PASOS_GENERACION[3].label);
  const r1D = await makeLLMRequestWithRetry(
    buildPrompt1D(base, sospechosos, culpableId),
    4000,
    "Paso 4: Interrogatorios",
    (msg) => updateProgress(4, msg),
    apiConfig
  );
  preguntasData = parseLLMJson(r1D);
  if (!preguntasData.preguntas) {
    throw new Error("Paso 4 incompleto en la respuesta del modelo.");
  }

  // PASO 5
  updateProgress(5, PASOS_GENERACION[4].label);
  const r1E = await makeLLMRequestWithRetry(
    buildPrompt1E(base, sospechosos, culpableId, evidencias, armaId, dificultad),
    4000,
    "Paso 5: Laboratorio forense",
    (msg) => updateProgress(5, msg),
    apiConfig
  );
  forenseData = parseLLMJson(r1E);
  if (!forenseData.forense) {
    throw new Error("Paso 5 incompleto en la respuesta del modelo.");
  }

  // PASO 6
  updateProgress(6, PASOS_GENERACION[5].label);
  const r1F = await makeLLMRequestWithRetry(
    buildPrompt1F(base, sospechosos, culpableId, evidencias, armaId),
    4000,
    "Paso 6: Verdad sellada",
    (msg) => updateProgress(6, msg),
    apiConfig
  );
  truthData = parseLLMJson(r1F);
  if (!truthData.truth?.culpable) {
    throw new Error("Paso 6 incompleto en la respuesta del modelo.");
  }

  updateProgress(7, "Expediente sellado y listo.");

  // Assemble merged public info
  const publicInfo = {
    ...base,
    lugar: base.ciudad || base.epoca || ciudad || 'Desconocido',
    ciudad: base.ciudad || ciudad || 'Desconocido',
    fecha: base.epoca || base.fecha || 'Sin fecha',
    sospechosos: sospechosos.map(s => ({
      ...s,
      preguntas: (preguntasData.preguntas && preguntasData.preguntas[s.id]) || []
    })),
    evidencias: evidencias.map(e => ({
      ...e,
      analisisForense: (forenseData.forense && forenseData.forense[e.id]) || "Sin datos forenses."
    })),
    declaraciones: declaraciones || []
  };

  return {
    publicInfo,
    truth: truthData.truth,
    isOffline: false
  };
}
