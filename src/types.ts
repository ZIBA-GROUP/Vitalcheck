export type QuestionType =
  | 'text'
  | 'textarea'
  | 'single-choice'
  | 'multi-choice'
  | 'matrix'
  | 'energy-slider';

export interface MatrixColumn {
  id: number | string;
  label: string;
}

export interface MatrixRow {
  id: string;
  text: string;
  required?: boolean;
}

export interface FormQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  columns?: MatrixColumn[];
  rows?: MatrixRow[];
  category: 'intro' | 'energy' | 'digestion' | 'sport' | 'health' | 'optional' | 'contact';
}

export interface FormSection {
  id: string;
  stepNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  questions: FormQuestion[];
}

export interface FormResponses {
  referralPerson: string;
  goals: string[];
  energyMatrix: Record<string, string>;
  energyLevel: string;
  immuneMatrix: Record<string, string>;
  unsupportedFoods: string;
  smoker: string;
  acidMatrix: Record<string, string>;
  sportMatrix: Record<string, string>;
  sportFrequency: string;
  dietMatrix: Record<string, string>;
  weightGoalKg: string;
  healthMatrix: Record<string, string>;
  diabetesType: string;
  kidsMatrix: Record<string, string>;
  womenMatrix: Record<string, string>;
  top3Goals: string;
  fullName: string;
  birthDate: string;
  street: string;
  zipCity: string;
  email: string;
  phone: string;
  height: string;
  weight: string;
  additionalNotes: string;
  privacyAccepted: boolean;
}

export interface LeadSubmission {
  id: string;
  timestamp: string;
  responses: FormResponses;
  syncedToEmailTool: boolean;
  syncError?: string;
  vitalityScore: {
    overall: number;
    energyScore: number;
    digestionScore: number;
    acidScore: number;
    recoveryScore: number;
  };
}

export type EmailProvider =
  | 'klicktipp'
  | 'brevo'
  | 'activecampaign'
  | 'mailchimp'
  | 'cleverreach'
  | 'webhook';

export interface EmailMarketingConfig {
  provider: EmailProvider;
  enabled: boolean;
  webhookUrl: string;
  apiKey: string;
  listId: string;
  apiUrl?: string;
  tags: string[];
  lastSyncStatus?: 'success' | 'error' | 'idle';
  lastSyncMessage?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  rating: number;
  badge: string;
  quote: string;
  result: string;
}
