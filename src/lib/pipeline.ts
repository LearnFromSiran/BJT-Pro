import type {
  AnalysisResult,
  Classification,
  DocumentType,
  Explanation,
  Extraction,
  ReplyDraft,
  ReplyTone,
  UiLang,
  UploadedPage,
} from './types';
import { hasVisionKey, runOcr } from './ocr';
import { chatJson, FALLBACK_MODEL, hasOpenAIKey, PRIMARY_MODEL } from './openaiClient';
import {
  classifyUser,
  CLASSIFY_SYSTEM,
  explainSystem,
  explainUser,
  EXTRACT_SYSTEM,
  extractUser,
  REPLY_SYSTEM,
  replyUser,
} from './prompts';
import {
  ClassificationSchema,
  ExplanationSchema,
  ExtractionSchema,
  ReplySchema,
} from './schemas';
import { keywordHits } from './docTypes';
import { computeConfidence } from './confidence';
import { extractAmountsFromText, extractDatesFromText } from './extractHeuristics';
import { buildDemoResult, cryptoRandomId } from './demo';

export function isDemoMode(): boolean {
  if (process.env.DEMO_MODE === 'true') return true;
  // Demo if we can't actually do OCR + LLM.
  return !(hasVisionKey() && hasOpenAIKey());
}

/** Full live pipeline: OCR → classify → extract → explain → confidence. */
export async function analyze(pages: UploadedPage[], lang: UiLang): Promise<AnalysisResult> {
  // 1. OCR
  const ocr = await runOcr(pages);
  if (!ocr.text || ocr.text.trim().length < 4) {
    throw new Error('OCR produced no usable text. Ask the user to retake the photo.');
  }

  const hits = keywordHits(ocr.text);
  const hitSummary = Object.entries(hits)
    .map(([t, kws]) => `${t}: ${kws?.join('/')}`)
    .join('; ');

  // 2. Classify
  const rawClass = await chatJson({
    system: CLASSIFY_SYSTEM,
    user: classifyUser(ocr.text, pages.length, hitSummary),
  });
  const parsedClass = ClassificationSchema.parse(rawClass);
  const classification: Classification = {
    predictedType: parsedClass.predicted_type,
    confidence: parsedClass.confidence,
    altTypes: parsedClass.alt_types.map((a) => ({ type: a.type, confidence: a.confidence })),
    model: PRIMARY_MODEL,
  };

  // 3. Extract (fallback to stronger model if completeness looks poor)
  let extraction = await extractFacts(ocr.text, classification.predictedType, PRIMARY_MODEL);
  if (extraction.completenessScore < 0.5) {
    try {
      const stronger = await extractFacts(ocr.text, classification.predictedType, FALLBACK_MODEL);
      if (stronger.completenessScore > extraction.completenessScore) extraction = stronger;
    } catch {
      // keep primary extraction
    }
  }

  // 4. Explain in target language
  const explanation = await explain(extraction, lang);

  // 5. Confidence
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
    demo: false,
  };
}

async function extractFacts(
  ocrText: string,
  documentType: DocumentType,
  model: string,
): Promise<Extraction> {
  const raw = await chatJson({
    system: EXTRACT_SYSTEM,
    user: extractUser(ocrText, documentType),
    model,
  });
  const parsed = ExtractionSchema.parse(raw);

  // Cross-check / backfill with deterministic heuristics.
  const heurDates = extractDatesFromText(ocrText);
  const heurAmounts = extractAmountsFromText(ocrText);

  const dueDates = parsed.due_dates.length ? parsed.due_dates : heurDates;
  const amounts = parsed.amounts.length ? parsed.amounts : heurAmounts;

  const expected = 5;
  let found = 0;
  if (parsed.issuer_name) found++;
  if (dueDates.length) found++;
  if (amounts.length) found++;
  if (parsed.required_actions.length) found++;
  if (parsed.cited_snippets.length) found++;

  return {
    documentType,
    issuerName: parsed.issuer_name,
    recipientName: parsed.recipient_name,
    issueDate: parsed.issue_date,
    dueDates,
    amounts,
    requiredActions: parsed.required_actions,
    riskIfIgnored: parsed.risk_if_ignored,
    contactMethods: parsed.contact_methods,
    citedSnippets: parsed.cited_snippets,
    completenessScore: found / expected,
  };
}

async function explain(extraction: Extraction, lang: UiLang): Promise<Explanation> {
  const raw = await chatJson({
    system: explainSystem(lang),
    user: explainUser(
      JSON.stringify(extraction, null, 2),
      lang,
      `extraction completeness ${(extraction.completenessScore * 100).toFixed(0)}%`,
    ),
  });
  const parsed = ExplanationSchema.parse(raw);
  return {
    lang,
    oneSentenceSummary: parsed.one_sentence_summary,
    simpleExplanation: parsed.simple_explanation,
    urgentActions: parsed.urgent_actions,
    deadlines: parsed.deadlines,
    risks: parsed.risks,
    questionsIfUnclear: parsed.questions_to_ask_if_unclear,
  };
}

/** Demo path: no OCR/LLM. Accepts pre-supplied OCR text (sample) or [] */
export function analyzeDemo(ocrText: string, lang: UiLang): AnalysisResult {
  return buildDemoResult(ocrText, lang);
}

/** Generate a Japanese reply draft (live or demo). */
export async function generateReply(opts: {
  goal: string;
  confirmedFacts: string;
  tone: ReplyTone;
  demo: boolean;
}): Promise<ReplyDraft> {
  const disclaimer =
    'この文面は自動生成です。送信前に内容を確認・修正してください。';
  if (opts.demo || !hasOpenAIKey()) {
    return { lang: 'ja', tone: opts.tone, draftText: demoReply(opts.tone), disclaimer };
  }
  const raw = await chatJson({
    system: REPLY_SYSTEM,
    user: replyUser(opts.goal, opts.confirmedFacts, opts.tone),
    temperature: 0.4,
  });
  const parsed = ReplySchema.parse(raw);
  return { lang: 'ja', tone: opts.tone, draftText: parsed.draft_text, disclaimer };
}

function demoReply(tone: ReplyTone): string {
  if (tone === 'very_polite') {
    return (
      'お世話になっております。先日お送りいただきました通知を拝受いたしました。' +
      '内容を確認させていただきたく、お支払い方法や期限についてご教示いただけますと幸いです。' +
      '分割でのお支払いが可能でしたら、あわせてご相談させていただけますでしょうか。何卒よろしくお願い申し上げます。'
    );
  }
  return (
    'お世話になっております。本通知を受け取りました。内容を確認し、支払い方法についてご相談したいです。' +
    '期限延長や分割納付が可能であれば、教えていただけますでしょうか。よろしくお願いいたします。'
  );
}
