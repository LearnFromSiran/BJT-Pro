import type { DocumentType, ReplyTone, UiLang } from './types';
import { DOCUMENT_TYPES } from './docTypes';

// Prompt templates for the inspectable pipeline. Each stage returns strict
// JSON (enforced via response_format / json schema in openai.ts).

export const CLASSIFY_SYSTEM = `You classify Japanese resident-life documents for Nepali users living in Japan.
Return only JSON matching the provided schema. Prefer "unknown" over guessing.`;

export function classifyUser(ocrText: string, pageCount: number, keywordHits: string): string {
  return `Classify this document using OCR text and keyword hints.

Allowed types:
${DOCUMENT_TYPES.map((t) => `- ${t}`).join('\n')}

OCR_TEXT:
"""
${ocrText}
"""

METADATA:
- page_count: ${pageCount}
- language_hint: ja
- possible_keywords: ${keywordHits || '(none)'}

RULES:
- Prefer "unknown" rather than guessing when signals are weak.
- If the letter requests extra materials for a residence/visa procedure, use "immigration_request".
- If it mentions 市民税, 県民税, 森林環境税, 特別徴収, or 納税通知書, consider "resident_tax_notice".
- Provide a calibrated confidence between 0 and 1.`;
}

export const EXTRACT_SYSTEM = `You extract only grounded facts from a Japanese administrative document.
Return strict JSON. Never infer dates or amounts that are not present in the text.`;

export function extractUser(ocrText: string, documentType: DocumentType): string {
  return `Extract the following fields if present. The likely document type is "${documentType}".

Fields:
- issuer_name, recipient_name, issue_date (ISO if possible)
- due_dates[]: each { iso (YYYY-MM-DD or null), snippet (exact Japanese), label }
- amounts[]: each { value (number or null), currency, snippet (exact Japanese), label }
- required_actions[]: concrete steps the recipient must take
- risk_if_ignored[]: what happens if ignored
- contact_methods[]: phone/office/url found in the document
- cited_snippets[]: short Japanese snippets that justify the most important fields

OCR_TEXT:
"""
${ocrText}
"""

RULES:
- Every due date and amount MUST include the exact Japanese snippet that supports it.
- If a field is absent, use null or an empty array. Do not fabricate.
- Deduplicate facts across multiple pages.
- Convert Japanese era dates (令和/平成) to Gregorian ISO when confident; otherwise iso=null.`;
}

export function explainSystem(lang: UiLang): string {
  const langName = lang === 'ne' ? 'Nepali' : lang === 'ja' ? 'Japanese' : 'English';
  return `You explain Japanese life/administrative letters in clear, everyday ${langName}.
Be concise, accurate, and practical. Do not assert legal certainty unless the source states it.
Return only JSON matching the schema.`;
}

export function explainUser(extractedJson: string, lang: UiLang, confidenceHint: string): string {
  const langName = lang === 'ne' ? 'Nepali' : lang === 'ja' ? 'Japanese' : 'English';
  return `Using the structured facts below, write everyday-${langName} output.

Create:
- one_sentence_summary
- simple_explanation (2-4 short sentences)
- urgent_actions[] (imperative, concrete)
- deadlines[] (human readable, include the date)
- risks[] (what happens if ignored)
- questions_to_ask_if_unclear[]

STRUCTURED_FACTS:
${extractedJson}

CONFIDENCE_HINT: ${confidenceHint}

STYLE:
- Plain, friendly ${langName}; avoid over-formal wording.
- Keep important Japanese terms in parentheses when useful (e.g. 住民税).
- If confidence is moderate or low, say so plainly in the explanation.
- Never invent a deadline or amount that is not in the facts.`;
}

export const REPLY_SYSTEM = `You draft a short, polite Japanese reply for administrative or customer-service communication.
Stay factual. Do not threaten, admit liability, or make legal claims. Return only JSON.`;

export function replyUser(
  goal: string,
  confirmedFacts: string,
  tone: ReplyTone,
): string {
  return `Write ONE short reply in Japanese.

GOAL: ${goal || 'Acknowledge the letter and ask how to proceed with payment/next steps.'}

FACTS_USER_CONFIRMED:
${confirmedFacts}

TONE: ${tone === 'very_polite' ? 'very polite (最敬語寄り)' : 'polite (丁寧語)'}

CONSTRAINTS:
- If the user may have misunderstood the letter, include a polite clarification request.
- Keep it under ~140 Japanese characters unless more is clearly needed.
- End with a courteous closing.
- Output JSON: { "draft_text": string }`;
}
