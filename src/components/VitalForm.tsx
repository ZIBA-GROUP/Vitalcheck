import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Sliders,
  Layers,
  Award,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';
import {
  FORM_SECTIONS,
  INITIAL_RESPONSES,
  STANDARD_SCALE_COLUMNS,
  HEALTH_STATUS_COLUMNS,
} from '../data/formData';
import { FormResponses, LeadSubmission, EmailMarketingConfig } from '../types';
import { calculateVitalityScore, dispatchToEmailMarketing, saveLead } from '../services/emailMarketing';

interface VitalFormProps {
  emailConfig: EmailMarketingConfig;
  onSubmissionSuccess: (submission: LeadSubmission) => void;
  onOpenEmailConfig: () => void;
  onOpenAllInkl: () => void;
  themeVariant: 'navy-white' | 'dark';
  setThemeVariant: (theme: 'navy-white' | 'dark') => void;
}

export const VitalForm: React.FC<VitalFormProps> = ({
  emailConfig,
  onSubmissionSuccess,
  onOpenEmailConfig,
  onOpenAllInkl,
  themeVariant,
  setThemeVariant,
}) => {
  const [responses, setResponses] = useState<FormResponses>(INITIAL_RESPONSES);
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Version B: Durchgehendes Formular (Original Microsoft Forms Flow) als Standard aktiv
  const [viewMode, setViewMode] = useState<'compact' | 'wizard'>('compact');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isWhite = themeVariant === 'navy-white';

  // Field change helpers
  const handleTextChange = (field: keyof FormResponses, value: any) => {
    setResponses((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setResponses((prev) => {
      const exists = prev.goals.includes(goal);
      const updated = exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      return { ...prev, goals: updated };
    });
  };

  const handleMatrixChange = (
    matrixField: 'energyMatrix' | 'immuneMatrix' | 'acidMatrix' | 'sportMatrix' | 'dietMatrix' | 'healthMatrix' | 'kidsMatrix' | 'womenMatrix',
    rowId: string,
    columnId: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [matrixField]: {
        ...prev[matrixField],
        [rowId]: columnId,
      },
    }));
  };

  // Validation
  const validateStep = (stepNumber: number): boolean => {
    setErrorMessage(null);

    if (stepNumber === 1) {
      if (!responses.referralPerson.trim()) {
        setErrorMessage('Bitte gib an, wer dich auf den Vitalcheck aufmerksam gemacht hat.');
        return false;
      }
      if (responses.goals.length === 0) {
        setErrorMessage('Bitte wähle mindestens ein Ziel aus, das du erreichen möchtest.');
        return false;
      }
    }

    if (stepNumber === 2) {
      if (!responses.energyLevel) {
        setErrorMessage('Bitte wähle dein aktuelles Energielevel in Prozent aus.');
        return false;
      }
    }

    if (stepNumber === 3) {
      if (!responses.smoker) {
        setErrorMessage('Bitte gib an, ob du rauchst.');
        return false;
      }
    }

    if (stepNumber === 4) {
      if (!responses.sportFrequency) {
        setErrorMessage('Bitte gib an, wie regelmäßig du Sport treibst.');
        return false;
      }
    }

    if (stepNumber === 7) {
      if (!responses.top3Goals.trim()) {
        setErrorMessage('Bitte nenne deine 3 großen Ziele oder Herausforderungen.');
        return false;
      }
      if (!responses.fullName.trim()) {
        setErrorMessage('Bitte trage deinen Vor- und Nachnamen ein.');
        return false;
      }
      if (!responses.birthDate.trim()) {
        setErrorMessage('Bitte gib dein Geburtsdatum an.');
        return false;
      }
      if (!responses.street.trim()) {
        setErrorMessage('Bitte gib deine Straße und Hausnummer an.');
        return false;
      }
      if (!responses.zipCity.trim()) {
        setErrorMessage('Bitte gib deine PLZ und deinen Wohnort an.');
        return false;
      }
      if (!responses.email.trim() || !responses.email.includes('@')) {
        setErrorMessage('Bitte gib eine gültige E-Mail-Adresse an.');
        return false;
      }
      if (!responses.phone.trim()) {
        setErrorMessage('Bitte gib deine Handynummer für Rückfragen an.');
        return false;
      }
      if (!responses.privacyAccepted) {
        setErrorMessage('Bitte bestätige die Datenschutzerklärung zur Durchführung der Vitalanalyse.');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(7, prev + 1));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required steps
    for (let s = 1; s <= 7; s++) {
      if (!validateStep(s)) {
        if (viewMode === 'wizard') {
          setCurrentStep(s);
        }
        window.scrollTo({ top: 220, behavior: 'smooth' });
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const vitalityScore = calculateVitalityScore(responses);

    const newSubmission: LeadSubmission = {
      id: 'lead_' + Date.now(),
      timestamp: new Date().toISOString(),
      responses,
      syncedToEmailTool: false,
      vitalityScore,
    };

    try {
      const dispatchResult = await dispatchToEmailMarketing(responses, vitalityScore, emailConfig);
      newSubmission.syncedToEmailTool = dispatchResult.success;
      if (!dispatchResult.success) {
        newSubmission.syncError = dispatchResult.message;
      }

      saveLead(newSubmission);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0077b6', '#00b4d8', '#10b981', '#ffffff'],
        });
      } catch (err) {
        // Ignore
      }

      onSubmissionSuccess(newSubmission);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage('Es gab ein Problem beim Übermitteln. Bitte überprüfe deine Angaben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSection = FORM_SECTIONS.find((s) => s.stepNumber === currentStep) || FORM_SECTIONS[0];
  const progressPercent = Math.round((currentStep / 7) * 100);

  return (
    <div className="w-full">
      
      {/* OBERER TEIL: Immer im edlen Navy Blau mit Verlauf */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c183a] via-[#102252] to-[#070e20] border border-cyan-500/25 shadow-2xl p-6 sm:p-10 mb-8 text-white">
        
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Kostenlose & Ganzheitliche Vitalitätsanalyse</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Dein persönlicher <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400 bg-clip-text text-transparent">
              Gesundheitscheck
            </span>
          </h1>

          <div className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed space-y-2 max-w-3xl">
            <p className="font-semibold text-white">Herzlich Willkommen!</p>
            <p>
              Mit diesem Vitalcheck möchten wir dich und deine aktuelle Situation besser kennenlernen.
              Gemeinsam betrachten wir: <strong className="text-cyan-200">Energie, Wohlbefinden, Balance, Schlaf & Regeneration, Ernährung & Darm, Fokus & Leistungsfähigkeit</strong>.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm">
              Die Analyse dauert nur wenige Minuten und bildet das Fundament für deinen persönlichen Vitalitäts-Check.
            </p>
            <p className="text-cyan-300 font-semibold text-sm pt-1">
              — Julia & Jens
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Kostenfrei & unverbindlich
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <Lock className="w-4 h-4 text-cyan-400" />
              DSGVO-konforme Übertragung
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <Award className="w-4 h-4 text-amber-400" />
              Individuelle Auswertung durch Experten
            </span>
          </div>
        </div>
      </div>

      {/* UNTERER TEIL: Control Bar mit Style- und Modus-Schalter */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl border transition-colors ${
          isWhite
            ? 'bg-white border-slate-200/90 shadow-sm text-slate-800'
            : 'bg-[#08122a]/80 backdrop-blur-sm border-slate-800 text-white'
        }`}
      >
        {/* Design-Stil Schalter (Option B weiß vs Option A dunkel) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Design:
          </div>
          <button
            type="button"
            onClick={() => setThemeVariant('navy-white')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isWhite
                ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Option B: Unterer Teil Weiß (Favorit ★)</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeVariant('dark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              !isWhite
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Option A: Komplett dunkel</span>
          </button>
        </div>

        {/* Ansichtsmodus Schalter (Kompakt vs Wizard) */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isWhite ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'compact'
                ? isWhite
                  ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md'
                : isWhite
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kompakt (Durchgehend)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('wizard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'wizard'
                ? isWhite
                  ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                  : 'bg-cyan-500 text-slate-950 shadow-md'
                : isWhite
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>7-Schritte Wizard</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible in Wizard Mode) */}
      {viewMode === 'wizard' && (
        <div
          className={`mb-8 p-4 rounded-2xl border shadow-sm ${
            isWhite
              ? 'bg-white border-slate-200/90 text-slate-900'
              : 'bg-[#091430] border-slate-800/80 text-white'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Schritt {currentStep} von 7:</span>
              <span className={`font-semibold ${isWhite ? 'text-slate-800' : 'text-white'}`}>
                {activeSection.shortTitle}
              </span>
            </span>
            <span className="font-extrabold text-blue-700 font-heading text-sm">
              {progressPercent}%
            </span>
          </div>

          <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${isWhite ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3.5 hidden md:flex items-center justify-between gap-1">
            {FORM_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  if (sec.stepNumber <= currentStep || validateStep(currentStep)) {
                    setCurrentStep(sec.stepNumber);
                  }
                }}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-medium text-center truncate transition-all ${
                  sec.stepNumber === currentStep
                    ? isWhite
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 font-bold'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : sec.stepNumber < currentStep
                    ? isWhite
                      ? 'text-emerald-700 hover:text-emerald-800'
                      : 'text-emerald-400 hover:text-emerald-300'
                    : isWhite
                    ? 'text-slate-600 hover:text-slate-800'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {sec.stepNumber}. {sec.shortTitle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Sticky Quick Navigation for Compact Mode */}
        {viewMode === 'compact' && (
          <div
            className={`sticky top-20 z-30 mb-6 p-3 rounded-2xl border shadow-md transition-colors ${
              isWhite
                ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-800'
                : 'bg-[#09132c]/95 backdrop-blur-md border-cyan-500/30 text-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs px-2 mb-2">
              <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${isWhite ? 'text-blue-800' : 'text-cyan-300'}`}>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Option B: Schnellnavigation</span>
              </span>
              <span className={`text-[11px] ${isWhite ? 'text-slate-700' : 'text-slate-400'}`}>
                Klicke auf einen Abschnitt zum Springen
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FORM_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`section-${sec.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                    isWhite
                      ? 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border-slate-200 hover:border-blue-300'
                      : 'bg-slate-900 hover:bg-cyan-950/80 border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200'
                  }`}
                >
                  {sec.stepNumber}. {sec.shortTitle}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Form Cards */}
        {viewMode === 'wizard' ? (
          <div className="transition-all duration-300">
            {renderSectionCard(activeSection)}
          </div>
        ) : (
          <div className="space-y-8">
            {FORM_SECTIONS.map((section) => (
              <div key={section.id}>
                {renderSectionCard(section)}
              </div>
            ))}
          </div>
        )}

        {/* Wizard Navigation Footer */}
        {viewMode === 'wizard' && (
          <div className={`mt-8 flex items-center justify-between gap-4 pt-6 border-t ${isWhite ? 'border-slate-200' : 'border-slate-800'}`}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                  isWhite
                    ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zurück</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-900/25 transition-all flex items-center gap-2 group"
              >
                <span>Weiter zu Schritt {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white font-extrabold text-base shadow-xl shadow-blue-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Werte werden übermittelt...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Vitalcheck jetzt kostenlos absenden</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Compact Mode Bottom Submit Box */}
        {viewMode === 'compact' && (
          <div
            className={`mt-10 p-8 rounded-2xl border text-center shadow-lg ${
              isWhite
                ? 'bg-white border-slate-200/90 shadow-slate-200/50'
                : 'bg-[#091533] border-cyan-500/40 text-white'
            }`}
          >
            <h3 className={`text-xl sm:text-2xl font-heading font-extrabold mb-2 ${isWhite ? 'text-slate-900' : 'text-white'}`}>
              Bereit für deine persönliche Vitalitätsanalyse?
            </h3>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 ${isWhite ? 'text-slate-600' : 'text-slate-300'}`}>
              Klicke jetzt auf den Button, um deine 69 Punkte an Julia & Jens zu übermitteln. Du erhältst sofort dein vorläufiges Profil.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-900/30 transition-all inline-flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Übermittle deine Angaben...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Meinen Vitalcheck jetzt absenden</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  // Helper to render each section card
  function renderSectionCard(section: typeof FORM_SECTIONS[0]) {
    return (
      <div
        id={`section-${section.id}`}
        className={`rounded-2xl scroll-mt-32 border p-5 sm:p-8 transition-colors ${
          isWhite
            ? 'bg-white border-slate-200/90 shadow-md shadow-slate-200/50 text-slate-900'
            : 'bg-gradient-to-b from-[#0c183a] via-[#091430] to-[#070e22] border-cyan-500/20 shadow-xl text-white'
        }`}
      >
        {/* Section Header */}
        <div className={`border-b pb-5 mb-6 ${isWhite ? 'border-slate-100' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isWhite ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-cyan-400'}`}>
              Abschnitt {section.stepNumber} von 7
            </span>
            <span className={`text-xs ${isWhite ? 'text-slate-600' : 'text-slate-400'}`}>
              {section.questions.length} Hauptthemen
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-heading font-extrabold mt-2 ${isWhite ? 'text-slate-900' : 'text-white'}`}>
            {section.title}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-300'}`}>
            {section.description}
          </p>
        </div>

        {/* Question Items */}
        <div className="space-y-8">
          {section.questions.map((q) => (
            <div key={q.id} className="pt-2">
              
              {/* Question Title & Subtitle */}
              <div className="mb-3">
                <label className={`block text-sm sm:text-base font-bold ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                  {q.title}
                  {q.required && (
                    <span className="text-blue-600 ml-1 font-extrabold" title="Erforderlich">
                      *
                    </span>
                  )}
                </label>
                {q.subtitle && (
                  <p className={`text-xs mt-1 leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-300'}`}>
                    {q.subtitle}
                  </p>
                )}
              </div>

              {/* Text / Textarea Input */}
              {q.type === 'text' && (
                <div>
                  <input
                    type="text"
                    required={q.required}
                    value={(responses as any)[q.id] || ''}
                    onChange={(e) => handleTextChange(q.id as keyof FormResponses, e.target.value)}
                    placeholder={q.placeholder || 'Deine Antwort...'}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      isWhite
                        ? 'bg-slate-50/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-[#060c1d] border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {q.type === 'textarea' && (
                <div>
                  <textarea
                    rows={4}
                    required={q.required}
                    value={(responses as any)[q.id] || ''}
                    onChange={(e) => handleTextChange(q.id as keyof FormResponses, e.target.value)}
                    placeholder={q.placeholder || 'Hier eingeben...'}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-y ${
                      isWhite
                        ? 'bg-slate-50/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-[#060c1d] border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Multi Choice (e.g. Ziele) */}
              {q.type === 'multi-choice' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = responses.goals.includes(opt);
                    return (
                      <div
                        key={opt}
                        onClick={() => handleGoalToggle(opt)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center gap-3 select-none ${
                          isSelected
                            ? isWhite
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-cyan-950/70 border-cyan-400 text-white shadow-md'
                            : isWhite
                            ? 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                            : 'bg-[#060c1d] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : isWhite
                              ? 'border-slate-300 bg-white'
                              : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Single Choice (e.g. Rauchen, Sportfrequenz, Diabetes-Typ) */}
              {q.type === 'single-choice' && q.options && q.id !== 'energyLevel' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {q.options.map((opt) => {
                    const currentVal = (responses as any)[q.id];
                    const isSelected = currentVal === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleTextChange(q.id as keyof FormResponses, opt)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center gap-3 select-none ${
                          isSelected
                            ? isWhite
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-blue-950/80 border-cyan-400 text-white shadow-md'
                            : isWhite
                            ? 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                            : 'bg-[#060c1d] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : isWhite
                              ? 'border-slate-300 bg-white'
                              : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interactive Energy Level Selector (10% bis 100%) */}
              {q.id === 'energyLevel' && q.options && (
                <div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-3">
                    {q.options.map((pct) => {
                      const isSelected = responses.energyLevel === pct;
                      const num = parseInt(pct, 10);
                      const colorClass = isWhite
                        ? num <= 30
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : num <= 60
                          ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        : num <= 30
                        ? 'border-red-500/40 text-red-300'
                        : num <= 60
                        ? 'border-amber-500/40 text-amber-300'
                        : 'border-emerald-500/40 text-emerald-300';

                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleTextChange('energyLevel', pct)}
                          className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-bold transition-all border ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-md scale-105 ring-2 ring-blue-500 font-extrabold'
                              : isWhite
                              ? `bg-slate-50/80 ${colorClass}`
                              : `bg-[#060c1d] ${colorClass}`
                          }`}
                        >
                          {pct}
                        </button>
                      );
                    })}
                  </div>
                  <div className={`flex items-center justify-between text-[11px] px-1 ${isWhite ? 'text-slate-600' : 'text-slate-400'}`}>
                    <span className="text-red-500 font-medium">10%: Kaum Energie / Ausgebrannt</span>
                    <span className="text-amber-500 font-medium">50%: Durchschnittlich</span>
                    <span className="text-emerald-600 font-medium">100%: Voller Vitalität & Tatendrang</span>
                  </div>
                </div>
              )}

              {/* Matrix Question (Desktop Table + Mobile Responsive Cards) */}
              {q.type === 'matrix' && q.rows && q.columns && (
                <div className="mt-3">
                  
                  {/* Desktop Table View */}
                  <div className={`hidden md:block overflow-x-auto rounded-xl border ${isWhite ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#060c1d]/90'}`}>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b ${isWhite ? 'bg-slate-100/90 text-slate-800 border-slate-200' : 'bg-slate-900/60 text-slate-300 border-slate-800'}`}>
                          <th className="py-3 px-4 font-bold w-2/5">Aussage / Bereich</th>
                          {q.columns.map((col) => (
                            <th key={col.id} className="py-3 px-2 text-center font-semibold">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isWhite ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
                        {q.rows.map((row) => {
                          const matrixData = (responses as any)[q.id] || {};
                          const selectedVal = matrixData[row.id];

                          return (
                            <tr key={row.id} className={`transition-colors ${isWhite ? 'hover:bg-blue-50/40 text-slate-800' : 'hover:bg-slate-800/30 text-slate-200'}`}>
                              <td className={`py-3 px-4 font-medium ${isWhite ? 'text-slate-900' : 'text-slate-200'}`}>
                                {row.text}
                              </td>
                              {q.columns!.map((col) => {
                                const isChecked = selectedVal === String(col.id);
                                return (
                                  <td
                                    key={col.id}
                                    onClick={() => handleMatrixChange(q.id as any, row.id, String(col.id))}
                                    className="py-3 px-2 text-center cursor-pointer"
                                  >
                                    <div className="flex items-center justify-center">
                                      <div
                                        className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                                          isChecked
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                                            : isWhite
                                            ? 'border-slate-300 bg-white hover:border-blue-400'
                                            : 'border-slate-600 bg-slate-900 hover:border-cyan-500'
                                        }`}
                                      >
                                        {isChecked && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Responsive Matrix Layout */}
                  <div className="md:hidden space-y-3.5">
                    {q.rows.map((row) => {
                      const matrixData = (responses as any)[q.id] || {};
                      const selectedVal = matrixData[row.id];

                      return (
                        <div
                          key={row.id}
                          className={`p-3.5 rounded-xl border space-y-2.5 ${isWhite ? 'bg-slate-50/90 border-slate-200 text-slate-900' : 'bg-[#060c1d] border-slate-800 text-white'}`}
                        >
                          <div className={`text-xs sm:text-sm font-semibold ${isWhite ? 'text-slate-900' : 'text-slate-200'}`}>
                            {row.text}
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                            {q.columns!.map((col) => {
                              const isChecked = selectedVal === String(col.id);
                              return (
                                <button
                                  key={col.id}
                                  type="button"
                                  onClick={() => handleMatrixChange(q.id as any, row.id, String(col.id))}
                                  className={`py-2 px-1 text-[11px] rounded-lg font-medium border text-center transition-all ${
                                    isChecked
                                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                                      : isWhite
                                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                      : 'bg-slate-900 border-slate-800 text-slate-300'
                                  }`}
                                >
                                  {col.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          ))}

          {/* Section 7 specific: Privacy Agreement checkbox */}
          {section.stepNumber === 7 && (
            <div className={`pt-4 border-t ${isWhite ? 'border-slate-100' : 'border-slate-800/80'}`}>
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  required
                  checked={responses.privacyAccepted}
                  onChange={(e) => handleTextChange('privacyAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-xs leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-300'}`}>
                  <strong className={isWhite ? 'text-slate-900' : 'text-white'}>Datenschutz & Auswertungseinwilligung:</strong>{' '}
                  Ich bin damit einverstanden, dass meine eingegebenen Daten von Julia & Jens zur Erstellung meiner individuellen Vitalanalyse verarbeitet und gespeichert werden. Meine Daten werden nicht an unbefugte Dritte weitergegeben. Ich kann diese Einwilligung jederzeit für die Zukunft widerrufen.
                </span>
              </label>
            </div>
          )}

        </div>
      </div>
    );
  }
};
