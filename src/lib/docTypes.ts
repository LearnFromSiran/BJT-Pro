import type { DocumentType, UiLang } from './types';

export const DOCUMENT_TYPES: DocumentType[] = [
  'resident_tax_notice',
  'national_health_insurance_notice',
  'pension_payment_notice',
  'pension_exemption_notice',
  'immigration_request',
  'school_lunch_notice',
  'daycare_fee_notice',
  'utility_payment_reminder',
  'unknown',
];

/** High-risk classes default to "confirm facts before generating a reply". */
export const HIGH_RISK_TYPES: DocumentType[] = [
  'immigration_request',
  'resident_tax_notice',
  'pension_payment_notice',
];

/** Document classes that almost always carry a printed deadline. */
export const DEADLINE_EXPECTED_TYPES: DocumentType[] = [
  'resident_tax_notice',
  'national_health_insurance_notice',
  'pension_payment_notice',
  'school_lunch_notice',
  'daycare_fee_notice',
  'utility_payment_reminder',
];

/** Keyword hints used by the deterministic pre-classifier (cheap signal). */
export const TYPE_KEYWORDS: Record<DocumentType, string[]> = {
  resident_tax_notice: ['市民税', '県民税', '森林環境税', '特別徴収', '納税通知書', '住民税'],
  national_health_insurance_notice: ['国民健康保険', '保険料', '納付通知書'],
  pension_payment_notice: ['国民年金', '年金保険料', '納付書', '学生納付特例'],
  pension_exemption_notice: ['免除', '納付猶予', '年金'],
  immigration_request: ['在留', '追加資料', '出入国', '入国管理', '提出してください'],
  school_lunch_notice: ['学校給食費', '給食', '納入通知書', '納入額'],
  daycare_fee_notice: ['保育料', '保育園', '認定こども園'],
  utility_payment_reminder: ['電気料金', 'お支払い', 'ガス料金', '水道料金', '送電停止', '供給停止'],
  unknown: [],
};

const LABELS: Record<DocumentType, Record<UiLang, string>> = {
  resident_tax_notice: { ne: 'वासस्थान कर सूचना', ja: '住民税通知', en: 'Residence Tax Notice' },
  national_health_insurance_notice: {
    ne: 'राष्ट्रिय स्वास्थ्य बीमा',
    ja: '国民健康保険通知',
    en: 'National Health Insurance',
  },
  pension_payment_notice: { ne: 'पेन्सन भुक्तानी सूचना', ja: '年金納付通知', en: 'Pension Payment Notice' },
  pension_exemption_notice: { ne: 'पेन्सन छुट सूचना', ja: '年金免除通知', en: 'Pension Exemption Notice' },
  immigration_request: { ne: 'इमिग्रेसन अनुरोध', ja: '入管追加資料依頼', en: 'Immigration Request' },
  school_lunch_notice: { ne: 'विद्यालय खाजा सूचना', ja: '学校給食費通知', en: 'School Lunch Notice' },
  daycare_fee_notice: { ne: 'बालविकास शुल्क सूचना', ja: '保育料通知', en: 'Daycare Fee Notice' },
  utility_payment_reminder: { ne: 'युटिलिटी भुक्तानी सम्झना', ja: '公共料金支払い案内', en: 'Utility Payment Reminder' },
  unknown: { ne: 'अज्ञात कागजात', ja: '不明な書類', en: 'Unknown Document' },
};

export function typeLabel(type: DocumentType, lang: UiLang): string {
  return LABELS[type]?.[lang] ?? LABELS.unknown[lang];
}

/** Lightweight keyword scan over OCR text → keyword hits per type. */
export function keywordHits(ocrText: string): Partial<Record<DocumentType, string[]>> {
  const hits: Partial<Record<DocumentType, string[]>> = {};
  for (const type of DOCUMENT_TYPES) {
    const found = TYPE_KEYWORDS[type].filter((kw) => ocrText.includes(kw));
    if (found.length) hits[type] = found;
  }
  return hits;
}
