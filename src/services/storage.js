// Storage helper for Veredikt
const STORAGE_PREFIX = 'veredikt_';

export function obfuscateTruth(truthObj) {
  try {
    const json = JSON.stringify(truthObj);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error('Error obfuscating truth', e);
    return '';
  }
}

export function deobfuscateTruth(obfuscatedStr) {
  try {
    if (!obfuscatedStr) return null;
    const json = decodeURIComponent(atob(obfuscatedStr));
    return JSON.parse(json);
  } catch (e) {
    console.error('Error deobfuscating truth', e);
    return null;
  }
}

export const SafeStorage = {
  getApiConfig() {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}api_config`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      provider: 'groq',
      apiKey: '',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
      customModel: ''
    };
  },

  setApiConfig(config) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}api_config`, JSON.stringify(config));
      if (config.provider && config.apiKey) {
        localStorage.setItem(`${STORAGE_PREFIX}key_${config.provider}`, config.apiKey);
      }
    } catch (e) {
      console.error('Storage set error', e);
    }
  },

  getProviderKey(providerId) {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}key_${providerId}`) || '';
    } catch {
      return '';
    }
  },

  saveGameSession(sessionData) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}active_session`, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Session save failed', e);
    }
  },

  getGameSession() {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}active_session`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  clearGameSession() {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}active_session`);
    } catch {}
  },

  getStats() {
    try {
      const stats = localStorage.getItem(`${STORAGE_PREFIX}stats`);
      return stats ? JSON.parse(stats) : {
        gamesPlayed: 0,
        gamesWon: 0,
        tokensTotal: 0,
        providerStats: {} // { [providerId]: { games: 0, calls: 0 } }
      };
    } catch {
      return { gamesPlayed: 0, gamesWon: 0, tokensTotal: 0, providerStats: {} };
    }
  },

  recordGameCall(providerId) {
    try {
      const stats = this.getStats();
      if (!stats.providerStats) stats.providerStats = {};
      if (!stats.providerStats[providerId]) {
        stats.providerStats[providerId] = { games: 0, calls: 0 };
      }
      stats.providerStats[providerId].calls = (stats.providerStats[providerId].calls || 0) + 1;
      localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
    } catch {}
  },

  recordGameFinished(providerId, won) {
    try {
      const stats = this.getStats();
      stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      if (won) stats.gamesWon = (stats.gamesWon || 0) + 1;
      if (!stats.providerStats) stats.providerStats = {};
      if (!stats.providerStats[providerId]) {
        stats.providerStats[providerId] = { games: 0, calls: 0 };
      }
      stats.providerStats[providerId].games = (stats.providerStats[providerId].games || 0) + 1;
      localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
    } catch {}
  }
};
