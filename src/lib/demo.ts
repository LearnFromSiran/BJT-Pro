import type {
  AnalysisResult,
  DocumentType,
  Explanation,
  Extraction,
  UiLang,
} from './types';
import { keywordHits } from './docTypes';
import { computeConfidence } from './confidence';
import { extractAmountsFromText, extractDatesFromText } from './extractHeuristics';

// Synthetic sample letters modeled on official Japanese notice types
// (NOT verbatim reproductions). Used for demo mode and onboarding.

export interface SampleLetter {
  id: string;
  title: string;
  ocrText: string;
  type: DocumentType;
}

export const SAMPLE_LETTERS: SampleLetter[] = [
  {
    id: 'resident_tax',
    title: '住民税 / Residence Tax',
    type: 'resident_tax_notice',
    ocrText:
      '令和8年度 市民税・県民税・森林環境税 税額決定・納税通知書\n' +
      '渋谷区役所\n第1期 納期限 令和8年7月1日\n納付額 18,000円\n' +
      'お支払いは金融機関・コンビニエンスストア・スマートフォン決済をご利用ください。\n' +
      '納期限を過ぎると延滞金がかかる場合があります。お困りの場合は区役所へご相談ください。',
  },
  {
    id: 'nhi',
    title: '国民健康保険 / Health Insurance',
    type: 'national_health_insurance_notice',
    ocrText:
      '国民健康保険料納付通知書\n世田谷区\n7月分 12,000円\n納期限 令和8年7月31日\n' +
      '所得が下がった方は減額の対象となる場合があります。区役所国保係へご相談ください。',
  },
  {
    id: 'pension',
    title: '国民年金 / National Pension',
    type: 'pension_payment_notice',
    ocrText:
      '国民年金保険料 納付書\n日本年金機構\n納付期限 令和8年6月30日\n' +
      '学生の方は「学生納付特例」の申請ができます。\n未納のままにすると将来の年金額に影響する場合があります。',
  },
  {
    id: 'immigration',
    title: '在留 追加資料 / Immigration',
    type: 'immigration_request',
    ocrText:
      '在留申請に関する追加資料提出のお願い\n出入国在留管理庁\n' +
      '提出書類: 顔写真、在職証明書、住民票\nできるだけ早く提出してください。\n' +
      'お問い合わせ: 03-XXXX-XXXX',
  },
  {
    id: 'utility',
    title: '電気料金 / Utility',
    type: 'utility_payment_reminder',
    ocrText:
      '電気料金のお支払いのお願い\n東京電力エナジーパートナー\n' +
      'お支払いを確認できませんでした。お早めにお支払いください。\n' +
      'お支払いが確認できない場合、送電を停止することがあります。',
  },
];

// Pre-written, high-quality demo outputs per type & language. This is the
// "ideal parsed output" from the report — used only when no API keys are set.
const DEMO_EXPLANATIONS: Record<
  DocumentType,
  Partial<Record<UiLang, Omit<Explanation, 'lang'>>>
> = {
  resident_tax_notice: {
    ne: {
      oneSentenceSummary: 'यो सहर/प्रिफेक्चर करको सूचना हो; पहिलो किस्ता 18,000 yen तिर्नुपर्ने देखिन्छ।',
      simpleExplanation:
        'यो वासस्थान कर (住民税) को कर रकम निर्धारण र भुक्तानी सूचना हो। पहिलो किस्ताको रकम 18,000 yen छ र अन्तिम मिति 7月1日 हो। कन्भिनियन्स स्टोर, बैंक वा स्मार्टफोन एपबाट तिर्न सकिन्छ।',
      urgentActions: [
        'रकम र अन्तिम मिति पुष्टि गर्नुहोस्',
        'कन्भिनियन्स स्टोर / बैंक / एपबाट 18,000 yen तिर्नुहोस्',
        'आर्थिक कठिनाइ भए वडा कार्यालयमा किस्ताबन्दीबारे सोध्नुहोस्',
      ],
      deadlines: ['2026-07-01 (पहिलो किस्ता / 第1期)'],
      risks: ['समयमा नतिरे विलम्ब शुल्क (延滞金) लाग्न सक्छ'],
      questionsIfUnclear: ['के म किस्ताबन्दीमा तिर्न सक्छु?', 'कठिनाइ भए छुटको व्यवस्था छ?'],
    },
    en: {
      oneSentenceSummary: 'This is a residence tax notice; the first installment of ¥18,000 appears due.',
      simpleExplanation:
        'This is a residence tax (住民税) assessment and payment notice. The first installment is ¥18,000, due July 1. You can pay at a convenience store, bank, or via smartphone payment.',
      urgentActions: [
        'Verify the amount and due date',
        'Pay ¥18,000 at a convenience store / bank / app',
        'If facing hardship, ask the ward office about installments',
      ],
      deadlines: ['2026-07-01 (1st installment / 第1期)'],
      risks: ['Late charges (延滞金) may apply if unpaid after the due date'],
      questionsIfUnclear: ['Can I pay in installments?', 'Is there a reduction for hardship?'],
    },
  },
  national_health_insurance_notice: {
    ne: {
      oneSentenceSummary: 'यो राष्ट्रिय स्वास्थ्य बीमा प्रिमियम हो; 7月分 को 12,000 yen तिर्नुपर्ने देखिन्छ।',
      simpleExplanation:
        'यो राष्ट्रिय स्वास्थ्य बीमा (国民健康保険) को प्रिमियम भुक्तानी सूचना हो। जुलाई महिनाको रकम 12,000 yen छ, अन्तिम मिति 7月31日। आम्दानी घटेको भए छुटको लागि आवेदन गर्न सकिन्छ।',
      urgentActions: [
        'अन्तिम मितिभित्र 12,000 yen तिर्नुहोस्',
        'घरपरिवार/सदस्यका आधारमा रकम पुष्टि गर्नुहोस्',
        'आम्दानी घटेको भए वडाको 国保係 मा छुटबारे सोध्नुहोस्',
      ],
      deadlines: ['2026-07-31'],
      risks: ['सम्झना पत्र, विलम्ब शुल्क, र गम्भीर ढिलाइमा केही सेवामा रोक लाग्न सक्छ'],
      questionsIfUnclear: ['आम्दानी घटे प्रिमियम घट्छ?', 'किस्ताबन्दी सम्भव छ?'],
    },
    en: {
      oneSentenceSummary: 'This is a National Health Insurance premium; ¥12,000 for July appears due.',
      simpleExplanation:
        'This is a National Health Insurance (国民健康保険) premium notice. The July amount is ¥12,000, due July 31. If your income has dropped, you may apply for a reduction.',
      urgentActions: [
        'Pay ¥12,000 by the due date',
        'Confirm the amount is based on your household/members',
        'If income dropped, ask the ward 国保係 about a reduction',
      ],
      deadlines: ['2026-07-31'],
      risks: ['Reminders, late charges, and some restrictions if seriously delinquent'],
      questionsIfUnclear: ['Will the premium drop if my income fell?', 'Are installments possible?'],
    },
  },
  pension_payment_notice: {
    ne: {
      oneSentenceSummary:
        'यो राष्ट्रिय पेन्सनको भुक्तानी सूचना हो; विद्यार्थी भए विशेष भुक्तानी प्रणाली (学生納付特例) को विकल्प छ।',
      simpleExplanation:
        'यो राष्ट्रिय पेन्सन (国民年金) को भुक्तानी सूचना हो, अन्तिम मिति 6月30日। तपाईं विद्यार्थी हुनुहुन्छ भने "学生納付特例" आवेदन गरी भुक्तानी पछि सार्न सकिन्छ। नतिरे भविष्यको पेन्सनमा असर पर्न सक्छ।',
      urgentActions: [
        'तपाईं विद्यार्थी हो/होइन निर्णय गर्नुहोस्',
        'तिर्ने कि 学生納付特例 / छुट आवेदन गर्ने छान्नुहोस्',
        'आवश्यक भए नजिकको पेन्सन कार्यालयमा सम्पर्क गर्नुहोस्',
      ],
      deadlines: ['2026-06-30'],
      risks: ['नतिरे अपांगता/मृत्यु/वृद्धावस्था पेन्सनको योग्यतामा असर पर्न सक्छ'],
      questionsIfUnclear: ['म 学生納付特例 का लागि योग्य छु?', 'पछि भुक्तानी (追納) गर्न सकिन्छ?'],
    },
    en: {
      oneSentenceSummary:
        'This is a National Pension payment notice; if you are a student, a special payment system (学生納付特例) may apply.',
      simpleExplanation:
        'This is a National Pension (国民年金) payment notice, due June 30. If you are a student you can apply for the "学生納付特例" to postpone payment. Non-payment can affect future pension benefits.',
      urgentActions: [
        'Check whether you are a student',
        'Decide: pay vs apply for 学生納付特例 / exemption',
        'Contact your local pension office if needed',
      ],
      deadlines: ['2026-06-30'],
      risks: ['Non-payment may affect disability/survivor/old-age pension eligibility'],
      questionsIfUnclear: ['Am I eligible for 学生納付特例?', 'Can I pay later (追納)?'],
    },
  },
  immigration_request: {
    ne: {
      oneSentenceSummary:
        'तपाईंको residence/visa आवेदनका लागि थप कागजात मागिएको छ — यो urgent पत्र हो।',
      simpleExplanation:
        'यो आप्रवासन (出入国在留管理庁) ले residence आवेदनका लागि थप कागजात मागेको पत्र हो। फोटो, रोजगार प्रमाणपत्र, 住民票 जस्ता कागजात सकेसम्म चाँडो पठाउनुपर्छ। ढिलाइले आवेदनमा नकारात्मक असर पार्न सक्छ।',
      urgentActions: [
        'मागिएका कागजात पहिचान गर्नुहोस् (फोटो, प्रमाणपत्र, etc.)',
        'सही माध्यमबाट चाँडो पठाउनुहोस्',
        'अन्योल भए दिइएको नम्बरमा सम्पर्क गर्नुहोस्',
      ],
      deadlines: ['पत्ता लागेन — मूल कागज तुरुन्तै जाँच्नुहोस्'],
      risks: ['ढिलाइ वा प्रतिकूल नतिजा हुन सक्छ'],
      questionsIfUnclear: ['कुन-कुन कागजात चाहिन्छ?', 'कहाँ र कसरी पठाउने?'],
    },
    en: {
      oneSentenceSummary: 'Additional documents are requested for your residence/visa application — this is urgent.',
      simpleExplanation:
        'This is a request from Immigration (出入国在留管理庁) for additional materials for your residence application. Submit items like a photo, certificate of employment, and 住民票 as soon as possible. Delays can negatively affect the application.',
      urgentActions: [
        'Identify the requested documents (photo, certificates, etc.)',
        'Submit them quickly via the correct channel',
        'If unclear, contact the number provided',
      ],
      deadlines: ['Not detected — check the original immediately'],
      risks: ['Application delay or an adverse result if ignored'],
      questionsIfUnclear: ['Which documents exactly are needed?', 'Where and how do I submit?'],
    },
  },
  utility_payment_reminder: {
    ne: {
      oneSentenceSummary: 'बिजुली बिल भुक्तानी पुष्टि भएको छैन — सकेसम्म चाँडो तिर्नुहोस्।',
      simpleExplanation:
        'यो बिजुली कम्पनी (東京電力) ले पठाएको भुक्तानी सम्झना हो। तपाईंको भुक्तानी पुष्टि भएको छैन। पहिले नै तिरिसक्नुभएको भए कम्पनीलाई सम्पर्क गर्नुहोस्, नभए तुरुन्तै तिर्नुहोस्।',
      urgentActions: [
        'तुरुन्तै भुक्तानी गर्नुहोस्',
        'पहिले तिरिसकेको भए पुष्टि गर्नुहोस्',
        'समस्या भए बिजुली कम्पनीलाई सम्पर्क गर्नुहोस्',
      ],
      deadlines: ['स्पष्ट मिति छैन — तत्काल कारबाही सिफारिस'],
      risks: ['पछि सेवा (送電) रोकिने सूचना आउन सक्छ'],
      questionsIfUnclear: ['कहाँ तिर्ने?', 'पहिले तिरेको भए के गर्ने?'],
    },
    en: {
      oneSentenceSummary: 'Your electricity payment is unconfirmed — pay as soon as possible.',
      simpleExplanation:
        'This is a payment reminder from the electric company (東京電力). Your payment could not be confirmed. If you already paid, contact the company; otherwise pay immediately.',
      urgentActions: [
        'Pay immediately',
        'If you already paid, verify with the company',
        'Contact the utility if there is an issue',
      ],
      deadlines: ['No explicit date — immediate action recommended'],
      risks: ['A service suspension (送電停止) notice may follow'],
      questionsIfUnclear: ['Where do I pay?', 'What if I already paid?'],
    },
  },
  pension_exemption_notice: {},
  school_lunch_notice: {},
  daycare_fee_notice: {},
  unknown: {},
};

function genericExplanation(extraction: Extraction, lang: UiLang): Omit<Explanation, 'lang'> {
  const hasDeadline = extraction.dueDates.some((d) => d.iso || d.snippet);
  if (lang === 'ne') {
    return {
      oneSentenceSummary: 'यो एक आधिकारिक जापानी पत्र हो; तल निकालिएका मुख्य तथ्य जाँच्नुहोस्।',
      simpleExplanation:
        'हामीले यो कागजातको प्रकार पूर्ण रूपमा पहिचान गर्न सकेनौं। तल देखिएका मिति र रकम मूल जापानी पाठसँग मिलाएर पुष्टि गर्नुहोस्। अनिश्चित भए राम्रो फोटो वा मानवीय जाँच प्रयोग गर्नुहोस्।',
      urgentActions: ['मूल जापानी पाठसँग मिति र रकम मिलाउनुहोस्', 'अनिश्चित भए मानवीय जाँच अनुरोध गर्नुहोस्'],
      deadlines: hasDeadline ? extraction.dueDates.map((d) => d.iso || d.snippet) : ['पत्ता लागेन'],
      risks: ['अज्ञात — मूल कागज ध्यानपूर्वक जाँच्नुहोस्'],
      questionsIfUnclear: ['यो पत्रको उद्देश्य के हो?', 'मैले के गर्नुपर्छ?'],
    };
  }
  return {
    oneSentenceSummary: 'This is an official Japanese letter; review the extracted facts below.',
    simpleExplanation:
      "We could not fully identify this document type. Verify the dates and amounts below against the Japanese source. If uncertain, use a clearer photo or human review.",
    urgentActions: ['Verify dates and amounts against the Japanese source', 'Request human review if uncertain'],
    deadlines: hasDeadline ? extraction.dueDates.map((d) => d.iso || d.snippet) : ['Not detected'],
    risks: ['Unknown — check the original carefully'],
    questionsIfUnclear: ['What is the purpose of this letter?', 'What do I need to do?'],
  };
}

/** Build a full demo AnalysisResult from arbitrary OCR text (no network). */
export function buildDemoResult(ocrText: string, lang: UiLang): AnalysisResult {
  const hits = keywordHits(ocrText);
  // Pick the type with the most keyword hits, else unknown.
  let bestType: DocumentType = 'unknown';
  let bestCount = 0;
  for (const [type, found] of Object.entries(hits)) {
    if (found && found.length > bestCount) {
      bestCount = found.length;
      bestType = type as DocumentType;
    }
  }
  const classificationConfidence = bestType === 'unknown' ? 0.4 : Math.min(0.95, 0.6 + 0.1 * bestCount);

  const dueDates = extractDatesFromText(ocrText);
  const amounts = extractAmountsFromText(ocrText);

  const expectedFields = 5;
  let found = 0;
  if (dueDates.length) found++;
  if (amounts.length) found++;
  if (bestType !== 'unknown') found++;
  if (ocrText.length > 40) found++;
  if (hits[bestType]?.length) found++;

  const extraction: Extraction = {
    documentType: bestType,
    issuerName: guessIssuer(ocrText),
    recipientName: null,
    issueDate: null,
    dueDates,
    amounts,
    requiredActions: [],
    riskIfIgnored: [],
    contactMethods: extractContacts(ocrText),
    citedSnippets: hits[bestType] ?? [],
    completenessScore: found / expectedFields,
  };

  const explBody =
    DEMO_EXPLANATIONS[bestType]?.[lang] ??
    DEMO_EXPLANATIONS[bestType]?.en ??
    genericExplanation(extraction, lang);

  const explanation: Explanation = { lang, ...explBody };

  const ocr = {
    text: ocrText,
    avgConfidence: 0.9,
    provider: 'demo' as const,
    durationMs: 350,
  };
  const classification = {
    predictedType: bestType,
    confidence: classificationConfidence,
    altTypes: [],
    model: 'demo',
  };

  const confidence = computeConfidence({ ocr, classification, extraction });

  return {
    id: cryptoRandomId(),
    createdAt: new Date().toISOString(),
    lang,
    ocr,
    classification,
    extraction,
    explanation,
    confidence,
    demo: true,
  };
}

function guessIssuer(text: string): string | null {
  const known = ['日本年金機構', '出入国在留管理庁', '東京電力エナジーパートナー', '東京電力', '区役所', '市役所'];
  const lines = text.split('\n').map((l) => l.trim());
  for (const k of known) {
    // Prefer the shortest line that contains the issuer keyword.
    const line = lines.find((l) => l.includes(k));
    if (line) return line;
  }
  return null;
}

function extractContacts(text: string): string[] {
  const phones = text.match(/0\d[\d\-]{7,}/g) ?? [];
  return Array.from(new Set(phones));
}

export function cryptoRandomId(): string {
  // Works in both browser and node (Next runtime).
  try {
    return (globalThis.crypto as Crypto).randomUUID();
  } catch {
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
