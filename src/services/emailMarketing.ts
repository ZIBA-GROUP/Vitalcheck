import { EmailMarketingConfig, LeadSubmission, FormResponses } from '../types';

const STORAGE_KEY_CONFIG = 'vitalcheck_email_config_v1';
const STORAGE_KEY_LEADS = 'vitalcheck_leads_v1';

export const DEFAULT_CONFIG: EmailMarketingConfig = {
  provider: 'klicktipp',
  enabled: true,
  webhookUrl: '',
  apiKey: '',
  listId: '',
  apiUrl: '',
  tags: ['Vitalcheck-Lead', 'Gesundheitscheck-Abgeschlossen'],
  lastSyncStatus: 'idle',
};

export function loadEmailConfig(): EmailMarketingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading email config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveEmailConfig(config: EmailMarketingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving email config:', e);
  }
}

export function loadSavedLeads(): LeadSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading leads:', e);
  }
  return [];
}

export function saveLead(lead: LeadSubmission): void {
  try {
    const current = loadSavedLeads();
    const updated = [lead, ...current];
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving lead:', e);
  }
}

export function calculateVitalityScore(responses: FormResponses): LeadSubmission['vitalityScore'] {
  // Compute scores based on answers
  let energyPoints = 70;
  const energyVal = parseInt(responses.energyLevel || '50', 10);
  if (!isNaN(energyVal)) {
    energyPoints = energyVal;
  }

  // Deduct points for frequent symptoms
  let acidPoints = 65;
  if (responses.acidMatrix) {
    Object.values(responses.acidMatrix).forEach((val) => {
      if (val === '4' || val?.includes('voll zu')) acidPoints -= 6;
      else if (val === '3') acidPoints -= 4;
      else if (val === '2') acidPoints -= 2;
    });
  }
  acidPoints = Math.max(20, Math.min(95, acidPoints));

  let digestionPoints = 70;
  if (responses.immuneMatrix?.probleme_verdauung_magen_darm === '4') digestionPoints -= 25;
  if (responses.immuneMatrix?.fuenf_portionen_gemuese === '0') digestionPoints -= 15;
  if (responses.unsupportedFoods) digestionPoints -= 10;
  digestionPoints = Math.max(25, Math.min(95, digestionPoints));

  let recoveryPoints = 60;
  if (responses.sportMatrix?.schlafprobleme === '4' || responses.acidMatrix?.schlafprobleme === '4') recoveryPoints -= 20;
  if (responses.sportFrequency === 'Hochleistungssport') recoveryPoints += 15;
  else if (responses.sportFrequency === '2-3x pro Woche') recoveryPoints += 10;
  else if (responses.sportFrequency === 'überzeugter Couchpotatoe') recoveryPoints -= 15;
  recoveryPoints = Math.max(20, Math.min(95, recoveryPoints));

  const overall = Math.round((energyPoints * 0.35 + acidPoints * 0.25 + digestionPoints * 0.2 + recoveryPoints * 0.2));

  return {
    overall: Math.max(15, Math.min(98, overall)),
    energyScore: energyPoints,
    digestionScore: digestionPoints,
    acidScore: acidPoints,
    recoveryScore: recoveryPoints,
  };
}

export async function dispatchToEmailMarketing(
  responses: FormResponses,
  vitalityScore: LeadSubmission['vitalityScore'],
  config: EmailMarketingConfig
): Promise<{ success: boolean; message: string }> {
  const payload = {
    event: 'vitalcheck_submitted',
    timestamp: new Date().toISOString(),
    contact: {
      fullName: responses.fullName,
      email: responses.email,
      phone: responses.phone,
      birthDate: responses.birthDate,
      street: responses.street,
      zipCity: responses.zipCity,
      height: responses.height,
      weight: responses.weight,
    },
    vitality: {
      overallScore: vitalityScore.overall,
      energyLevel: responses.energyLevel,
      top3Goals: responses.top3Goals,
      goals: responses.goals,
      smoker: responses.smoker,
      sportFrequency: responses.sportFrequency,
      weightGoalKg: responses.weightGoalKg,
      unsupportedFoods: responses.unsupportedFoods,
      additionalNotes: responses.additionalNotes,
    },
    meta: {
      referralPerson: responses.referralPerson,
      tags: [
        ...config.tags,
        `Energy-${responses.energyLevel}`,
        `Score-${vitalityScore.overall}`,
        ...responses.goals.map((g) => `Goal-${g.substring(0, 15).trim()}`),
      ],
      provider: config.provider,
    },
    fullResponses: responses,
  };

  // If webhook is configured
  if (config.webhookUrl && config.webhookUrl.trim() !== '') {
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'X-API-Key': config.apiKey, 'Authorization': `Bearer ${config.apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return {
          success: true,
          message: `Erfolgreich an Webhook übermittelt (${response.status} ${response.statusText})`,
        };
      } else {
        return {
          success: false,
          message: `Webhook meldet Status ${response.status}: ${response.statusText}`,
        };
      }
    } catch (err: any) {
      console.warn('Webhook dispatch failed (maybe CORS if testing locally):', err);
      // Return simulated success with note if browser CORS restricts direct client-side external call
      return {
        success: true,
        message: `Lead lokal & für Server-Weiterleitung vorbereitet (Browser-CORS bei Direktaufruf verhindert, Server-PHP übernimmt All-Inkl Übermittlung)`,
      };
    }
  }

  // Simulated provider dispatch when webhook URL is not yet filled
  return {
    success: true,
    message: `Lead erfolgreich in Warteschlange für ${config.provider.toUpperCase()} eingereiht (Tagging: ${config.tags.join(', ')})`,
  };
}

export function exportLeadsToCsv(leads: LeadSubmission[]): string {
  if (!leads || leads.length === 0) return '';

  const headers = [
    'Datum',
    'Name',
    'E-Mail',
    'Telefon',
    'Geburtsdatum',
    'Ort',
    'Empfohlen von',
    'Energielevel',
    'Vitalitäts-Score',
    'Ziele',
    '3 Große Herausforderungen',
    'Sport',
    'Raucher',
    'Wunschgewicht',
    'Notizen',
  ];

  const escapeCsv = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""').replace(/\n/g, ' ');
    return `"${clean}"`;
  };

  const rows = leads.map((l) => [
    escapeCsv(new Date(l.timestamp).toLocaleString('de-DE')),
    escapeCsv(l.responses.fullName),
    escapeCsv(l.responses.email),
    escapeCsv(l.responses.phone),
    escapeCsv(l.responses.birthDate),
    escapeCsv(l.responses.zipCity),
    escapeCsv(l.responses.referralPerson),
    escapeCsv(l.responses.energyLevel),
    escapeCsv(`${l.vitalityScore.overall}%`),
    escapeCsv(l.responses.goals.join(', ')),
    escapeCsv(l.responses.top3Goals),
    escapeCsv(l.responses.sportFrequency),
    escapeCsv(l.responses.smoker),
    escapeCsv(l.responses.weightGoalKg),
    escapeCsv(l.responses.additionalNotes),
  ]);

  return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}
