// Shared domain types for the analysis pipeline.

export type UiLang = 'ne' | 'ja' | 'en';

export type DocumentType =
  | 'resident_tax_notice'
  | 'national_health_insurance_notice'
  | 'pension_payment_notice'
  | 'pension_exemption_notice'
  | 'immigration_request'
  | 'school_lunch_notice'
  | 'daycare_fee_notice'
  | 'utility_payment_reminder'
  | 'unknown';

export type RiskLevel = 'green' | 'amber' | 'red';

export interface UploadedPage {
  /** data URL (base64) of the image, or PDF page rendered to image */
  dataUrl: string;
  mimeType: string;
  name?: string;
}

export interface OcrResult {
  text: string;
  /** 0..1 average OCR confidence */
  avgConfidence: number;
  provider: 'google_vision' | 'demo';
  durationMs: number;
}

export interface Classification {
  predictedType: DocumentType;
  confidence: number; // 0..1
  altTypes: { type: DocumentType; confidence: number }[];
  model: string;
}

export interface DueDate {
  /** ISO date (YYYY-MM-DD) if parseable, else null */
  iso: string | null;
  /** exact Japanese snippet supporting this date */
  snippet: string;
  label?: string;
}

export interface Amount {
  value: number | null;
  currency: string;
  snippet: string;
  label?: string;
}

export interface Extraction {
  documentType: DocumentType;
  issuerName: string | null;
  recipientName: string | null;
  issueDate: string | null;
  dueDates: DueDate[];
  amounts: Amount[];
  requiredActions: string[];
  riskIfIgnored: string[];
  contactMethods: string[];
  citedSnippets: string[];
  /** 0..1 fraction of expected fields that were found */
  completenessScore: number;
}

export interface Explanation {
  lang: UiLang;
  oneSentenceSummary: string;
  simpleExplanation: string;
  urgentActions: string[];
  deadlines: string[];
  risks: string[];
  questionsIfUnclear: string[];
}

export interface ConfidenceBreakdown {
  ocr: number;
  classification: number;
  extractionCompleteness: number;
  ruleValidation: number;
  selfConsistency: number;
  overall: number;
  level: RiskLevel;
  reasons: string[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  lang: UiLang;
  ocr: OcrResult;
  classification: Classification;
  extraction: Extraction;
  explanation: Explanation;
  confidence: ConfidenceBreakdown;
  /** true if produced by demo/mock path rather than live OCR+LLM */
  demo: boolean;
}

export interface ReplyDraft {
  lang: 'ja';
  tone: ReplyTone;
  draftText: string;
  disclaimer: string;
}

export type ReplyTone = 'polite' | 'very_polite';
