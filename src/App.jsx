import React, { useState, useEffect } from 'react';
import { SafeStorage } from './services/storage';
import { DEMO_CASE } from './constants/demoCase';
import { generateCaseWithLLM } from './services/caseGenerator';
import { evaluateVerdict } from './services/verdictEvaluator';

import { DeskHeader } from './components/DeskHeader';
import { MainMenu } from './components/MainMenu';
import { SetupDossier } from './components/SetupDossier';
import { Dossier } from './components/Investigation/Dossier';
import { VerdictScreen } from './components/Verdict/VerdictScreen';

import { ApiSettingsModal } from './components/Modals/ApiSettingsModal';
import { MyApiModal } from './components/Modals/MyApiModal';
import { InterrogationModal } from './components/Modals/InterrogationModal';

export function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' | 'setup' | 'investigation' | 'verdict'
  const [apiConfig, setApiConfig] = useState(SafeStorage.getApiConfig());

  // Modal visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyApiOpen, setIsMyApiOpen] = useState(false);
  const [interrogationSuspect, setInterrogationSuspect] = useState(null);

  // Active Case State
  const [caseData, setCaseData] = useState(null); // { publicInfo, truth, isOffline }
  const [interrogationsState, setInterrogationsState] = useState({}); // { [suspectId]: [qId, ...] }
  const [analyzedEvidenceIds, setAnalyzedEvidenceIds] = useState([]); // [eId, ...]
  const [verdictResult, setVerdictResult] = useState(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(1);
  const [genStatus, setGenStatus] = useState('');
  const [genError, setGenError] = useState('');
  const [lastGenParams, setLastGenParams] = useState({ ciudad: '', dificultad: 'Normal' });

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Session persistence check on mount
  useEffect(() => {
    const session = SafeStorage.getGameSession();
    if (session && session.caseData) {
      setCaseData(session.caseData);
      setInterrogationsState(session.interrogationsState || {});
      setAnalyzedEvidenceIds(session.analyzedEvidenceIds || []);
      setVerdictResult(session.verdictResult || null);
      setCurrentScreen(session.currentScreen || 'investigation');
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
        currentScreen
      });
    }
  }, [caseData, interrogationsState, analyzedEvidenceIds, verdictResult, currentScreen]);

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
    setGenError('');
    setCurrentScreen('setup');
  };

  const handleLoadDemo = () => {
    const demo = {
      publicInfo: JSON.parse(JSON.stringify(DEMO_CASE.publicInfo)),
      truth: JSON.parse(JSON.stringify(DEMO_CASE.truth)),
      isOffline: true
    };
    setCaseData(demo);
    setInterrogationsState({});
    setAnalyzedEvidenceIds([]);
    setVerdictResult(null);
    setCurrentScreen('investigation');
  };

  const handleCaseLoaded = (imported) => {
    const loaded = {
      publicInfo: imported.publicInfo,
      truth: imported.truth,
      isOffline: !apiConfig.apiKey
    };
    setCaseData(loaded);
    setInterrogationsState({});
    setAnalyzedEvidenceIds([]);
    setVerdictResult(null);
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

  const handleSubmitAccusation = async ({ acusadoId, armaId, motivo, reconstruccion }) => {
    if (!caseData?.truth) return;
    setIsEvaluating(true);

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

      setVerdictResult(evalRes);
      setCurrentScreen('verdict');
    } catch (err) {
      alert(`Error al emitir el veredicto: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePlayAgain = () => {
    SafeStorage.clearGameSession();
    setCaseData(null);
    setVerdictResult(null);
    setCurrentScreen('setup');
  };

  const handleGoHome = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="desk-container">
      <DeskHeader 
        currentConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMyApi={() => setIsMyApiOpen(true)}
        onGoHome={handleGoHome}
        currentScreen={currentScreen}
      />

      <main className="desk-workspace">
        {currentScreen === 'menu' && (
          <MainMenu 
            onStartNew={handleStartNew}
            onLoadDemo={handleLoadDemo}
            onCaseLoaded={handleCaseLoaded}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenMyApi={() => setIsMyApiOpen(true)}
            currentConfig={apiConfig}
          />
        )}

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

        {currentScreen === 'investigation' && caseData && (
          <Dossier 
            publicInfo={caseData.publicInfo}
            onSelectSuspectToInterrogate={(suspect) => setInterrogationSuspect(suspect)}
            interrogationsState={interrogationsState}
            analyzedEvidenceIds={analyzedEvidenceIds}
            onAnalyzeEvidence={handleAnalyzeEvidence}
            onSubmitAccusation={handleSubmitAccusation}
            isEvaluating={isEvaluating}
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

      <InterrogationModal 
        isOpen={Boolean(interrogationSuspect)}
        onClose={() => setInterrogationSuspect(null)}
        suspect={interrogationSuspect}
        askedQuestionIds={interrogationSuspect ? (interrogationsState[interrogationSuspect.id] || []) : []}
        onAskQuestion={handleAskQuestion}
        onConfirmInterrogation={handleConfirmInterrogation}
      />
    </div>
  );
}
