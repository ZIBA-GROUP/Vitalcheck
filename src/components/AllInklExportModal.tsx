import React, { useState } from 'react';
import {
  Server,
  FileCode,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Shield,
  HelpCircle,
  FolderArchive,
  Terminal,
} from 'lucide-react';
import { generateAllInklPhpScript, generateAllInklHtaccess } from '../utils/allInklExport';

interface AllInklExportModalProps {
  webhookUrl?: string;
}

export const AllInklExportModal: React.FC<AllInklExportModalProps> = ({ webhookUrl = '' }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'php' | 'htaccess'>('guide');
  const [notificationEmail, setNotificationEmail] = useState<string>('zirkelbachklaus@gmail.com');
  const [copiedPhp, setCopiedPhp] = useState<boolean>(false);
  const [copiedHtaccess, setCopiedHtaccess] = useState<boolean>(false);

  const phpScriptContent = generateAllInklPhpScript(notificationEmail, webhookUrl);
  const htaccessContent = generateAllInklHtaccess();

  const handleCopyPhp = () => {
    navigator.clipboard.writeText(phpScriptContent);
    setCopiedPhp(true);
    setTimeout(() => setCopiedPhp(false), 2500);
  };

  const handleDownloadPhp = () => {
    const blob = new Blob([phpScriptContent], { type: 'text/x-php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'process-form.php';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtaccess = () => {
    navigator.clipboard.writeText(htaccessContent);
    setCopiedHtaccess(true);
    setTimeout(() => setCopiedHtaccess(false), 2500);
  };

  const handleDownloadHtaccess = () => {
    const blob = new Blob([htaccessContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.htaccess';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c183a] via-[#102354] to-[#070e20] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Server className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-white">
                All-Inkl Hosting & Deployment Hub
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200">
                Lade die fertige Vitalcheck-Seite auf deine eigene All-Inkl Domain hoch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPhp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>process-form.php</span>
            </button>
            <button
              onClick={handleDownloadHtaccess}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>.htaccess</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          All-Inkl.com bietet zuverlässiges deutsches Apache/PHP-Webhosting. Dieses Paket enthält 
          die serverseitige Formularverarbeitung, die automatische E-Mail-Benachrichtigung an deine Adresse, 
          lokale Lead-Speicherung (CSV) und die Weiterleitung an dein E-Mail-Marketing-Tool.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#09132c] rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>1. Schritt-für-Schritt FTP Anleitung</span>
        </button>

        <button
          onClick={() => setActiveTab('php')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'php'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>2. process-form.php (Backend)</span>
        </button>

        <button
          onClick={() => setActiveTab('htaccess')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'htaccess'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>3. .htaccess (Sicherheit & Speed)</span>
        </button>
      </div>

      {/* Tab 1: Step-by-step Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#09132c] border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Projekt bauen (Build)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Führe lokal im Terminal <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300">npm run build</code> aus. Es entsteht der Ordner <code className="text-white font-mono">dist/</code> mit optimierten HTML/JS/CSS-Dateien.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#09132c] border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-sm">In All-Inkl einloggen</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Logge dich in das <strong>All-Inkl KAS</strong> (oder via FTP Client wie FileZilla) mit deinen Zugangsdaten (<code className="text-slate-400">w0xxxxxx</code>) ein.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#09132c] border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Dateien hochladen</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kopiere den gesamten Inhalt von <code className="text-white font-mono">dist/</code> in das Verzeichnis deiner Domain (z.B. <code className="text-slate-400">/www/htdocs/w0.../vitalcheck/</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#09132c] border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-white text-sm">PHP & .htaccess ablegen</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lade <code className="text-cyan-300 font-mono">process-form.php</code> und <code className="text-cyan-300 font-mono">.htaccess</code> in denselben Ordner neben die <code className="text-white font-mono">index.html</code>. Fertig!
              </p>
            </div>

          </div>

          <div className="p-6 rounded-2xl bg-[#08122a] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Vorteile dieser All-Inkl Architektur
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">Blitzschnelle Ladezeit (Pure Static & PHP)</strong>
                Kein schwerfälliges WordPress, keine Plugin-Updates nötig, 100% geschützt vor WordPress-Sicherheitslücken.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">DSGVO & Deutsches Rechenzentrum</strong>
                All-Inkl hostet auf ISO-27001 zertifizierten Servern in Deutschland mit vollem Auftragsverarbeitungsvertrag (AVV).
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">Doppelte Sicherheit für Leads</strong>
                Selbst wenn ein E-Mail-Dienst mal Ausfall hat: Jeder Lead wird sicher in einer geschützten CSV-Datei auf deinem Server protokolliert.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">Nahtlose Webhook-Verknüpfung</strong>
                Die Datei leitet Leads serverseitig mit PHP cURL weiter – völlig unabhängig von Browser-Restriktionen oder Adblockern.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: process-form.php */}
      {activeTab === 'php' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#09132c] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">
                Deine E-Mail-Adresse für sofortige Benachrichtigungen:
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPhp}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                {copiedPhp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPhp ? 'Kopiert!' : 'Code kopieren'}</span>
              </button>
              <button
                onClick={handleDownloadPhp}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Als Datei speichern</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#050b18] border border-slate-800 p-4 overflow-x-auto">
            <pre className="text-[12px] font-mono text-cyan-200 leading-relaxed">
              <code>{phpScriptContent}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: .htaccess */}
      {activeTab === 'htaccess' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#09132c] border border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              Diese Konfigurationsdatei schützt deine Lead-CSV-Datei vor unbefugtem Web-Download und schaltet HTTPS ein.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtaccess}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                {copiedHtaccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHtaccess ? 'Kopiert!' : 'Code kopieren'}</span>
              </button>
              <button
                onClick={handleDownloadHtaccess}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Als .htaccess speichern</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#050b18] border border-slate-800 p-4 overflow-x-auto">
            <pre className="text-[12px] font-mono text-emerald-300 leading-relaxed">
              <code>{htaccessContent}</code>
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
