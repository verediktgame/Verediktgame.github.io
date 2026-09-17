# 🕵️ VEREDIKT — Expediente Criminal Confidencial

Juego web interactivo de deducción e investigación policial impulsado por Inteligencia Artificial (BYOK - *Bring Your Own Key*). Todo el juego se ejecuta en el navegador sin dependencias externas, con almacenamiento local confidencial en `localStorage`.

Inspirado en la atmósfera y estética de películas y series policíacas de culto como ***Se7en***, ***True Detective*** y ***Zodiac***.

---

## 📁 Características & Dirección de Arte

- **Escritorio de Madera & Carpeta Dossier**:
  - Fondo de madera oscura de caoba con iluminación de lámpara cenital de detective y viñeta noir.
  - Expediente criminal tipo manila con clips metálicos, marcas de tazas de café, sellos de goma roja (*CONFIDENCIAL*, *SUMARIO ABIERTO*, *EVIDENCIA FORENSE*).
  - Hojas de papel de archivo amarilleadas con textura y pestañas de navegación organizadas.
- **Tipografía de Máquina de Escribir**:
  - *Special Elite* y *Courier Prime* para todos los sumarios, declaraciones juradas, fichas periciales y peritajes judiciales.
- **Fichas de Sospechosos con Mugshots**:
  - Retratos policiales monocromáticos con cuadrícula de altura (*Height Measurement Chart*) y cartel de arresto policial.
- **Evidencias en Bolsas Forenses**:
  - Simulación de bolsa plástica sellada para embalaje de evidencias con código de barras y etiqueta de cadena de custodia.
  - Límite estratégico de **máximo 2 análisis forenses de laboratorio** por caso.
- **Interrogatorios Restringidos**:
  - El jugador puede seleccionar **exactamente 3 preguntas de 5** para cada sospechoso antes de que el abogado defensor interrumpa la sesión. Las 2 restantes quedan selladas y no formuladas.
- **Veredicto Judicial en 3 Pasos**:
  1. **Paso 1**: Puntuación sobre 100 con desglose (+40 culpable, +20 arma, +20 móvil, +0-20 calidad de reconstrucción).
  2. **Paso 2**: Reconstrucción de la verdad real y revelación de pistas clave.
  3. **Paso 3**: Sentencia penal dramatizada según la solidez probatoria.

---

## 🤖 Soporte Multi-Proveedor de IA

El juego permite configurar fácilmente tu API Key propia:
1. **OpenAI**: Modelos `gpt-4o`, `gpt-4o-mini`, etc.
2. **Google Gemini**: Modelos `gemini-1.5-flash`, `gemini-2.5-flash`, etc.
3. **Anthropic**: Modelos `claude-3-5-sonnet-20241022`, etc.
4. **DeepSeek**: Modelo `deepseek-chat`.
5. **Custom / Local**: Endpoints locales compatibles con OpenAI (como Ollama, LM Studio o proxies).

Incluye un botón **"⚡ Probar Conexión"** para testear la latencia y la respuesta del modelo en tiempo real.

> **💡 Modo Caso Modelo (Offline):**  
> Puedes jugar de inmediato sin necesidad de ingresar una API key seleccionando **"Examinar Caso Modelo (Offline)"** en el menú principal (*"El Crimen del Callejón del Relojero"*).

---

## 🚀 Cómo Ejecutar

Al ser un único archivo autocontenido:
- Abre directamente `index.html` en cualquier navegador web moderno (Chrome, Firefox, Safari, Edge, Brave).
- O puedes servirlo localmente mediante cualquier servidor estático:
  ```bash
  python3 -m http.server 8080
  ```
  y acceder a `http://localhost:8080`.
