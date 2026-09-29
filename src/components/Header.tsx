import React from 'react';
import { ShieldCheck, Mail, Database, Server, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'form' | 'email-sequence' | 'email-marketing' | 'all-inkl' | 'leads';
  setActiveTab: (tab: 'form' | 'email-sequence' | 'email-marketing' | 'all-inkl' | 'leads') => void;
  leadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, leadsCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070e22]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setActiveTab('form')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-cyan-500 to-teal-400 p-0.5 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#09122b] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Dein Vitalcheck
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Julia & Jens
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Ganzheitlicher Gesundheits- & Energiecheck
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Vitalcheck</span> Formular
            </button>

            <button
              onClick={() => setActiveTab('email-sequence')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 relative ${
                activeTab === 'email-sequence'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Omni-Copy-Strategist: 7-teilige E-Mail-Serie"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">7-Tage</span> E-Mail-Serie
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-bold">
                Copy
              </span>
            </button>

            <button
              onClick={() => setActiveTab('email-marketing')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'email-marketing'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">E-Mail</span> Anbindung
            </button>

            <button
              onClick={() => setActiveTab('all-inkl')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'all-inkl'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>All-Inkl</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'leads'
                  ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Leads</span>
              {leadsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] rounded-full bg-cyan-500 text-slate-950 font-extrabold">
                  {leadsCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
