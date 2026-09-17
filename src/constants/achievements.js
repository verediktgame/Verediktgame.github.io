export const LOGROS = [
  {
    id: "sherlock",
    nombre: "Sherlock",
    icono: "🔍",
    descripcion: "Resolvé 10 casos con 90 puntos o más",
    condicion: (stats) => (stats.casosConPuntaje90 || 0) >= 10
  },
  {
    id: "perito",
    nombre: "Perito Forense",
    icono: "🧪",
    descripcion: "Resolvé un caso sin usar ningún análisis forense",
    condicion: (stats) => stats.ultimoCasoForensesUsados === 0 && stats.ultimoCasoPuntaje >= 50
  },
  {
    id: "intuicion",
    nombre: "Intuición Pura",
    icono: "⚡",
    descripcion: "Resolvé un caso en menos de 5 minutos con 70+ puntos",
    condicion: (stats) => (stats.ultimoCasoTiempoSegundos || 9999) < 300 && stats.ultimoCasoPuntaje >= 70
  },
  {
    id: "perfecto",
    nombre: "Expediente Perfecto",
    icono: "💯",
    descripcion: "Obtené 100 puntos en un caso",
    condicion: (stats) => stats.ultimoCasoPuntaje === 100
  },
  {
    id: "veterano",
    nombre: "Detective Veterano",
    icono: "🎖️",
    descripcion: "Completá 25 casos",
    condicion: (stats) => (stats.totalCasosCompletados || 0) >= 25
  },
  {
    id: "cooperativo",
    nombre: "Trabajo en Equipo",
    icono: "🤝",
    descripcion: "Ganás una partida cooperativa",
    condicion: (stats) => (stats.victoriasCoop || 0) >= 1
  },
  {
    id: "sin_pistas",
    nombre: "A Ojo",
    icono: "👁️",
    descripcion: "Acertás al culpable sin interrogar a ningún sospechoso",
    condicion: (stats) => stats.ultimoCasoInterrogaciones === 0 && stats.ultimoCasoAcertoCulpable === true
  },
  {
    id: "harry",
    nombre: "9¾",
    icono: "⚡",
    descripcion: "...", // Descripción vaga — no spoilear el easter egg
    condicion: (stats) => stats.jugoBHarryPotter === true
  }
];

export const defaultStats = {
  totalCasosCompletados: 0,
  casosConPuntaje90: 0,
  victoriasCoop: 0,
  ultimoCasoPuntaje: 0,
  ultimoCasoTiempoSegundos: 0,
  ultimoCasoForensesUsados: 0,
  ultimoCasoInterrogaciones: 0,
  ultimoCasoAcertoCulpable: false,
  jugoBHarryPotter: false,
  logrosDesbloqueados: []
};

export function getStats() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { ...defaultStats };
    const raw = localStorage.getItem('veredikt_stats');
    if (!raw) return { ...defaultStats };
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading stats from localStorage:', e);
    return { ...defaultStats };
  }
}

export function saveStats(stats) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('veredikt_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats to localStorage:', e);
  }
}

export function checkNewAchievements(stats) {
  const currentUnlocked = new Set(stats.logrosDesbloqueados || []);
  const newlyUnlocked = [];

  LOGROS.forEach(logro => {
    if (!currentUnlocked.has(logro.id)) {
      if (logro.condicion(stats)) {
        currentUnlocked.add(logro.id);
        newlyUnlocked.push(logro);
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    stats.logrosDesbloqueados = Array.from(currentUnlocked);
    saveStats(stats);
  }

  return newlyUnlocked;
}

export function recordCaseFinished({
  puntaje = 0,
  tiempoSegundos = 0,
  forensesUsados = 0,
  interrogacionesRealizadas = 0,
  acertoCulpable = false,
  esCoopVictoria = false,
  esHarryPotter = false
}) {
  const stats = getStats();

  stats.totalCasosCompletados = (stats.totalCasosCompletados || 0) + 1;
  if (puntaje >= 90) {
    stats.casosConPuntaje90 = (stats.casosConPuntaje90 || 0) + 1;
  }
  if (esCoopVictoria) {
    stats.victoriasCoop = (stats.victoriasCoop || 0) + 1;
  }
  if (esHarryPotter) {
    stats.jugoBHarryPotter = true;
  }

  stats.ultimoCasoPuntaje = puntaje;
  stats.ultimoCasoTiempoSegundos = tiempoSegundos;
  stats.ultimoCasoForensesUsados = forensesUsados;
  stats.ultimoCasoInterrogaciones = interrogacionesRealizadas;
  stats.ultimoCasoAcertoCulpable = acertoCulpable;

  saveStats(stats);
  return checkNewAchievements(stats);
}

export function recordHarryPotterStart() {
  const stats = getStats();
  stats.jugoBHarryPotter = true;
  saveStats(stats);
  return checkNewAchievements(stats);
}
