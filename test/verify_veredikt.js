// Automated validation script for Veredikt v4
import { API_PROVIDERS, PROVIDER_COMPARISON_DATA } from '../src/constants/providers.js';
import { DEMO_CASE } from '../src/constants/demoCase.js';
import { CIUDADES_FAMOSAS } from '../src/constants/cities.js';
import { obfuscateTruth, deobfuscateTruth } from '../src/services/storage.js';
import { parseLLMJson } from '../src/services/llmAdapter.js';
import { buildPrompt1A, buildPrompt1B, buildPrompt1C, buildPrompt1D, buildPrompt1E, buildPrompt1F } from '../src/services/caseGenerator.js';
import { evaluateVerdict } from '../src/services/verdictEvaluator.js';

console.log('=== INICIANDO SUITE DE VALIDACIÓN VEREDIKT v4 ===\n');

// 1. Providers verification
console.log('1. Verificando 10 proveedores de IA...');
const expectedProviders = [
  'groq', 'openai', 'anthropic', 'gemini', 'deepseek', 
  'nvidia', 'openrouter', 'github', 'mistral', 'cohere'
];
for (const p of expectedProviders) {
  if (!API_PROVIDERS[p]) throw new Error(`Falta proveedor: ${p}`);
  if (!API_PROVIDERS[p].models || API_PROVIDERS[p].models.length === 0) {
    throw new Error(`Proveedor ${p} no tiene modelos definidos.`);
  }
}
if (PROVIDER_COMPARISON_DATA.length !== 10) {
  throw new Error(`La tabla comparativa debe tener 10 proveedores. Encontrados: ${PROVIDER_COMPARISON_DATA.length}`);
}
console.log('✓ 10 proveedores y tabla comparativa verificados correctamente.');

// 2. Cities verification
console.log('\n2. Verificando ciudades...');
if (!CIUDADES_FAMOSAS[0].includes('Aleatoria')) {
  throw new Error('La primera opción de ciudades DEBE ser Aleatoria');
}
console.log(`✓ ${CIUDADES_FAMOSAS.length} ciudades cargadas con "🎲 Aleatoria" al inicio.`);

// 3. Truth obfuscation test
console.log('\n3. Verificando ofuscación de la verdad...');
const testTruth = DEMO_CASE.truth;
const obfuscated = obfuscateTruth(testTruth);
const deobfuscated = deobfuscateTruth(obfuscated);
if (deobfuscated.culpable !== testTruth.culpable || deobfuscated.arma !== testTruth.arma) {
  throw new Error('Fallo en la prueba de ofuscación/desofuscación de la verdad');
}
console.log('✓ Ofuscación y desofuscación seguras verificadas.');

// 4. JSON parser tests
console.log('\n4. Verificando parseLLMJson...');
const markdownJson = '```json\n{"titulo": "Crimen en París", "culpable": "s2"}\n```';
const parsed1 = parseLLMJson(markdownJson);
if (parsed1.titulo !== 'Crimen en París') throw new Error('parseLLMJson falló con bloques markdown');

const surroundedJson = 'Acá está el resultado:\n{"titulo": "Misterio", "culpable": "s1"}\nEspero te sirva.';
const parsed2 = parseLLMJson(surroundedJson);
if (parsed2.titulo !== 'Misterio') throw new Error('parseLLMJson falló con texto circundante');
console.log('✓ Limpieza y extracción quirúrgica de JSON verificadas.');

// 5. Prompts generation tests
console.log('\n5. Verificando 6 prompts quirúrgicos...');
const p1A = buildPrompt1A('Londres, 1920', 'Difícil');
const p1B = buildPrompt1B({ titulo: 'T', epoca: '1920', tipo_crimen: 'H', victima: { nombre: 'V', descripcion: 'D' }, descripcionEscena: 'E' }, 'Difícil');
const p1C = buildPrompt1C({ titulo: 'T', epoca: '1920', tipo_crimen: 'H', descripcionEscena: 'E' }, [{ id: 's1', nombre: 'N1' }, { id: 's2', nombre: 'N2' }], 's2', 'Difícil');
const p1D = buildPrompt1D({ tipo_crimen: 'H', epoca: '1920', victima: { nombre: 'V' } }, [{ id: 's1', nombre: 'N1', perfil: 'P', coartada: 'C' }], 's1');
const p1E = buildPrompt1E({ tipo_crimen: 'H', epoca: '1920' }, [{ id: 's1', nombre: 'N1' }], 's1', [{ id: 'e1', objeto: 'O1', ubicacion: 'U' }], 'e1', 'Difícil');
const p1F = buildPrompt1F({ titulo: 'T', epoca: 'E', victima: { nombre: 'V' } }, [{ id: 's1', nombre: 'N1' }], 's1', [{ id: 'e1', objeto: 'O1' }], 'e1');

if (!p1A || !p1B || !p1C || !p1D || !p1E || !p1F) {
  throw new Error('Falla en la generación de prompts');
}
console.log('✓ Los 6 prompts quirúrgicos fueron construidos exitosamente.');

// 6. Verdict Evaluation deterministic fallback
console.log('\n6. Verificando evaluador de veredicto (fallback local)...');
const verdictRes = await evaluateVerdict({
  truth: DEMO_CASE.truth,
  suspects: DEMO_CASE.publicInfo.sospechosos,
  evidences: DEMO_CASE.publicInfo.evidencias,
  acusadoId: 's2', // Correct culpable in DEMO_CASE
  armaId: 'e1',    // Correct weapon in DEMO_CASE
  motivo: 'Marcus Thorne descubrió que Pendelton iba a entregar los libros contables secretos con sus fraudes fiscales a los inspectores.',
  reconstruccion: 'Thorne acudió a la relojería a la 01:30 AM con un cigarrillo importado y exigió los libros. Al negarse Pendelton, lo golpeó con la manivela de bronce y lo sumergió en la tina de ácido para arrancarle la clave.',
  apiConfig: null,
  isOffline: true
});

if (verdictRes.puntajeTotal < 70) {
  throw new Error(`Puntaje obtenido (${verdictRes.puntajeTotal}) menor al esperado para deducción acertada.`);
}
if (!verdictRes.desglose.culpable.acerto || !verdictRes.desglose.arma.acerto) {
  throw new Error('Fallo en el desglose de aciertos del veredicto.');
}
console.log(`✓ Evaluación judicial completada con éxito: ${verdictRes.puntajeTotal}/100 pts. Sentencia: "${verdictRes.condena}"`);

console.log('\n=============================================');
console.log('🎉 TODOS LOS TESTS DE INTEGRACIÓN PASARON AL 100%');
console.log('=============================================');
