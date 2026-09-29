import React, { useState } from 'react';
import {
  Users,
  Download,
  Search,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { LeadSubmission } from '../types';
import { exportLeadsToCsv } from '../services/emailMarketing';

interface LeadsManagerModalProps {
  leads: LeadSubmission[];
  onClearLeads: () => void;
}

export const LeadsManagerModal: React.FC<LeadsManagerModalProps> = ({ leads, onClearLeads }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);

  const filteredLeads = leads.filter(
    (l) =>
      l.responses.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.responses.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.responses.phone.includes(searchTerm) ||
      l.responses.zipCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCsv = () => {
    const csvContent = exportLeadsToCsv(leads);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vitalcheck_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c183a] via-[#102354] to-[#070e20] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Users className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-white">
              Eingegangene Vitalcheck Leads ({leads.length})
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200">
              Übersicht aller erfassten Teilnehmer, Vitalitäts-Scores und Antworten
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <>
              <button
                onClick={handleDownloadCsv}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Als CSV / Excel exportieren</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Möchtest du wirklich alle lokal gespeicherten Leads löschen?')) {
                    onClearLeads();
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Lokal gespeicherte Leads leeren"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-[#09132c] p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Leads durchsuchen (Name, E-Mail, Telefon, Ort)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#060c1d] border border-slate-700/80 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none"
          />
        </div>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#08122a] border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Noch keine Leads eingegangen</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Fülle das Vitalcheck-Formular aus, um einen Test-Lead zu generieren. Er erscheint sofort hier in deiner Inbox.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#09132c] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold">Teilnehmer</th>
                  <th className="py-3.5 px-4 font-semibold">Kontakt</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Score</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Energie</th>
                  <th className="py-3.5 px-4 font-semibold">Datum</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {lead.responses.fullName || 'Unbenannt'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.responses.zipCity || '-'}
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-cyan-300 font-mono text-[11px]">
                        {lead.responses.email}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {lead.responses.phone}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold font-heading">
                        {lead.vitalityScore.overall}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 font-semibold text-[11px]">
                        {lead.responses.energyLevel || '-'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(lead.timestamp).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#09132c] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                  Lead-Detailansicht
                </span>
                <h3 className="text-2xl font-bold font-heading text-white">
                  {selectedLead.responses.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick summary badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Vitalitäts-Score</div>
                <div className="text-2xl font-bold text-cyan-400 font-heading">
                  {selectedLead.vitalityScore.overall}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Energielevel</div>
                <div className="text-2xl font-bold text-emerald-400 font-heading">
                  {selectedLead.responses.energyLevel}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Säure-Balance</div>
                <div className="text-2xl font-bold text-amber-400 font-heading">
                  {selectedLead.vitalityScore.acidScore}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Regeneration</div>
                <div className="text-2xl font-bold text-indigo-400 font-heading">
                  {selectedLead.vitalityScore.recoveryScore}%
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">E-Mail:</span>
                  <a href={`mailto:${selectedLead.responses.email}`} className="text-cyan-300 font-medium hover:underline">
                    {selectedLead.responses.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Telefon:</span>
                  <a href={`tel:${selectedLead.responses.phone}`} className="text-white font-medium hover:underline">
                    {selectedLead.responses.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Adresse:</span>
                  <span className="text-slate-200">
                    {selectedLead.responses.street}, {selectedLead.responses.zipCity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Geburtsdatum:</span>
                  <span className="text-slate-200">{selectedLead.responses.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Empfohlen von:</span>
                  <span className="text-cyan-200 font-semibold">{selectedLead.responses.referralPerson}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sport / Rauchen:</span>
                  <span className="text-slate-200">
                    {selectedLead.responses.sportFrequency} | Raucher: {selectedLead.responses.smoker}
                  </span>
                </div>
              </div>
            </div>

            {/* Goals & Challenges */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20">
                <strong className="text-cyan-300 block mb-1">Ausgewählte Hauptziele:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedLead.responses.goals.map((g) => (
                    <span key={g} className="px-2.5 py-1 rounded-md bg-blue-900/60 text-cyan-200 border border-blue-500/30">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">3 große Herausforderungen / Ziele:</strong>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedLead.responses.top3Goals}
                </p>
              </div>

              {selectedLead.responses.unsupportedFoods && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400 block">Unverträgliche Lebensmittel:</strong>
                  <p className="text-slate-300">{selectedLead.responses.unsupportedFoods}</p>
                </div>
              )}

              {selectedLead.responses.additionalNotes && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400 block">Wichtige Zusatzinformationen / Gesundheit:</strong>
                  <p className="text-slate-300 whitespace-pre-line">{selectedLead.responses.additionalNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Schließen
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
