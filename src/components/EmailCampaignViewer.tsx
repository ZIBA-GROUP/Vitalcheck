import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Sparkles,
  User,
  Clock,
  Send,
  Zap,
  Tag,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { OMNI_COPY_STRATEGY, EmailItem } from '../data/emailSequence';

export const EmailCampaignViewer: React.FC = () => {
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  // Version B (Emotionale / Halbert Betreffzeilen & Hooks) als Favorit standardmäßig aktiv
  const [subjectVersion, setSubjectVersion] = useState<'B' | 'A'>('B');

  const currentEmail: EmailItem = OMNI_COPY_STRATEGY.emails[selectedEmailIndex];

  const primarySubject = subjectVersion === 'B' 
    ? (currentEmail.subjectLines[1] || currentEmail.subjectLines[0])
    : currentEmail.subjectLines[0];

  const secondarySubject = subjectVersion === 'B'
    ? currentEmail.subjectLines[0]
    : (currentEmail.subjectLines[1] || currentEmail.subjectLines[0]);

  const handleCopyEmail = (email: EmailItem, index: number) => {
    const activeSub = subjectVersion === 'B' ? (email.subjectLines[1] || email.subjectLines[0]) : email.subjectLines[0];
    const altSub = subjectVersion === 'B' ? email.subjectLines[0] : (email.subjectLines[1] || email.subjectLines[0]);
    const fullText = `BETREFF (${subjectVersion === 'B' ? 'VERSION B' : 'VERSION A'}): ${activeSub}\nALTERNATIVE BETREFFZEILE: ${altSub}\nPREVIEW-TEXT: ${email.previewText}\n\n${email.headline}\n\n${email.bodyMarkdown}\n\nCTA: ${email.ctaText} (${email.ctaUrlPlaceholder})`;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyFullCampaign = () => {
    const campaignMarkdown = `# 7-TEILIGE E-MAIL-SERIE (OMNI-COPY-STRATEGIST)
Expert: ${OMNI_COPY_STRATEGY.expert} (Gary Halbert Framework)
Zielgruppe: ${OMNI_COPY_STRATEGY.targetAudience}
Strategie: ${OMNI_COPY_STRATEGY.decision}

` + OMNI_COPY_STRATEGY.emails.map((e) => `
==================================================
E-MAIL #${e.number}: ${e.day} (${e.trigger})
Fokus: ${e.frameworkFocus}
Betreff 1: ${e.subjectLines[0]}
Betreff 2: ${e.subjectLines[1]}
Vorschautext: ${e.previewText}
==================================================

# ${e.headline}

${e.bodyMarkdown}

CTA:
${e.ctaText}
Link: ${e.ctaUrlPlaceholder}
`).join('\n\n');

    navigator.clipboard.writeText(campaignMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Omni-Copy Strategy Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0e1a38] via-[#12224d] to-[#070e20] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Omni-Copy-Strategist Framework
            </span>
            <span className="text-xs text-slate-400">
              Optimal für Klick-Tipp, Brevo, ActiveCampaign & CleverReach
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            7-teilige E-Mail-Follow-up-Serie für deinen Vitalcheck
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 font-medium mb-1">1. ANALYSE (Marktsituation)</div>
              <p className="text-slate-200 leading-relaxed">
                {OMNI_COPY_STRATEGY.analysis}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30">
              <div className="text-amber-400 font-bold mb-1">2. ENTSCHEIDUNG (Gewählter Experte)</div>
              <p className="text-white font-medium leading-relaxed">
                <strong>GARY HALBERT:</strong> {OMNI_COPY_STRATEGY.decision}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 font-medium mb-1">3. THE FREEDOM LOOK FORMAT</div>
              <p className="text-slate-200 leading-relaxed">
                Markante UPPERCASE-Headlines, packende Storytelling-Absätze, kein Corporate-Bla-Bla, unübersehbare CTAs zur Terminbuchung.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-300">
              Diese E-Mail-Serie konvertiert eingetragene Vitalcheck-Leads mit maximaler Dringlichkeit in persönliche 1:1 Beratungsgespräche mit Julia & Jens.
            </p>
            <button
              onClick={handleCopyFullCampaign}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Gesamte Serie kopiert!' : 'Alle 7 E-Mails kopieren'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewer Layout: Sidebar with 7 Email Steps + Live Email Client Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Email Index Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            E-Mail Sequenz (Tag 0 bis 6)
          </div>

          {OMNI_COPY_STRATEGY.emails.map((email, idx) => {
            const isSelected = selectedEmailIndex === idx;
            return (
              <div
                key={email.number}
                onClick={() => setSelectedEmailIndex(idx)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-950 to-cyan-950 border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#08122a] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                    E-Mail #{email.number} • {email.day}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {email.trigger.split('(')[0]}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {email.subjectLines[0]}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {email.previewText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Email Preview Panel */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl bg-[#09132c] border border-cyan-500/25 shadow-2xl overflow-hidden">
            
            {/* Fake Email Client Toolbar */}
            <div className="bg-[#060c1c] px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  E-Mail Preview: #{currentEmail.number} ({currentEmail.day})
                </span>
              </div>

              <button
                onClick={() => handleCopyEmail(currentEmail, selectedEmailIndex)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                {copiedIndex === selectedEmailIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">In Zwischenablage kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Diese E-Mail kopieren</span>
                  </>
                )}
              </button>
            </div>

            {/* Version Switcher Bar */}
            <div className="px-6 py-2.5 bg-[#070e20] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-400">Betreffzeilen-Strategie:</span>
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubjectVersion('B')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    subjectVersion === 'B'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Version B: Emotional & Story (Favorit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectVersion('A')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    subjectVersion === 'A'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Version A: Sachlich</span>
                </button>
              </div>
            </div>

            {/* Email Meta Details */}
            <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold w-24">Absender:</span>
                <span className="text-white font-medium">Julia & Jens &lt;vitalcheck@deinedomain.de&gt;</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-semibold w-24 flex-shrink-0">
                  Betreff ({subjectVersion === 'B' ? 'Version B' : 'Version A'}):
                </span>
                <span className="text-cyan-200 font-bold text-sm bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  {primarySubject}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-semibold w-24 flex-shrink-0">
                  Alternative ({subjectVersion === 'B' ? 'Version A' : 'Version B'}):
                </span>
                <span className="text-slate-400 italic">
                  {secondarySubject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold w-24">Preview-Text:</span>
                <span className="text-slate-300">{currentEmail.previewText}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-400 font-semibold w-24">Trigger / Taktung:</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[11px]">
                  {currentEmail.trigger}
                </span>
              </div>
            </div>

            {/* Email Body Rendering in Freedom Look */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed">
              
              {/* Bold Uppercase Headline */}
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight border-l-4 border-cyan-400 pl-4">
                {currentEmail.headline}
              </h3>

              {/* Body Paragraphs */}
              <div className="whitespace-pre-line font-normal text-slate-300 leading-relaxed space-y-4">
                {currentEmail.bodyMarkdown}
              </div>

              {/* Freedom Look CTA Button */}
              <div className="pt-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-cyan-950 to-slate-900 border border-cyan-400/40 text-center">
                  <div className="text-xs text-cyan-300 uppercase font-bold tracking-wider mb-2">
                    Klick-Aufforderung (CTA)
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Hier wird dein Buchungslink hinterlegt: ${currentEmail.ctaUrlPlaceholder}`);
                    }}
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    {currentEmail.ctaText}
                  </a>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Ziel-Link: {currentEmail.ctaUrlPlaceholder}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
