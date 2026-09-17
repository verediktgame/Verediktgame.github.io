# VEREDIKT — Mejoras v2 para Antigravity

Hay tres mejoras a implementar sobre el `index.html` existente. No romper nada de lo que ya funciona.

---

## MEJORA 1 — Dividir la generación del caso en dos llamadas (1A + 1B)

### Problema actual
La Llamada 1 genera un JSON gigante (~6000-8000 tokens) que frecuentemente se trunca, rompiendo el `JSON.parse()`.

### Solución: dividir en Llamada 1A y Llamada 1B en secuencia

**Llamada 1A — Estructura base del caso**

Genera solamente la arquitectura narrativa. Prompt:

```
Sos el autor de un juego de misterio policial. Generá la estructura base de un caso criminal.

PARÁMETROS:
- Lugar/Ambientación: {lugar}
- Tipo de caso: {tipoCaso}  
- Dificultad: {dificultad}
- Idioma: {idioma}

Devolvé ÚNICAMENTE este JSON, sin texto extra, sin markdown:

{
  "titulo": "string",
  "lugar": "string",
  "fecha": "string",
  "victima": {
    "nombre": "string",
    "descripcion": "string (2 oraciones max)"
  },
  "informeGeneral": "string (3 oraciones max — resumen oficial del crimen)",
  "descripcionEscena": "string (3 oraciones max — descripción del lugar)",
  "sospechosos": [
    {
      "id": "s1",
      "nombre": "string",
      "perfil": "string (2 oraciones max)",
      "coartada": "string (1 oración max)"
    }
  ],
  "evidencias": [
    {
      "id": "e1",
      "objeto": "string",
      "descripcion": "string (1 oración max)",
      "ubicacion": "string (1 oración max)"
    }
  ],
  "declaraciones": [
    {
      "testigo": "string",
      "relacion": "string",
      "texto": "string (2 oraciones max)"
    }
  ],
  "truth_preview": {
    "culpable_id": "s1",
    "movil_resumen": "string (1 oración — solo para uso interno en llamada 1B)",
    "arma_id": "e1"
  }
}

Reglas:
- Exactamente 3 o 4 sospechosos
- Exactamente 4 o 5 evidencias  
- Exactamente 2 declaraciones de testigos
- Dificultad Fácil: culpable con coartada débil, pistas directas
- Dificultad Normal: pistas mixtas, más de un sospechoso creíble
- Dificultad Difícil: red herrings, culpable con coartada sólida
```

`max_tokens`: 3000

---

**Llamada 1B — Detalles, preguntas y truth sellada**

Recibe el JSON de 1A como contexto. Prompt:

```
Sos el autor de un juego de misterio policial. Ya existe la estructura base del caso. Tu trabajo es completarla con los detalles de interrogatorio, análisis forenses y la verdad sellada.

CASO BASE (no modificar nombres ni hechos):
{JSON_DE_1A}

Devolvé ÚNICAMENTE este JSON, sin texto extra, sin markdown:

{
  "preguntas_por_sospechoso": {
    "s1": [
      { "id": "p1", "pregunta": "string", "respuesta": "string (2 oraciones max)" },
      { "id": "p2", "pregunta": "string", "respuesta": "string (2 oraciones max)" },
      { "id": "p3", "pregunta": "string", "respuesta": "string (2 oraciones max)" },
      { "id": "p4", "pregunta": "string", "respuesta": "string (2 oraciones max)" },
      { "id": "p5", "pregunta": "string", "respuesta": "string (2 oraciones max)" }
    ]
  },
  "analisis_forense_por_evidencia": {
    "e1": "string — resultado de laboratorio (2 oraciones max)"
  },
  "truth": {
    "culpable": "s1",
    "movil": "string (2 oraciones max)",
    "arma": "e1",
    "secuenciaReal": "string (4 oraciones max — cómo ocurrió realmente)",
    "pistasClave": ["string", "string", "string"],
    "rubrica": {
      "acerto_culpable": 40,
      "acerto_movil": 20,
      "acerto_arma": 20,
      "calidad_reconstruccion_max": 20
    },
    "condenas": {
      "80_100": "string",
      "50_79": "string",
      "20_49": "string",
      "0_19": "string"
    }
  }
}

Reglas:
- Generar exactamente 5 preguntas para CADA sospechoso del caso base
- Las preguntas deben ser coherentes con el perfil y la coartada de cada sospechoso
- Al menos 1 pregunta por sospechoso inocente debe ser un red herring
- La truth debe ser consistente con truth_preview del caso base
- Los IDs de culpable y arma deben coincidir exactamente con los del caso base
```

`max_tokens`: 3500

---

**Merge en el cliente (JS)**

Después de recibir ambas respuestas, combinarlas antes de guardar en `AppState`:

```javascript
async function generateCase(params) {
  // LLAMADA 1A
  showLoadingMessage("Construyendo el sumario del caso...");
  const resp1A = await makeLLMRequest(buildPrompt1A(params), 3000);
  const caseBase = parseLLMJson(resp1A.text);

  // LLAMADA 1B
  showLoadingMessage("Elaborando perfiles e interrogatorios...");
  const resp1B = await makeLLMRequest(buildPrompt1B(caseBase), 3500);
  const caseDetails = parseLLMJson(resp1B.text);

  // MERGE
  const fullPublicInfo = {
    ...caseBase,
    sospechosos: caseBase.sospechosos.map(s => ({
      ...s,
      preguntas: caseDetails.preguntas_por_sospechoso[s.id] || []
    })),
    evidencias: caseBase.evidencias.map(e => ({
      ...e,
      analisisForense: caseDetails.analisis_forense_por_evidencia[e.id] || "Sin datos forenses."
    }))
  };

  // Guardar separados (truth encriptado)
  AppState.currentPublicInfo = fullPublicInfo;
  AppState.currentTruth = caseDetails.truth;
  
  // Guardar en localStorage
  localStorage.setItem('caso_publicInfo', JSON.stringify(fullPublicInfo));
  localStorage.setItem('caso_truth', btoa(JSON.stringify(caseDetails.truth)));
}
```

El loading debe mostrar dos mensajes distintos mientras avanza cada llamada, para que el usuario vea progreso.

---

## MEJORA 2 — Importar y Exportar casos en JSON

### Exportar

Agregar un botón **"Exportar Caso"** visible en la pantalla de investigación (tab Informe General, esquina superior derecha). Solo disponible cuando hay un caso activo.

```javascript
function exportCase() {
  const pub = AppState.currentPublicInfo;
  const tru = AppState.currentTruth;

  if (!pub || !tru) return;

  const exportData = {
    veredikt_version: "1.0",
    exported_at: new Date().toISOString(),
    publicInfo: pub,
    truth: tru  // Se exporta en claro — es el archivo del autor del caso
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Nombre de archivo limpio basado en el título del caso
  const safeName = (pub.titulo || 'caso').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40);
  a.download = `veredikt-${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Importar

Agregar un botón **"Importar Caso"** en el menú principal, junto al botón de "Nuevo caso". Al hacer click abre un `<input type="file" accept=".json">` nativo.

```javascript
function importCase(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Validación mínima
      if (!data.publicInfo || !data.truth) {
        throw new Error("El archivo no es un caso de VEREDIKT válido.");
      }
      if (!data.publicInfo.sospechosos || !data.publicInfo.evidencias) {
        throw new Error("El caso está incompleto o corrupto.");
      }

      // Cargar en AppState
      AppState.currentPublicInfo = data.publicInfo;
      AppState.currentTruth = data.truth;
      AppState.forensicsUsed = 0;
      AppState.interrogationsState = {};

      // Guardar en localStorage
      localStorage.setItem('caso_publicInfo', JSON.stringify(data.publicInfo));
      localStorage.setItem('caso_truth', btoa(JSON.stringify(data.truth)));

      // Ir directo a la pantalla de investigación
      renderInvestigationScreen(data.publicInfo);
      showScreen('screenInvestigation');

    } catch (err) {
      alert(`Error al importar: ${err.message}`);
    }
  };
  reader.readAsText(file);
}
```

El botón de importar en el menú debe tener un estilo secundario (no rojo) para no competir visualmente con "Nuevo caso".

---

## MEJORA 3 — Pantalla de configuración del caso simplificada

### Quitar todo lo hardcodeado innecesario

Dejar solo dos campos en el formulario de configuración:
1. **Lugar / Ambientación** — con buscador (ver abajo)
2. **Dificultad** — select con 3 opciones

Quitar los campos: Tipo de caso, Idioma del caso. El tipo de caso lo decide la IA libremente. El idioma siempre será el del lugar elegido (si es una ciudad hispanohablante → español, si es Londres → inglés), o español por defecto si no se puede inferir.

El prompt de 1A debe recibir solo: `{lugar}` y `{dificultad}`.

### Buscador de ciudades — input con sugerencias mixtas

Implementar como un campo `<input type="text">` con un `<datalist>` que combine:
- Sugerencias hardcodeadas de ciudades famosas (ver lista abajo)
- Búsqueda dinámica contra la API de Nominatim (OpenStreetMap) si el usuario escribe 3+ caracteres

```javascript
// Lista hardcodeada de ciudades famosas (mostrar siempre como sugerencias iniciales)
const CIUDADES_FAMOSAS = [
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

// Búsqueda dinámica con Nominatim
async function searchCities(query) {
  if (query.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&featuretype=city&limit=6&format=json&accept-language=es`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'es' }
    });
    const data = await res.json();
    return data.map(r => r.display_name.split(',').slice(0, 2).join(',').trim());
  } catch {
    return []; // Silencioso — fallback a hardcodeadas
  }
}

// Lógica del input
const cityInput = document.getElementById('inputCiudad');
const cityDropdown = document.getElementById('cityDropdown'); // div personalizado

cityInput.addEventListener('input', async () => {
  const q = cityInput.value.trim();
  let suggestions = [];

  if (q.length === 0) {
    // Mostrar todas las hardcodeadas
    suggestions = CIUDADES_FAMOSAS.slice(0, 8);
  } else if (q.length < 3) {
    // Filtrar hardcodeadas
    suggestions = CIUDADES_FAMOSAS.filter(c => c.toLowerCase().startsWith(q.toLowerCase()));
  } else {
    // Hardcodeadas filtradas + Nominatim
    const hardFiltered = CIUDADES_FAMOSAS.filter(c => c.toLowerCase().includes(q.toLowerCase()));
    const dynamic = await searchCities(q);
    // Merge sin duplicados
    const all = [...new Set([...hardFiltered, ...dynamic])];
    suggestions = all.slice(0, 8);
  }

  renderCityDropdown(suggestions);
});

function renderCityDropdown(suggestions) {
  cityDropdown.innerHTML = '';
  if (suggestions.length === 0) {
    cityDropdown.style.display = 'none';
    return;
  }
  suggestions.forEach(city => {
    const item = document.createElement('div');
    item.className = 'city-suggestion-item';
    item.textContent = city;
    item.addEventListener('click', () => {
      cityInput.value = city;
      cityDropdown.style.display = 'none';
    });
    cityDropdown.appendChild(item);
  });
  cityDropdown.style.display = 'block';
}

// Cerrar dropdown al hacer click afuera
document.addEventListener('click', (e) => {
  if (!cityInput.contains(e.target) && !cityDropdown.contains(e.target)) {
    cityDropdown.style.display = 'none';
  }
});
```

El dropdown debe tener estilo coherente con el diseño noir del juego: fondo oscuro tipo `#1c140d`, borde `#4a3826`, texto `#d8c8b4`, hover con fondo `#35261a`.

Si el usuario escribe algo que no está en las sugerencias y presiona Enter o hace click en "Generar caso", se usa lo que escribió tal cual — la IA lo interpreta libremente como ambientación.

### Dificultad — select limpio

```html
<select id="selectDificultad" class="form-control">
  <option value="facil">Fácil — Pistas directas, culpable evidente</option>
  <option value="normal" selected>Normal — Pistas mixtas, varios sospechosos creíbles</option>
  <option value="dificil">Difícil — Red herrings, culpable con coartada sólida</option>
</select>
```

---

## Notas generales

- No tocar la lógica de interrogatorios, análisis forense, veredicto ni la pantalla de resultado — eso ya funciona bien.
- El caso demo hardcodeado (offline mode) se mantiene igual — es el fallback cuando no hay API.
- Todos los cambios deben ser progresivos: si falla Nominatim, el input igual funciona con las ciudades hardcodeadas.
- Mantener la estética visual existente en todos los elementos nuevos.
