import { makeLLMRequestWithRetry, parseLLMJson } from './llmAdapter.js';
import { SafeStorage } from './storage.js';

export async function evaluateVerdict({
  truth,
  suspects,
  evidences,
  acusadoId,
  armaId,
  motivo,
  reconstruccion,
  apiConfig,
  isOffline,
  onRetryStatus
}) {
  const susp = suspects.find(s => s.id === acusadoId);
  const arma = evidences.find(e => e.id === armaId);

  const canCallLLM = !isOffline && apiConfig && (apiConfig.apiKey || apiConfig.provider === 'custom');

  if (canCallLLM) {
    const promptCall2 = `Sos el juez evaluador de un juego de misterio policial.

SOLUCIÓN REAL DEL CASO:
${JSON.stringify(truth, null, 2)}

DEDUCCIÓN DEL JUGADOR:
- Acusado: ${susp?.nombre || acusadoId} (ID: ${acusadoId})
- Arma/método: ${arma?.objeto || armaId} (ID: ${armaId})
- Motivo propuesto: ${motivo}
- Reconstrucción: ${reconstruccion}

INSTRUCCIONES:
- Evaluá si el jugador acertó el culpable (40 pts), el arma (20 pts) y el motivo (20 pts) comparando con la solución real.
- Para la calidad de la reconstrucción (0 a 20 puntos): evaluá coherencia lógica, uso de las pistas disponibles y si la narrativa se aproxima a la secuencia real aunque no sea perfecta.
- Escribí 'narrativaCondena' como un párrafo dramatizado estilo periodístico/judicial que cuente cómo terminó el caso según el puntaje obtenido.
- Usá el texto de condena del rango correspondiente al puntajeTotal (0-19, 20-49, 50-79, 80-100).

Devolvé ÚNICAMENTE el JSON de resultado con esta estructura exacta. Sin explicaciones ni texto adicional:
{
  "puntaje": 0,
  "desglose": {
    "culpable": { "acerto": true, "puntos": 40 },
    "movil": { "acerto": false, "puntos": 0 },
    "arma": { "acerto": true, "puntos": 20 },
    "reconstruccion": { "puntos": 12, "comentario": "string" }
  },
  "puntajeTotal": 72,
  "condena": "string con el texto de la condena",
  "narrativaCondena": "string"
}`;

    try {
      const resp = await makeLLMRequestWithRetry(
        promptCall2,
        2000,
        "Evaluación del Tribunal",
        onRetryStatus,
        apiConfig,
        2
      );
      const evalResult = parseLLMJson(resp);
      const won = (evalResult.puntajeTotal || evalResult.puntaje) >= 50;
      SafeStorage.recordGameFinished(apiConfig.provider, won);
      return evalResult;
    } catch (err) {
      console.warn("LLM verdict failed, falling back to local deterministic evaluator:", err);
    }
  }

  // Local Deterministic Evaluator (Fallback or Offline)
  const acertoCulpable = (acusadoId === truth.culpable);
  const acertoArma = (armaId === truth.arma);

  // Simple keyword matching for motive
  const truthMotiveKeywords = (truth.movil || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const userMotiveWords = (motivo || '').toLowerCase();
  let matchCount = 0;
  truthMotiveKeywords.forEach(k => {
    if (userMotiveWords.includes(k)) matchCount++;
  });
  const acertoMovil = acertoCulpable && (matchCount >= 2 || userMotiveWords.length > 30);

  // Reconstruction points
  let reconPoints = Math.min(20, Math.max(5, Math.floor((reconstruccion || '').length / 25)));
  if (!acertoCulpable) reconPoints = Math.min(6, reconPoints);

  const ptsCulpable = acertoCulpable ? 40 : 0;
  const ptsArma = acertoArma ? 20 : 0;
  const ptsMovil = acertoMovil ? 20 : 0;
  const puntajeTotal = ptsCulpable + ptsArma + ptsMovil + reconPoints;

  let condenaKey = "0_19";
  if (puntajeTotal >= 80) condenaKey = "80_100";
  else if (puntajeTotal >= 50) condenaKey = "50_79";
  else if (puntajeTotal >= 20) condenaKey = "20_49";

  const condenaTexto = (truth.condenas && truth.condenas[condenaKey]) 
    ? truth.condenas[condenaKey] 
    : (puntajeTotal >= 50 ? "Condena firme impuesta por el tribunal." : "Absolución por dudas procesales.");

  const fallbackResult = {
    puntaje: puntajeTotal,
    puntajeTotal,
    desglose: {
      culpable: { acerto: acertoCulpable, puntos: ptsCulpable },
      movil: { acerto: acertoMovil, puntos: ptsMovil },
      arma: { acerto: acertoArma, puntos: ptsArma },
      reconstruccion: { 
        puntos: reconPoints, 
        comentario: acertoCulpable ? "Reconstrucción fundamentada con elementos de la escena." : "Premisas desacertadas respecto al autor principal."
      }
    },
    condena: condenaTexto,
    narrativaCondena: acertoCulpable
      ? `Tras un juicio riguroso, el tribunal consideró probada la autoría de ${susp?.nombre || 'el acusado'}. La fiscalía sostuvo el peso de la evidencia mientras el jurado deliberaba con resolución.`
      : `El caso concluyó sin pruebas concluyentes para incriminar a ${susp?.nombre || 'el sospechoso señalado'}. La sombra del verdadero culpable continuó rondando impune por las calles.`
  };

  SafeStorage.recordGameFinished(apiConfig?.provider || 'local', puntajeTotal >= 50);
  return fallbackResult;
}
