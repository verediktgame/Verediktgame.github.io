# 🕵️ CASO POLICIAL — Spec técnica para el agente de código

## Resumen general

Juego web de resolución de casos policiales impulsado por IA. El usuario aporta su propia API key (OpenAI, Anthropic, Gemini, Deepseek u otra compatible con el formato `/v1/messages` o `/v1/chat/completions`). No se recolecta ni transmite ningún dato fuera del navegador del usuario. Todo el estado del juego vive en `localStorage`.

---

## Stack

- HTML + CSS + JS vanilla en un único archivo `.html` autocontenido
- Sin frameworks, sin dependencias externas (salvo Tabler Icons desde CDN si se usan íconos)
- Compatible con el entorno de publicación de Artifacts de Claude (sin `localStorage` en preview, usar variables en memoria como fallback)

---

## Flujo del juego — exactamente 2 llamadas a la IA

### LLAMADA 1 — Generación del caso (al presionar "Iniciar")

Se construye el prompt con los parámetros del usuario (o todo aleatorio) y se pide a la IA que devuelva **un único JSON** con esta estructura exacta:

```json
{
  "publicInfo": {
    "titulo": "string",
    "lugar": "string",
    "fecha": "string",
    "victima": {
      "nombre": "string",
      "descripcion": "string"
    },
    "informeGeneral": "string — narración del crimen como fue reportado oficialmente",
    "descripcionEscena": "string — descripción textual detallada del lugar del crimen",
    "sospechosos": [
      {
        "id": "string",
        "nombre": "string",
        "perfil": "string",
        "coartada": "string",
        "preguntas": [
          { "id": "p1", "pregunta": "string", "respuesta": "string" },
          { "id": "p2", "pregunta": "string", "respuesta": "string" },
          { "id": "p3", "pregunta": "string", "respuesta": "string" },
          { "id": "p4", "pregunta": "string", "respuesta": "string" },
          { "id": "p5", "pregunta": "string", "respuesta": "string" }
        ]
      }
    ],
    "evidencias": [
      {
        "id": "string",
        "objeto": "string",
        "descripcion": "string",
        "ubicacion": "string",
        "analisisForense": "string — resultado del laboratorio forense"
      }
    ],
    "declaraciones": [
      {
        "testigo": "string",
        "relacion": "string",
        "texto": "string"
      }
    ]
  },
  "truth": {
    "culpable": "string — id del sospechoso culpable",
    "movil": "string",
    "arma": "string — id de la evidencia usada como arma",
    "secuenciaReal": "string — narración completa de cómo ocurrió el crimen realmente",
    "pistasClave": ["string", "string"],
    "rubrica": {
      "acerto_culpable": 40,
      "acerto_movil": 20,
      "acerto_arma": 20,
      "calidad_reconstruccion_max": 20
    },
    "condenas": {
      "80_100": "Cadena perpetua. El acusado fue condenado sin posibilidad de apelación.",
      "50_79": "Condena de 15 años. El jurado encontró pruebas suficientes, pero con dudas.",
      "20_49": "Condena mínima de 3 años por encubrimiento. Salió casi sin consecuencias.",
      "0_19": "Veredicto: inocente. El verdadero culpable quedó libre por falta de pruebas."
    }
  }
}
```

**Guardar:** `localStorage.setItem('caso_publicInfo', JSON.stringify(data.publicInfo))` y `localStorage.setItem('caso_truth', JSON.stringify(data.truth))`.

El `truth` **nunca se muestra** hasta que el jugador envía su acusación final.

---

### LLAMADA 2 — Evaluación del veredicto (al presionar "Enviar acusación")

Se construye un prompt con:
- La deducción del jugador (culpable elegido, arma, motivo, reconstrucción escrita)
- El objeto `truth` completo recuperado de `localStorage`

La IA devuelve:

```json
{
  "puntaje": 0,
  "desglose": {
    "culpable": { "acerto": true, "puntos": 40 },
    "movil": { "acerto": false, "puntos": 0 },
    "arma": { "acerto": true, "puntos": 20 },
    "reconstruccion": { "puntos": 12, "comentario": "string" }
  },
  "puntajeTotal": 72,
  "condena": "string — texto de la condena según el rango de puntaje",
  "narrativaCondena": "string — párrafo dramatizado de cómo quedó el caso judicialmente"
}
```

---

## Pantallas del juego

### 1. Menú principal
- Título del juego, estética oscura tipo noir
- Botón **Configuración** (ícono engranaje): abre un modal/panel con:
  - Campo: API Key (tipo password, solo se guarda en `localStorage`, nunca se loguea)
  - Select: Proveedor (OpenAI, Anthropic, Gemini, Deepseek, Custom)
  - Campo: URL del endpoint (se autocompleta según proveedor, editable para Custom)
  - Campo: Nombre del modelo (ej: `gpt-4o`, `claude-sonnet-4-6`, etc.)
  - Botón **Probar conexión**: hace una llamada mínima a la API y muestra ✓ o error
- Botón **Nuevo caso**: lleva a la pantalla de configuración del caso

### 2. Configuración del caso
- Opción: **Aleatorio** (toggle) — si está activo, todos los campos se deshabilitan
- Si no es aleatorio, mostrar:
  - Select: Lugar/Ambientación (ciudad moderna, pueblo rural, época histórica, etc.)
  - Select: Tipo de caso (homicidio, desaparición, robo con violencia, fraude)
  - Select: Dificultad (Fácil, Normal, Difícil)
  - Select: Idioma del caso (Español, English, Português)
- Botón **Generar caso** → dispara Llamada 1 con spinner de carga

### 3. Pantalla de investigación (tabs)

**Tab: Informe General**
- Título del caso, víctima, lugar, fecha
- Texto del informe oficial

**Tab: Declaraciones**
- Lista de testigos con su relación al caso y su declaración completa

**Tab: Sospechosos**
- Card por sospechoso: nombre, perfil, coartada
- Botón **Interrogar**: abre modal con las 5 preguntas
  - El jugador puede **seleccionar exactamente 3** preguntas antes de revelar
  - Al confirmar: se muestran las 3 respuestas, las otras 2 quedan ocultas con `?`
  - Una vez interrogado, no se puede repetir

**Tab: Escena del Crimen**
- Descripción textual detallada del lugar

**Tab: Evidencias**
- Lista de objetos con descripción y ubicación
- Botón **Solicitar análisis forense** (máximo 2 por partida)
  - Al hacer click: revela el campo `analisisForense` de esa evidencia (ya estaba en el JSON, no hace llamada nueva)
  - Contador visible: "Análisis disponibles: 2 / 2"

**Tab: Acusación (siempre visible)**
- Formulario:
  - Select: Sospechoso acusado (lista de los del caso)
  - Select: Arma/método utilizado (lista de evidencias)
  - Textarea: Motivo (texto libre)
  - Textarea: Reconstrucción — "Contá cómo creés que ocurrió el crimen"
- Botón **Enviar acusación** → dispara Llamada 2

### 4. Pantalla de resultado (3 pasos con botón "Siguiente")

**Paso 1 — Tu puntaje**
- Número grande: `XX / 100`
- Desglose: culpable ✓/✗ (+40), arma ✓/✗ (+20), motivo ✓/✗ (+20), reconstrucción (+X/20)
- Comentario sobre la calidad de la reconstrucción

**Paso 2 — Cómo ocurrió realmente**
- Narración completa del caso verdadero (`secuenciaReal`)
- Destacar las pistas clave que el jugador debió haber notado

**Paso 3 — La condena**
- Texto dramático del veredicto judicial
- Depende del puntaje: si fue bajo, el asesino puede salir libre
- Narración dramatizada del final del caso
- Botón **Jugar de nuevo** → vuelve al Menú

---

## Prompts base para la IA

### Prompt Llamada 1 — Generación del caso

```
Sos el autor de un juego de misterio policial. Tu tarea es generar un caso policial completo y coherente.

PARÁMETROS:
- Lugar/Ambientación: {lugar}
- Tipo de caso: {tipoCaso}
- Dificultad: {dificultad}
- Idioma: {idioma}

INSTRUCCIONES:
- El caso debe ser internamente consistente. Las pistas deben apuntar al culpable verdadero, pero no de forma obvia.
- En dificultad Fácil: las pistas son directas y el culpable tiene una coartada débil.
- En dificultad Normal: hay pistas contradictorias y más de un sospechoso creíble.
- En dificultad Difícil: las pistas son ambiguas, hay red herrings, y el culpable tiene una coartada sólida.
- Genera entre 3 y 4 sospechosos.
- Genera entre 4 y 6 evidencias.
- Las 5 preguntas de cada sospechoso deben mezclar: preguntas que ayudan a resolver el caso, preguntas que revelan el carácter del sospechoso, y al menos una red herring por sospechoso inocente.
- El campo `analisisForense` de cada evidencia debe contener un resultado de laboratorio detallado y realista.

Devolvé ÚNICAMENTE el JSON con la estructura exacta indicada. Sin explicaciones, sin texto fuera del JSON, sin bloques de código markdown.

ESTRUCTURA JSON REQUERIDA:
{insertar estructura del JSON aquí}
```

### Prompt Llamada 2 — Evaluación del veredicto

```
Sos el juez evaluador de un juego de misterio policial.

SOLUCIÓN REAL DEL CASO:
{truth JSON completo}

DEDUCCIÓN DEL JUGADOR:
- Acusado: {nombreSospechoso}
- Arma/método: {evidenciaElegida}
- Motivo propuesto: {motivoTexto}
- Reconstrucción: {reconstruccionTexto}

INSTRUCCIONES:
- Evaluá si el jugador acertó el culpable, el arma y el motivo comparando con la solución real.
- Para la calidad de la reconstrucción (0 a 20 puntos): evaluá coherencia lógica, uso de las pistas disponibles y si la narrativa se aproxima a la secuencia real aunque no sea perfecta.
- Escribí la narrativaCondena como un párrafo dramatizado estilo periodístico/judicial que cuente cómo terminó el caso según el puntaje obtenido.
- Usá el texto de condena del rango correspondiente al puntajeTotal.

Devolvé ÚNICAMENTE el JSON de resultado. Sin texto adicional.
```

---

## Notas adicionales para el agente

- El botón de **Probar conexión** debe hacer un request mínimo (1 token de respuesta, prompt "di OK") y mostrar latencia + modelo respondido.
- Los proveedores tienen endpoints distintos:
  - OpenAI / Deepseek / Compatible: `POST /v1/chat/completions` con `{ model, messages, max_tokens }`
  - Anthropic: `POST /v1/messages` con `{ model, messages, max_tokens }` + header `anthropic-version: 2023-06-01`
  - Gemini: `POST /v1beta/models/{model}:generateContent` con estructura propia
- La API key se guarda en `localStorage` bajo la clave `caso_apiConfig`.
- Si `localStorage` no está disponible (preview de Artifact), usar variables en memoria (el juego funciona igual pero no persiste entre sesiones).
- El JSON de la Llamada 1 puede ser grande. Configurar `max_tokens` en al menos 4000.
- Parsear el JSON con `JSON.parse()` dentro de try/catch. Si falla, mostrar error amigable y opción de reintentar.
- La estética visual del juego debe ser **noir/policial**: fondo oscuro, tipografía clara, acentos en rojo o ámbar.
