import React from 'react';
import { ShieldCheck, Lock, Award } from 'lucide-react';

interface FooterProps {
  isWhite?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isWhite = false }) => {
  return (
    <footer
      className={`mt-20 border-t py-12 px-4 sm:px-6 lg:px-8 transition-colors ${
        isWhite
          ? 'bg-slate-100 border-slate-200 text-slate-600'
          : 'bg-[#050b18] border-slate-800/80 text-slate-400'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Trust & Guarantee Badges */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b ${
            isWhite ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isWhite
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                100% Vertraulich & Diskret
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-400'}`}>
                Deine Gesundheitsdaten werden ausschließlich für deine persönliche Vitalanalyse genutzt und streng vertraulich behandelt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isWhite
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
              }`}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                DSGVO-konforme Übertragung
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-400'}`}>
                Verschlüsselte SSL-Verbindung auf ISO-27001 zertifizierten All-Inkl Rechenzentren in Deutschland.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isWhite
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                Ganzheitliche Begleitung
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isWhite ? 'text-slate-600' : 'text-slate-400'}`}>
                Individuelle Begleitung durch Julia & Jens – für mehr Vitalität, erholsamen Schlaf und nachhaltiges Wohlbefinden.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer according to HWG */}
        <div
          className={`p-4 rounded-2xl border text-[11px] leading-relaxed space-y-2 ${
            isWhite
              ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
              : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
          }`}
        >
          <p className={`font-semibold ${isWhite ? 'text-slate-900' : 'text-slate-300'}`}>
            Wichtiger gesundheitsbezogener Hinweis (§ 3 HWG):
          </p>
          <p>
            Dieser Vitalcheck und die daraus resultierende Analyse dienen ausschließlich der Information, der allgemeinen Prävention und der Förderung eines gesunden Lebensstils (Ernährung, Vitalstoffe, Bewegung, Entspannung). Sie stellen keine medizinische Beratung, Diagnose oder Behandlung im Sinne der Schulmedizin oder des Heilpraktikergesetzes dar und können den Besuch bei einem approbierten Arzt oder Therapeuten nicht ersetzen.
          </p>
        </div>

        {/* Copyright and Bottom Links */}
        <div className={`flex flex-wrap items-center justify-between gap-4 text-xs pt-4 ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
          <div>
            © {new Date().getFullYear()} Dein Vitalcheck • Julia & Jens • Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#impressum"
              onClick={(e) => { e.preventDefault(); alert('Impressum: Angaben gemäß § 5 TMG durch den Domaininhaber bei All-Inkl zu hinterlegen.'); }}
              className={`transition-colors ${isWhite ? 'hover:text-blue-700' : 'hover:text-cyan-300'}`}
            >
              Impressum
            </a>
            <a
              href="#datenschutz"
              onClick={(e) => { e.preventDefault(); alert('Datenschutz: Die Datenverarbeitung erfolgt auf Grundlage der DSGVO zur Erstellung der Vitalanalyse.'); }}
              className={`transition-colors ${isWhite ? 'hover:text-blue-700' : 'hover:text-cyan-300'}`}
            >
              Datenschutz
            </a>
            <a
              href="#kontakt"
              onClick={(e) => { e.preventDefault(); alert('Kontakt: Julia & Jens Vitalcoaching – Auswertungen & Rückfragen per Mail.'); }}
              className={`transition-colors ${isWhite ? 'hover:text-blue-700' : 'hover:text-cyan-300'}`}
            >
              Kontakt
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
