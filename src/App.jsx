import React, { useState, useEffect, useRef } from 'react';
import { SafeStorage } from './services/storage';
import { DEMO_CASE } from './constants/demoCase';
import { CASO_HARRY_POTTER, checkHarryPotterEasterEgg } from './constants/harryPotterCase';
import { recordCaseFinished, recordHarryPotterStart } from './constants/achievements';
import { generateCaseWithLLM } from './services/caseGenerator';
import { importCaseFromJson } from './services/caseFileIO';
import { evaluateVerdict } from './services/verdictEvaluator';

import { DeskHeader } from './components/DeskHeader';
import { SetupDossier } from './components/SetupDossier';
import { Dossier } from './components/Investigation/Dossier';
import { VerdictScreen } from './components/Verdict/VerdictScreen';

import { CoopSetup } from './components/Coop/CoopSetup';
import { CoopRankingScreen } from './components/Coop/CoopRankingScreen';

import { ApiSettingsModal } from './components/Modals/ApiSettingsModal';
import { MyApiModal } from './components/Modals/MyApiModal';
import { AchievementsModal } from './components/Modals/AchievementsModal';
import { InterrogationModal } from './components/Modals/InterrogationModal';
import { AchievementToast } from './components/AchievementToast';

export function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' | 'setup' | 'coop_setup' | 'investigation' | 'verdict' | 'coop_ranking'
  const [apiConfig, setApiConfig] = useState(SafeStorage.getApiConfig());

  // Modal visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyApiOpen, setIsMyApiOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [activeAchievementToast, setActiveAchievementToast] = useState(null);
  const [interrogationSuspect, setInterrogationSuspect] = useState(null);

  // Active Case State
  const [caseData, setCaseData] = useState(null); // { publicInfo, truth, isOffline }
  const [interrogationsState, setInterrogationsState] = useState({}); // { [suspectId]: [qId, ...] }
  const [analyzedEvidenceIds, setAnalyzedEvidenceIds] = useState([]); // [eId, ...]
  const [verdictResult, setVerdictResult] = useState(null);

  // Timer & Easter Egg tracking
  const [casoStartTime, setCasoStartTime] = useState(Date.now());
  const [isHarryPotter, setIsHarryPotter] = useState(false);

  // Cooperative Mode State
  const [coopMode, setCoopMode] = useState(false);
  const [coopPlayers, setCoopPlayers] = useState(['Detective 1', 'Detective 2']);
  const [coopAccusations, setCoopAccusations] = useState({});
  const [coopCurrentPlayerIndex, setCoopCurrentPlayerIndex] = useState(0);
  const [coopResults, setCoopResults] = useState(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(1);
  const [genStatus, setGenStatus] = useState('');
  const [genError, setGenError] = useState('');
  const [lastGenParams, setLastGenParams] = useState({ ciudad: '', dificultad: 'Normal' });

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Hidden file input for importing shared cases (used by the POV menu)
  const fileInputRef = useRef(null);

  // Session persistence check on mount
  useEffect(() => {
    const session = SafeStorage.getGameSession();
    if (session && session.caseData) {
      setCaseData(session.caseData);
      setInterrogationsState(session.interrogationsState || {});
      setAnalyzedEvidenceIds(session.analyzedEvidenceIds || []);
      setVerdictResult(session.verdictResult || null);
      setCoopMode(Boolean(session.coopMode));
      setCoopPlayers(session.coopPlayers || ['Detective 1', 'Detective 2']);
      setCoopAccusations(session.coopAccusations || {});
      setCoopCurrentPlayerIndex(session.coopCurrentPlayerIndex || 0);
      setCoopResults(session.coopResults || null);
      setIsHarryPotter(Boolean(session.isHarryPotter));
      setCurrentScreen(session.currentScreen || 'investigation');
      setCasoStartTime(Date.now());
    }
  }, []);

  // Save session when relevant state changes
  useEffect(() => {
    if (caseData) {
      SafeStorage.saveGameSession({
        caseData,
        interrogationsState,
        analyzedEvidenceIds,
        verdictResult,
        coopMode,
        coopPlayers,
        coopAccusations,
        coopCurrentPlayerIndex,
        coopResults,
        isHarryPotter,
        currentScreen
      });
    }
  }, [
    caseData,
    interrogationsState,
    analyzedEvidenceIds,
    verdictResult,
    coopMode,
    coopPlayers,
    coopAccusations,
    coopCurrentPlayerIndex,
    coopResults,
    isHarryPotter,
    currentScreen
  ]);

  const handleSaveApiConfig = (newConfig) => {
    setApiConfig(newConfig);
    SafeStorage.setApiConfig(newConfig);
  };

  const handleSelectProviderFromMyApi = (providerId) => {
    const updated = {
      ...apiConfig,
      provider: providerId,
      apiKey: SafeStorage.getProviderKey(providerId) || ''
    };
    setApiConfig(updated);
    SafeStorage.setApiConfig(updated);
    setIsMyApiOpen(false);
    setIsSettingsOpen(true);
  };

  const handleStartNew = () => {
    setCoopMode(false);
    setIsHarryPotter(false);
    setGenError('');
    setCurrentScreen('setup');
  };

  const handleStartCoopSetup = () => {
    setCoopMode(true);
    setIsHarryPotter(false);
    setGenError('');
    setCurrentScreen('coop_setup');
  };

  const handleStartCoop = (cleanNames, ciudad, dificultad) => {
    setCoopMode(true);
    setCoopPlayers(cleanNames);
    setCoopCurrentPlayerIndex(0);
    setCoopAccusations({});
    setCoopResults(null);
    setIsHarryPotter(false);
    handleGenerateCase(ciudad, dificultad);
  };

  const handleLoadDemo = () => {
    setCoopMode(false);
    setIsHarryPotter(false);
    const demo = {
      publicInfo: JSON.parse(JSON.stringify(DEMO_CASE.publicInfo)),
      truth: JSON.parse(JSON.stringify(DEMO_CASE.truth)),
      isOffline: true
    };
    setCaseData(demo);
    setInterrogationsState({});
    setAnalyzedEvidenceIds([]);
    setVerdictResult(null);
    setCasoStartTime(Date.now());
    setCurrentScreen('investigation');
  };

  const handleLoadHarryPotter = () => {
    setCoopMode(false);
    setIsHarryPotter(true);
    const hp = {
      publicInfo: JSON.parse(JSON.stringify(CASO_HARRY_POTTER.publicInfo)),
      truth: JSON.parse(JSON.stringify(CASO_HARRY_POTTER.truth)),
      isOffline: true
    };
    setCaseData(hp);
    setInterrogationsState({});
    setAnalyzedEvidenceIds([]);
    setVerdictResult(null);
    setCasoStartTime(Date.now());

    // Trigger Harry Potter achievement unlock
    const newLogros = recordHarryPotterStart();
    if (newLogros && newLogros.length > 0) {
      setActiveAchievementToast(newLogros[0]);
    }

    setCurrentScreen('investigation');
  };

  const handleCaseLoaded = (imported) => {
    setCoopMode(false);
    setIsHarryPotter(false);
    const loaded = {
      publicInfo: imported.publicInfo,
      truth: imported.truth,
      isOffline: !apiConfig.apiKey
    };
    setCaseData(loaded);
    setInterrogationsState({});
    setAnalyzedEvidenceIds([]);
    setVerdictResult(null);
    setCasoStartTime(Date.now());
    setCurrentScreen('investigation');
  };

  const handleGenerateCase = async (ciudad, dificultad) => {
    setLastGenParams({ ciudad, dificultad });
    setIsGenerating(true);
    setGenError('');
    setGenStep(1);
    setGenStatus('Iniciando proceso quirúrgico...');

    try {
      const result = await generateCaseWithLLM(
        ciudad,
        dificultad,
        apiConfig,
        (step, text) => {
          setGenStep(step);
          setGenStatus(text);
        }
      );

      setCaseData(result);
      setInterrogationsState({});
      setAnalyzedEvidenceIds([]);
      setVerdictResult(null);
      setCasoStartTime(Date.now());
      setCurrentScreen('investigation');
    } catch (err) {
      setGenError(err.message || 'Error desconocido durante la generación.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryGeneration = () => {
    handleGenerateCase(lastGenParams.ciudad, lastGenParams.dificultad);
  };

  const handleConfirmInterrogation = (suspectId, questionIds) => {
    setInterrogationsState(prev => ({
      ...prev,
      [suspectId]: questionIds
    }));
  };

  const handleAskQuestion = (suspectId, questionId) => {
    setInterrogationsState(prev => {
      const currentList = prev[suspectId] || [];
      if (currentList.includes(questionId) || currentList.length >= 3) return prev;
      return {
        ...prev,
        [suspectId]: [...currentList, questionId]
      };
    });
  };

  const handleAnalyzeEvidence = (evidenceId) => {
    setAnalyzedEvidenceIds(prev => {
      if (prev.includes(evidenceId) || prev.length >= 2) return prev;
      return [...prev, evidenceId];
    });
  };

  // Solo Accusation
  const handleSubmitAccusation = async ({ acusadoId, armaId, motivo, reconstruccion }) => {
    if (!caseData?.truth) return;
    setIsEvaluating(true);

    const tiempoSegundos = Math.max(1, Math.floor((Date.now() - casoStartTime) / 1000));

    try {
      const evalRes = await evaluateVerdict({
        truth: caseData.truth,
        suspects: caseData.publicInfo.sospechosos,
        evidences: caseData.publicInfo.evidencias,
        acusadoId,
        armaId,
        motivo,
        reconstruccion,
        apiConfig,
        isOffline: caseData.isOffline,
        onRetryStatus: (msg) => console.log('Verdict retry:', msg)
      });

      const totalScore = evalRes.puntajeTotal !== undefined ? evalRes.puntajeTotal : (evalRes.puntaje || 0);

      // Record stats and check for achievements
      const newlyUnlocked = recordCaseFinished({
        puntaje: totalScore,
        tiempoSegundos,
        forensesUsados: analyzedEvidenceIds.length,
        interrogacionesRealizadas: Object.keys(interrogationsState).length,
        acertoCulpable: Boolean(evalRes.desglose?.culpable?.acerto),
        esCoopVictoria: false,
        esHarryPotter: isHarryPotter
      });

      if (newlyUnlocked && newlyUnlocked.length > 0) {
        setActiveAchievementToast(newlyUnlocked[0]);
      }

      setVerdictResult(evalRes);
      setCurrentScreen('verdict');
    } catch (err) {
      alert(`Error al emitir el veredicto: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Turn-by-turn Cooperative Accusation
  const handleSubmitPlayerTurn = async (turnData) => {
    const updatedAccusations = {
      ...coopAccusations,
      [coopCurrentPlayerIndex]: turnData
    };
    setCoopAccusations(updatedAccusations);

    // If more players remain, go to next player turn
    if (coopCurrentPlayerIndex < coopPlayers.length - 1) {
      setCoopCurrentPlayerIndex(prev => prev + 1);
      return;
    }

    // All players have submitted: evaluate each player's deduction in sequence
    setIsEvaluating(true);
    const tiempoSegundos = Math.max(1, Math.floor((Date.now() - casoStartTime) / 1000));

    try {
      const results = [];

      for (let i = 0; i < coopPlayers.length; i++) {
        const pTurn = updatedAccusations[i];
        if (!pTurn) continue;

        const evalRes = await evaluateVerdict({
          truth: caseData.truth,
          suspects: caseData.publicInfo.sospechosos,
          evidences: caseData.publicInfo.evidencias,
          acusadoId: pTurn.acusadoId,
          armaId: pTurn.armaId,
          motivo: pTurn.motivo,
          reconstruccion: pTurn.reconstruccion,
          apiConfig,
          isOffline: caseData.isOffline,
          onRetryStatus: (msg) => console.log(`Verdict retry for ${coopPlayers[i]}:`, msg)
        });

        const pScore = evalRes.puntajeTotal !== undefined ? evalRes.puntajeTotal : (evalRes.puntaje || 0);

        results.push({
          player: coopPlayers[i],
          score: pScore,
          condena: evalRes.condena,
          narrativaCondena: evalRes.narrativaCondena,
          desglose: evalRes.desglose
        });
      }

      // Check achievements for coop
      const topScore = Math.max(...results.map(r => r.score));
      const newlyUnlocked = recordCaseFinished({
        puntaje: topScore,
        tiempoSegundos,
        forensesUsados: analyzedEvidenceIds.length,
        interrogacionesRealizadas: Object.keys(interrogationsState).length,
        acertoCulpable: results.some(r => r.desglose?.culpable?.acerto),
        esCoopVictoria: true,
        esHarryPotter: isHarryPotter
      });

      if (newlyUnlocked && newlyUnlocked.length > 0) {
        setActiveAchievementToast(newlyUnlocked[0]);
      }

      setCoopResults(results);
      setCurrentScreen('coop_ranking');
    } catch (err) {
      alert(`Error al evaluar acusaciones cooperativas: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePlayAgain = () => {
    SafeStorage.clearGameSession();
    setCaseData(null);
    setVerdictResult(null);
    setCoopResults(null);
    if (coopMode) {
      setCurrentScreen('coop_setup');
    } else {
      setCurrentScreen('setup');
    }
  };

  const handleGoHome = () => {
    setCurrentScreen('menu');
  };

  const handleNuevoCasoClick = () => {
    if (checkHarryPotterEasterEgg()) {
      handleLoadHarryPotter();
      return;
    }
    handleStartNew();
  };

  // Restore the POV menu when an action that stays on the "menu" screen
  // (Achievements, import dialog) is dismissed without moving on.
  const showPovMenuIfHome = () => {
    if (currentScreen === 'menu') {
      window.dispatchEvent(new CustomEvent('veredikt:menu-show'));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      showPovMenuIfHome();
      return;
    }
    try {
      const imported = await importCaseFromJson(file);
      handleCaseLoaded(imported);
    } catch (err) {
      alert(`Error al importar el archivo: ${err.message}`);
      showPovMenuIfHome();
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Bridge between the Three.js POV menu (index.html) and the game's React actions
  useEffect(() => {
    window.__verediktMenuAction = (folderId) => {
      switch (folderId) {
        case 'nuevo':
          handleNuevoCasoClick();
          break;
        case 'comunidad':
          fileInputRef.current?.click();
          break;
        case 'casos':
          handleLoadDemo();
          break;
        case 'logros':
          setIsAchievementsOpen(true);
          break;
        case 'coop':
          handleStartCoopSetup();
          break;
        default:
          break;
      }
    };
    window.__verediktOpenSettings = () => setIsSettingsOpen(true);
    window.__verediktOpenMyApi = () => setIsMyApiOpen(true);

    return () => {
      delete window.__verediktMenuAction;
      delete window.__verediktOpenSettings;
      delete window.__verediktOpenMyApi;
    };
  });

  // Synchronize the POV menu visibility with the current screen
  useEffect(() => {
    if (currentScreen === 'menu') {
      window.dispatchEvent(new CustomEvent('veredikt:menu-show'));
    } else {
      window.dispatchEvent(new CustomEvent('veredikt:menu-hide'));
    }
  }, [currentScreen]);

  // The native file picker fires "cancel" when dismissed without choosing a file.
  // The menu was hidden when the Comunidad folder was selected, so bring it back.
  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const handleCancel = () => showPovMenuIfHome();
    input.addEventListener('cancel', handleCancel);
    return () => input.removeEventListener('cancel', handleCancel);
  }, [currentScreen]);

  return (
    <div className="desk-container">
      <DeskHeader 
        currentConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMyApi={() => setIsMyApiOpen(true)}
        onGoHome={handleGoHome}
        currentScreen={currentScreen}
      />

      <main className="desk-main-area">
        {currentScreen === 'setup' && (
          <SetupDossier 
            onGenerate={handleGenerateCase}
            isGenerating={isGenerating}
            currentStep={genStep}
            statusText={genStatus}
            genError={genError}
            onRetry={handleRetryGeneration}
            onBack={() => setCurrentScreen('menu')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasApiKey={Boolean(apiConfig.apiKey)}
          />
        )}

        {currentScreen === 'coop_setup' && (
          <CoopSetup
            onStartCoop={handleStartCoop}
            isGenerating={isGenerating}
            currentStep={genStep}
            statusText={genStatus}
            genError={genError}
            onRetry={handleRetryGeneration}
            onBack={() => setCurrentScreen('menu')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasApiKey={Boolean(apiConfig.apiKey)}
          />
        )}

        {currentScreen === 'investigation' && caseData && (
          <Dossier 
            publicInfo={caseData.publicInfo}
            onSelectSuspectToInterrogate={(suspect) => setInterrogationSuspect(suspect)}
            interrogationsState={interrogationsState}
            analyzedEvidenceIds={analyzedEvidenceIds}
            onAnalyzeEvidence={handleAnalyzeEvidence}
            onSubmitAccusation={handleSubmitAccusation}
            isEvaluating={isEvaluating}
            isCoop={coopMode}
            players={coopPlayers}
            currentPlayerIndex={coopCurrentPlayerIndex}
            onSubmitPlayerTurn={handleSubmitPlayerTurn}
          />
        )}

        {currentScreen === 'verdict' && verdictResult && caseData && (
          <VerdictScreen 
            verdictResult={verdictResult}
            truth={caseData.truth}
            publicInfo={caseData.publicInfo}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}

        {currentScreen === 'coop_ranking' && coopResults && caseData && (
          <CoopRankingScreen
            coopResults={coopResults}
            truth={caseData.truth}
            publicInfo={caseData.publicInfo}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* MODALS */}
      <ApiSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentConfig={apiConfig}
        onSaveConfig={handleSaveApiConfig}
      />

      <MyApiModal 
        isOpen={isMyApiOpen}
        onClose={() => setIsMyApiOpen(false)}
        currentConfig={apiConfig}
        onSelectProvider={handleSelectProviderFromMyApi}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => {
          setIsAchievementsOpen(false);
          showPovMenuIfHome();
        }}
      />

      <InterrogationModal 
        isOpen={Boolean(interrogationSuspect)}
        onClose={() => setInterrogationSuspect(null)}
        suspect={interrogationSuspect}
        askedQuestionIds={interrogationSuspect ? (interrogationsState[interrogationSuspect.id] || []) : []}
        onAskQuestion={handleAskQuestion}
        onConfirmInterrogation={handleConfirmInterrogation}
      />

      {/* ACHIEVEMENT TOAST */}
      <AchievementToast
        achievement={activeAchievementToast}
        onDismiss={() => setActiveAchievementToast(null)}
      />

      {/* HIDDEN FILE INPUT FOR IMPORT FROM THE POV MENU */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json,application/json"
        onChange={handleFileChange}
      />
    </div>
  );
}
