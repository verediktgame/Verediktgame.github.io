# VEREDIKT — Mejoras v3 para Antigravity

Implementar sobre el `index.html` existente. No romper nada de lo que ya funciona.

---

## MEJORA 1 — Dividir la generación del caso en 4 llamadas pequeñas

### Por qué
Las llamadas anteriores (1A y 1B) siguen siendo demasiado grandes en dificultad alta y truncan el JSON. La solución definitiva es 4 llamadas chicas y enfocadas. Cada una recibe solo el contexto que necesita.

### Barra de progreso
Mostrar una barra de 4 pasos mientras se genera. Reemplazar el spinner actual por esto:

```html
<div class="generation-progress">
  <div class="progress-bar-track">
    <div class="progress-bar-fill" id="progressBarFill" style="width: 0%"></div>
  </div>
  <div class="progress-steps">
    <div class="progress-step" id="pStep1">① Construyendo el sumario...</div>
    <div class="progress-step" id="pStep2">② Preparando interrogatorios...</div>
    <div class="progress-step" id="pStep3">③ Procesando análisis forenses...</div>
    <div class="progress-step" id="pStep4">④ Sellando la verdad del caso...</div>
  </div>
</div>
```

Actualizar el paso activo y el porcentaje de la barra antes de cada llamada:
- Antes de 1A → 0% activo paso 1
- Antes de 1B → 25% activo paso 2
- Antes de 1C → 50% activo paso 3
- Antes de 1D → 75% activo paso 4
- Al terminar → 100%, ocultar barra, mostrar caso

---

### LLAMADA 1A — Estructura base del caso

`max_tokens`: 2000

**Prompt:**
```
Sos el autor de un juego de misterio policial. Generá la estructura base de un caso criminal coherente e interesante.

PARÁMETROS:
- Ciudad/Lugar: {ciudad}
- Dificultad: {dificultad}

REGLAS DE DIFICULTAD:
- Fácil: el culpable tiene coartada débil, las pistas son directas
- Normal: hay pistas contradictorias, más de un sospechoso creíble
- Difícil: hay red herrings, el culpable tiene coartada sólida, las pistas son ambiguas

REGLAS DE CONTENIDO:
- Exactamente 3 sospechosos en Fácil, 4 en Normal, 4 en Difícil
- Exactamente 4 evidencias en Fácil, 5 en Normal o Difícil
- Exactamente 2 testigos con sus declaraciones
- Cada campo de texto: máximo 2 oraciones
- El tipo de crimen, época y atmósfera los decides vos según la ciudad

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "titulo": "string",
  "ciudad": "string",
  "fecha": "string",
  "tipo_crimen": "string",
  "victima": {
    "nombre": "string",
    "descripcion": "string"
  },
  "informeGeneral": "string",
  "descripcionEscena": "string",
  "sospechosos": [
    {
      "id": "s1",
      "nombre": "string",
      "perfil": "string",
      "coartada": "string"
    }
  ],
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
  ],
  "truth_preview": {
    "culpable_id": "s1",
    "arma_id": "e1",
    "movil_una_linea": "string"
  }
}
```

---

### LLAMADA 1B — Interrogatorios (5 preguntas por sospechoso)

Recibe: el JSON completo de 1A.

`max_tokens`: 2500

**Prompt:**
```
Sos el autor de un juego de misterio policial. Ya existe la estructura base del caso. Generá exactamente 5 preguntas con sus respuestas para cada sospechoso.

CASO BASE:
{JSON_1A}

REGLAS:
- 5 preguntas por cada sospechoso, sin excepción
- Las preguntas deben ser coherentes con el perfil y la coartada de cada uno
- Para sospechosos inocentes: al menos 1 pregunta es un red herring que puede confundir al jugador
- Para el culpable (id: {truth_preview.culpable_id}): al menos 1 pregunta tiene una respuesta que delata algo si se presta atención
- Cada respuesta: máximo 2 oraciones
- Mantener coherencia total con los hechos del caso base

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

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
}
```

---

### LLAMADA 1C — Análisis forenses

Recibe: solo el array de evidencias de 1A.

`max_tokens`: 1000

**Prompt:**
```
Sos el jefe del laboratorio forense de un juego de misterio policial. Generá el informe de laboratorio para cada evidencia.

EVIDENCIAS DEL CASO:
{JSON_EVIDENCIAS_DE_1A}

CONTEXTO DEL CASO (para coherencia):
- Culpable: sospechoso con id {truth_preview.culpable_id}
- Arma principal: evidencia con id {truth_preview.arma_id}
- Crimen: {tipo_crimen} en {ciudad}

REGLAS:
- El análisis del arma principal debe contener pruebas concretas que apunten al culpable (huellas, ADN, material)
- Los análisis de otras evidencias pueden ser neutros, ambiguos o señalar a sospechosos inocentes según la dificultad
- Cada análisis: máximo 3 oraciones, tono técnico/forense
- Dificultad: {dificultad}

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "forense": {
    "e1": "string — resultado del laboratorio",
    "e2": "string — resultado del laboratorio"
  }
}
```

---

### LLAMADA 1D — Truth sellada

Recibe: resumen de 1A + 1B + 1C.

`max_tokens`: 1200

**Prompt:**
```
Sos el autor de un juego de misterio policial. Con toda la información del caso, generá la verdad sellada y el sistema de condenas.

RESUMEN DEL CASO:
- Título: {titulo}
- Ciudad: {ciudad}
- Víctima: {victima.nombre}
- Sospechosos: {lista de nombre e id}
- Evidencias: {lista de objeto e id}
- Culpable definido: {truth_preview.culpable_id} ({nombre del culpable})
- Arma definida: {truth_preview.arma_id} ({nombre del arma})
- Móvil base: {truth_preview.movil_una_linea}

REGLAS:
- La secuenciaReal debe ser una narración dramática y detallada de cómo ocurrió el crimen, coherente con TODO lo establecido en el caso
- Las pistasClave deben ser exactamente 3, referenciando elementos concretos del caso (evidencias, declaraciones, respuestas de interrogatorio) que el jugador debió haber notado
- Las condenas deben variar dramáticamente: de 80-100 debe ser condenatorio y definitivo, de 0-19 el culpable queda libre
- Máximo 4 oraciones para secuenciaReal
- Máximo 2 oraciones por condena

Devolvé ÚNICAMENTE este JSON sin texto extra ni markdown:

{
  "truth": {
    "culpable": "s1",
    "movil": "string",
    "arma": "e1",
    "secuenciaReal": "string",
    "pistasClave": ["string", "string", "string"],
    "rubrica": {
      "acerto_culpable": 40,
      "acerto_movil": 20,
      "acerto_arma": 20,
      "calidad_reconstruccion_max": 20
    },
    "condenas": {
      "80_100": "string — cadena perpetua, sin apelación posible",
      "50_79": "string — condena parcial, la defensa logró reducir la pena",
      "20_49": "string — condena mínima, casi sin consecuencias reales",
      "0_19": "string — absolución, el culpable queda libre por falta de pruebas"
    }
  }
}
```

---

### Merge final en JS

```javascript
async function generateCase(ciudad, dificultad) {
  try {
    // PASO 1
    setProgress(0, 1);
    const resp1A = await makeLLMRequest(buildPrompt1A(ciudad, dificultad), 2000);
    const base = parseLLMJson(resp1A.text);

    // PASO 2
    setProgress(25, 2);
    const resp1B = await makeLLMRequest(buildPrompt1B(base), 2500);
    const interrogatorios = parseLLMJson(resp1B.text);

    // PASO 3
    setProgress(50, 3);
    const resp1C = await makeLLMRequest(buildPrompt1C(base), 1000);
    const forense = parseLLMJson(resp1C.text);

    // PASO 4
    setProgress(75, 4);
    const resp1D = await makeLLMRequest(buildPrompt1D(base), 1200);
    const truthData = parseLLMJson(resp1D.text);

    // MERGE publicInfo
    const publicInfo = {
      ...base,
      sospechosos: base.sospechosos.map(s => ({
        ...s,
        preguntas: interrogatorios.preguntas[s.id] || []
      })),
      evidencias: base.evidencias.map(e => ({
        ...e,
        analisisForense: forense.forense[e.id] || "Sin datos forenses disponibles."
      }))
    };

    setProgress(100, null);

    // Guardar en AppState y localStorage
    AppState.currentPublicInfo = publicInfo;
    AppState.currentTruth = truthData.truth;
    AppState.forensicsUsed = 0;
    AppState.interrogationsState = {};

    localStorage.setItem('caso_publicInfo', JSON.stringify(publicInfo));
    localStorage.setItem('caso_truth', btoa(JSON.stringify(truthData.truth)));

    renderInvestigationScreen(publicInfo);
    showScreen('screenInvestigation');

  } catch (err) {
    // Error claro con paso donde falló
    showGenerationError(err.message);
  }
}
```

Si cualquier llamada falla o devuelve JSON truncado, mostrar el error indicando en qué paso falló (ej: "Error en paso 2 — Interrogatorios") con botón de reintentar que retoma desde el inicio.

---

## MEJORA 2 — Exportar caso solo desde la pantalla de veredicto

### Mover el botón de exportar

**Quitar** el botón de exportar del tab de Informe General.

**Agregar** el botón de exportar únicamente en el **Paso 3 de la pantalla de veredicto** (la pantalla de Sentencia Judicial), junto al botón "Investigar un Nuevo Caso":

```html
<!-- En el Paso 3 del veredicto, nav inferior -->
<div class="verdict-step-nav">
  <button class="btn-wood" id="btnBackStep2">⬅ Volver a los Hechos</button>
  <div style="display: flex; gap: 10px;">
    <button class="btn-wood secondary" id="btnExportCase" onclick="exportCase()">
      ↓ Exportar Caso (.json)
    </button>
    <button class="btn-wood primary" id="btnPlayAgain">
      ⎌ Investigar un Nuevo Caso
    </button>
  </div>
</div>
```

Así el jugador solo puede exportar después de haber leído el veredicto completo y la verdad del caso. Nunca antes.

El botón de importar en el menú principal se mantiene igual — importar un caso ajeno no es spoiler.

---

## MEJORA 3 — Simplificar pantalla de configuración del caso

### Eliminar completamente

- El toggle "Generar ambientación aleatoria (Recomendado)"
- El campo "Tipo de caso"
- El campo "Idioma del caso"
- Cualquier otro campo que no sea Ciudad y Dificultad

### Lo que queda

Solo dos campos:

**Campo 1 — Ciudad / Ambientación**

Input de texto con dropdown de sugerencias. Las sugerencias hardcodeadas incluyen una opción "Aleatoria" al inicio de la lista:

```javascript
const CIUDADES_FAMOSAS = [
  "🎲 Aleatoria — La IA elige la ciudad y la época",  // SIEMPRE PRIMERA
  "Buenos Aires, Argentina",
  "Ciudad de México, México",
  "Madrid, España",
  "Barcelona, España",
  "Nueva York, Estados Unidos",
  "Londres, Reino Unido",
  "París, Francia",
  "Tokio, Japón",
  "São Paulo, Brasil",
  "Berlín, Alemania",
  "Roma, Italia",
  "Chicago, Estados Unidos",
  "Los Ángeles, Estados Unidos",
  "Moscú, Rusia",
  "Estambul, Turquía",
  "Shanghai, China",
  "Bogotá, Colombia",
  "Lima, Perú",
  "Santiago, Chile",
  "Montevideo, Uruguay",
  "La Habana, Cuba",
  "Lisboa, Portugal",
  "Ámsterdam, Países Bajos",
  "Viena, Austria",
  "Praga, República Checa",
  "El Cairo, Egipto",
  "Lagos, Nigeria",
  "Mumbai, India",
  "Sydney, Australia",
  "Toronto, Canadá"
];
```

Cuando el jugador elige "🎲 Aleatoria", el campo muestra ese texto y en el prompt de 1A se envía:

```
- Ciudad/Lugar: [ELIGE VOS — ciudad y época completamente libres, cualquier lugar del mundo en cualquier período histórico]
```

Si el jugador escribe texto libre (no está en la lista), se envía tal cual y la IA lo interpreta.

La búsqueda dinámica con Nominatim se activa solo si el texto tiene 3+ caracteres y no coincide con ninguna ciudad hardcodeada. Si Nominatim falla, el input sigue funcionando con las ciudades de la lista.

**Campo 2 — Dificultad**

```html
<select id="selectDificultad" class="form-control">
  <option value="Fácil">Fácil — Pistas directas, culpable evidente</option>
  <option value="Normal" selected>Normal — Pistas mixtas, varios sospechosos creíbles</option>
  <option value="Difícil">Difícil — Red herrings, culpable con coartada sólida</option>
</select>
```

### Texto introductorio del formulario

Reemplazar cualquier texto descriptivo actual por:

> "Elegí una ciudad o dejá que la IA sorprenda. El tipo de crimen, la época y la atmósfera los decide el expediente."

---

## Notas generales

- No tocar la lógica de interrogatorios, análisis forense, veredicto ni la pantalla de resultado.
- El caso demo offline (hardcodeado) se mantiene igual como fallback.
- La función `parseLLMJson()` debe seguir limpiando bloques markdown antes de parsear.
- Si el jugador importa un caso, saltear las 4 llamadas y cargar directo.
- Mantener la estética visual noir en todos los elementos nuevos.
