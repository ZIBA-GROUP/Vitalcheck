import React from 'react';
import { CheckCircle2, Sparkles, PhoneCall, Calendar, ArrowRight, Printer, Download, HeartHandshake, ShieldCheck } from 'lucide-react';
import { LeadSubmission } from '../types';

interface SubmissionSuccessModalProps {
  submission: LeadSubmission;
  onClose: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({ submission, onClose }) => {
  const { responses, vitalityScore } = submission;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e1a38] via-[#09132b] to-[#060c1d] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/25 mb-4">
            <div className="w-full h-full bg-[#0a142e] rounded-[14px] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Vielen Dank für deine Antwort!
          </h2>
          <p className="mt-2 text-base text-cyan-200 font-medium">
            Wir haben deinen Vitalcheck erfolgreich empfangen und melden uns bei dir.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Herzliche Grüße, <span className="text-white font-semibold">Julia & Jens</span>
          </p>
        </div>

        {/* Vitalitäts-Scorecard Breakdown */}
        <div className="mt-6 p-5 rounded-xl bg-slate-900/80 border border-cyan-500/25 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Vorläufiges Vitalitäts-Profil
            </span>
            <span className="text-xs text-slate-400">
              Teilnehmer: <strong className="text-slate-200">{responses.fullName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-center">
              <div className="text-xs text-slate-400 font-medium">Gesamt-Vitalität</div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-cyan-300 mt-0.5">
                {vitalityScore.overall}%
              </div>
              <div className="text-[10px] text-cyan-500 font-semibold mt-0.5">Potenzial</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-center">
              <div className="text-xs text-slate-400 font-medium">Energielevel</div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-emerald-400 mt-0.5">
                {vitalityScore.energyScore}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Selbsteinschätzung</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-center">
              <div className="text-xs text-slate-400 font-medium">Säure-Basen</div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-amber-300 mt-0.5">
                {vitalityScore.acidScore}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Balance-Index</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-center">
              <div className="text-xs text-slate-400 font-medium">Regeneration</div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-indigo-300 mt-0.5">
                {vitalityScore.recoveryScore}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Erholungsrate</div>
            </div>
          </div>

          {/* Quick summary notes */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
            <p>
              <strong className="text-cyan-300">Deine ausgewählten Schwerpunkte:</strong>{' '}
              {responses.goals.length > 0 ? responses.goals.join(', ') : 'Ganzheitliche Vitalität'}
            </p>
            {responses.top3Goals && (
              <p className="italic text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800">
                "{responses.top3Goals.length > 130 ? responses.top3Goals.substring(0, 130) + '...' : responses.top3Goals}"
              </p>
            )}
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-cyan-950/70 border border-cyan-500/30 text-center sm:text-left sm:flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Möchtest du dein Feedback noch schneller erhalten?
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Wir haben uns diese Woche für Vitalcheck-Teilnehmer exklusive 15-Minuten-Gesprächsfenster reserviert.
            </p>
          </div>
          <button
            onClick={() => {
              alert('Terminbuchung: Hier wird dein Calendly- oder Buchungs-Link eingebunden (z.B. Calendly / Terminpilot).');
            }}
            className="mt-3 sm:mt-0 flex-shrink-0 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Auswertungs-Call wählen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Zusammenfassung drucken / PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
