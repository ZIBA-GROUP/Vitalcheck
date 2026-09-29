import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VitalForm } from './components/VitalForm';
import { EmailCampaignViewer } from './components/EmailCampaignViewer';
import { EmailMarketingModal } from './components/EmailMarketingModal';
import { AllInklExportModal } from './components/AllInklExportModal';
import { LeadsManagerModal } from './components/LeadsManagerModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { Footer } from './components/Footer';
import { EmailMarketingConfig, LeadSubmission } from './types';
import { loadEmailConfig, loadSavedLeads } from './services/emailMarketing';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'email-sequence' | 'email-marketing' | 'all-inkl' | 'leads'>('form');
  const [emailConfig, setEmailConfig] = useState<EmailMarketingConfig>(loadEmailConfig());
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [lastSubmission, setLastSubmission] = useState<LeadSubmission | null>(null);
  
  // Option B: Oben Navy Blau Verlauf + Unterer Teil Weiß (Standardmäßig aktiv)
  const [themeVariant, setThemeVariant] = useState<'navy-white' | 'dark'>('navy-white');

  useEffect(() => {
    setLeads(loadSavedLeads());
  }, []);

  const handleSubmissionSuccess = (submission: LeadSubmission) => {
    setLeads((prev) => [submission, ...prev]);
    setLastSubmission(submission);
  };

  const handleClearLeads = () => {
    localStorage.removeItem('vitalcheck_leads_v1');
    setLeads([]);
  };

  const isWhite = themeVariant === 'navy-white';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors ${
        isWhite
          ? 'bg-slate-50 text-slate-900'
          : 'bg-gradient-to-b from-[#070d1f] via-[#0d1a3c] to-[#050a16] text-slate-100'
      }`}
    >
      {/* Navigation Header (Immer im edlen Navy Blau) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leadsCount={leads.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'form' && (
          <VitalForm
            emailConfig={emailConfig}
            onSubmissionSuccess={handleSubmissionSuccess}
            onOpenEmailConfig={() => setActiveTab('email-marketing')}
            onOpenAllInkl={() => setActiveTab('all-inkl')}
            themeVariant={themeVariant}
            setThemeVariant={setThemeVariant}
          />
        )}

        {activeTab === 'email-sequence' && (
          <EmailCampaignViewer />
        )}

        {activeTab === 'email-marketing' && (
          <EmailMarketingModal
            config={emailConfig}
            onUpdateConfig={(newCfg) => setEmailConfig(newCfg)}
          />
        )}

        {activeTab === 'all-inkl' && (
          <AllInklExportModal webhookUrl={emailConfig.webhookUrl} />
        )}

        {activeTab === 'leads' && (
          <LeadsManagerModal
            leads={leads}
            onClearLeads={handleClearLeads}
          />
        )}
      </main>

      {/* Submission Success & Vitality Evaluation Modal */}
      {lastSubmission && (
        <SubmissionSuccessModal
          submission={lastSubmission}
          onClose={() => setLastSubmission(null)}
        />
      )}

      {/* Footer */}
      <Footer isWhite={isWhite} />
    </div>
  );
}
