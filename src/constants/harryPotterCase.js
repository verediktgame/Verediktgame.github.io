import { isHogwartsDay } from './hogwarts.js';

export function checkHarryPotterEasterEgg() {
  // El caso Harry Potter solo está disponible el 1 de septiembre.
  if (!isHogwartsDay()) {
    return false;
  }
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  // Activo entre 9:45 y 10:00
  if ((h === 9 && m >= 45) || (h === 9 && m === 59)) {
    return true;
  }
  return false;
}

export const CASO_HARRY_POTTER = {
  publicInfo: {
    titulo: "El Misterio de la Cámara Sellada",
    ciudad: "Hogwarts, Escocia",
    epoca: "Hogwarts, 1994",
    tipo_crimen: "Desaparición y agresión mágica",
    victima: {
      nombre: "Barnabas Cuffe",
      descripcion: "Editor del Profeta del Brujo, encontrado inconsciente en el tercer piso con un hechizo de Obliviate mal lanzado."
    },
    informeGeneral: "El señor Cuffe fue hallado la noche del martes en el corredor del tercer piso, con signos de un hechizo de memoria aplicado de forma violenta. Su maletín con documentos confidenciales del Ministerio había desaparecido.",
    descripcionEscena: "El corredor huele a pólvora de Floo y hay marcas de quemadura en el suelo de piedra. Una varita rota yace junto a la armadura del caballero sin cabeza, y una pluma de Fénix reposa extrañamente sobre el alféizar.",
    sospechosos: [
      {
        id: "s1",
        nombre: "Draco Malfoy",
        perfil: "Estudiante de Slytherin, quinto año. Conocido por su lealtad a ciertos intereses del Ministerio.",
        coartada: "Estaba en la sala común de Slytherin según tres testigos de su casa.",
        preguntas: [
          { id: "p1", pregunta: "¿Conocías al señor Cuffe?", respuesta: "Sólo de nombre. Mi padre lo mencionaba en las cenas." },
          { id: "p2", pregunta: "¿Dónde estabas el martes a las 9?", respuesta: "En la sala común, como siempre. Preguntale a Crabbe." },
          { id: "p3", pregunta: "¿Sabés qué contenía el maletín?", respuesta: "No tengo idea de qué maletín hablás." },
          { id: "p4", pregunta: "¿Conocés el hechizo Obliviate?", respuesta: "Lo estudié en Defensa, como todos. No lo usé." },
          { id: "p5", pregunta: "¿Viste a alguien en el tercer piso esa noche?", respuesta: "Vi a Moody merodeando, pero eso no es inusual en él." }
        ]
      },
      {
        id: "s2",
        nombre: "Quirinus Quirrell (Fantasma residente)",
        perfil: "Ex profesor de Defensa Contra las Artes Oscuras. Su espectro fue visto en el ala norte.",
        coartada: "Los fantasmas no pueden interactuar físicamente con objetos, según el protocolo del castillo.",
        preguntas: [
          { id: "p1", pregunta: "¿Conocías a Cuffe?", respuesta: "Lo conocí en vida. Era... un hombre de información." },
          { id: "p2", pregunta: "¿Estabas en el tercer piso?", respuesta: "Los fantasmas vagamos. No llevamos agenda." },
          { id: "p3", pregunta: "¿Podés lanzar hechizos?", respuesta: "En mi estado actual, sería imposible sostener una varita." },
          { id: "p4", pregunta: "¿Viste algo esa noche?", respuesta: "Vi una capa que se movía demasiado rápido para ser un alumno normal." },
          { id: "p5", pregunta: "¿Tenés motivos para dañar a Cuffe?", respuesta: "Los muertos no tenemos motivaciones mundanas... generalmente." }
        ]
      },
      {
        id: "s3",
        nombre: "Dolores Umbridge",
        perfil: "Inspectora del Ministerio de Magia, presente en Hogwarts esa semana para una evaluación.",
        coartada: "Afirma estar redactando informes en su oficina provisional hasta medianoche.",
        preguntas: [
          { id: "p1", pregunta: "¿Por qué estabas en Hogwarts esa semana?", respuesta: "Evaluación rutinaria del Ministerio. Todo está debidamente documentado." },
          { id: "p2", pregunta: "¿Conocías los documentos que llevaba Cuffe?", respuesta: "El Ministerio tiene acceso a muchos documentos. No sabría decirte cuáles." },
          { id: "p3", pregunta: "¿Usaste el hechizo Obliviate alguna vez?", respuesta: "Es un hechizo de uso regulado. Yo sigo el reglamento al pie de la letra." },
          { id: "p4", pregunta: "¿Alguien puede confirmar que estabas en tu oficina?", respuesta: "Mis gatos lo confirmarían, pero entiendo que eso no es suficiente para vosotros." },
          { id: "p5", pregunta: "¿Qué contenían esos documentos del Ministerio?", respuesta: "Eso es información clasificada. Nivel Interventor Superior." }
        ]
      }
    ],
    evidencias: [
      {
        id: "e1",
        objeto: "Varita rota",
        descripcion: "Varita de 28cm, madera de tejo, núcleo desconocido. Rota en dos partes limpias.",
        ubicacion: "Junto a la armadura del caballero sin cabeza, tercer piso.",
        analisisForense: "Trazas de hechizo Obliviate en ambos fragmentos. El núcleo revela residuos de magia oscura comprimida, incompatible con magia estándar del Ministerio."
      },
      {
        id: "e2",
        objeto: "Pluma de Fénix",
        descripcion: "Pluma dorada de aproximadamente 40cm. No pertenece a ningún Fénix registrado en Hogwarts.",
        ubicacion: "Sobre el alféizar del corredor del tercer piso.",
        analisisForense: "La pluma contiene rastros de Polyjuice potion en su base. Quien la dejó caer estaba bajo efecto de una transformación que acababa de revertirse."
      },
      {
        id: "e3",
        objeto: "Maletín de Cuffe",
        descripcion: "Maletín de cuero negro con cierre de plata. Desaparecido de la escena.",
        ubicacion: "No encontrado. Último avistamiento: en manos de Cuffe al entrar al castillo.",
        analisisForense: "Se detectaron trazas de Floo en la chimenea del corredor adyacente. El maletín probablemente fue enviado por red Floo a destino desconocido."
      },
      {
        id: "e4",
        objeto: "Frasco de Polyjuice",
        descripcion: "Frasco pequeño, casi vacío, con residuo color turquesa.",
        ubicacion: "Detrás de la armadura, oculto bajo una piedra suelta.",
        analisisForense: "El residuo confirma una dosis de Polyjuice de alta potencia. La muestra de cabello usada para la transformación fue de un alumno de Hogwarts, según el perfil mágico."
      }
    ],
    declaraciones: [
      {
        testigo: "Casi Decapitado Nick",
        relacion: "Fantasma del ala norte, presente en el corredor esa noche",
        texto: "Vi a alguien con capa oscura que se movía con paso muy decidido hacia el tercer piso. Lo raro es que sus pies hacían ruido — los alumnos con capa de invisibilidad no suelen hacer ruido, pero esta persona sí."
      },
      {
        testigo: "Argus Filch",
        relacion: "Conserje de Hogwarts, realizaba ronda nocturna",
        texto: "Escuché un estruendo cerca del corredor del caballero alrededor de las 9:50. Cuando llegué no había nadie, solo el señor Cuffe en el suelo y olor a ese maldito líquido burbujeante que usan los alumnos para meterse en problemas."
      }
    ]
  },
  truth: {
    culpable: "s3",
    arma: "e1",
    movil: "Umbridge sabía que Cuffe transportaba documentos que probaban que el Ministerio había encubierto actividad de Mortífagos. Usó Polyjuice para transformarse en un alumno y atacarlo antes de que los documentos llegaran a la prensa.",
    secuenciaReal: "Umbridge preparó una dosis de Polyjuice usando un cabello de Draco Malfoy (obtenido durante una inspección de dormitorios). Transformada en Malfoy, interceptó a Cuffe en el tercer piso, lanzó Obliviate para borrar su memoria y tomó el maletín. La varita se rompió al resistir Cuffe con un contraencantamiento. Antes de que el Polyjuice revirtiera, envió el maletín por la red Floo a una dirección del Ministerio y escapó. La pluma de su Fénix personal cayó sin que lo notara al revertir la transformación.",
    pistasClave: [
      "La pluma de Fénix tenía residuos de Polyjuice — alguien estaba transformado y revirtió cerca del lugar",
      "Casi Decapitado Nick dijo que la capa hacía ruido — la capa de invisibilidad no suena, era una capa común usada para disimular",
      "Umbridge dijo que sus 'gatos confirmarían' su coartada — los gatos en su oficina son pinturas del Ministerio, no mascotas reales"
    ],
    rubrica: {
      acerto_culpable: 40,
      acerto_movil: 20,
      acerto_arma: 20,
      calidad_reconstruccion_max: 20
    },
    condenas: {
      "80_100": "Dolores Umbridge fue llevada ante el Wizengamot y condenada a 15 años en Azkaban. El Ministerio emitió una disculpa oficial.",
      "50_79": "Umbridge fue suspendida del Ministerio con cargos menores. Sus abogados lograron reducir la condena a trabajo comunitario.",
      "20_49": "Por falta de pruebas suficientes, Umbridge continuó en su cargo. Los documentos nunca fueron recuperados.",
      "0_19": "Umbridge fue ascendida a Subsecretaria. El caso fue cerrado oficialmente como 'accidente mágico'."
    }
  }
};
