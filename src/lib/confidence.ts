import type {
  Classification,
  ConfidenceBreakdown,
  Extraction,
  OcrResult,
  RiskLevel,
} from './types';
import { DEADLINE_EXPECTED_TYPES } from './docTypes';

// Deterministic + model-derived confidence blending, per the report:
//   0.35*ocr + 0.20*classification + 0.20*extraction_completeness
// + 0.15*rule_validation + 0.10*self_consistency

interface ConfidenceInput {
  ocr: OcrResult;
  classification: Classification;
  extraction: Extraction;
  /** 0..1 self-consistency proxy (e.g. snippets present for facts) */
  selfConsistency?: number;
}

export function ruleValidationScore(extraction: Extraction): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 1;

  const expectsDeadline = DEADLINE_EXPECTED_TYPES.includes(extraction.documentType);
  const hasDeadline = extraction.dueDates.some((d) => d.iso || d.snippet);
  if (expectsDeadline && !hasDeadline) {
    score -= 0.4;
    reasons.push('Expected a deadline for this document type but none was detected.');
  }

  const hasAmount = extraction.amounts.some((a) => a.value != null);
  if (expectsDeadline && !hasAmount) {
    // Most deadline-bearing notices also carry an amount.
    score -= 0.15;
    reasons.push('No payment amount detected on a notice that usually has one.');
  }

  // Every due date / amount should have a supporting snippet (grounding).
  const ungrounded =
    extraction.dueDates.filter((d) => !d.snippet).length +
    extraction.amounts.filter((a) => !a.snippet).length;
  if (ungrounded > 0) {
    score -= Math.min(0.3, 0.1 * ungrounded);
    reasons.push('Some facts are not grounded in a source snippet.');
  }

  return { score: clamp(score), reasons };
}

export function selfConsistencyScore(extraction: Extraction): number {
  const facts = extraction.dueDates.length + extraction.amounts.length;
  if (facts === 0) return 0.6; // neutral-ish when nothing to cross-check
  const grounded =
    extraction.dueDates.filter((d) => d.snippet).length +
    extraction.amounts.filter((a) => a.snippet).length;
  return clamp(grounded / facts);
}

export function computeConfidence(input: ConfidenceInput): ConfidenceBreakdown {
  const ocr = clamp(input.ocr.avgConfidence);
  const classification = clamp(input.classification.confidence);
  const extractionCompleteness = clamp(input.extraction.completenessScore);
  const rv = ruleValidationScore(input.extraction);
  const selfConsistency = clamp(input.selfConsistency ?? selfConsistencyScore(input.extraction));

  const overall = clamp(
    0.35 * ocr +
      0.2 * classification +
      0.2 * extractionCompleteness +
      0.15 * rv.score +
      0.1 * selfConsistency,
  );

  const reasons = [...rv.reasons];
  if (ocr < 0.7) reasons.push('OCR confidence is low — the photo may be blurry or dark.');
  if (classification < 0.6) reasons.push('Document type is uncertain.');

  return {
    ocr,
    classification,
    extractionCompleteness,
    ruleValidation: rv.score,
    selfConsistency,
    overall,
    level: levelFor(overall, input.extraction),
    reasons,
  };
}

function levelFor(overall: number, extraction: Extraction): RiskLevel {
  // Force amber/red if a normally-deadline-bearing doc is missing its deadline.
  const expectsDeadline = DEADLINE_EXPECTED_TYPES.includes(extraction.documentType);
  const hasDeadline = extraction.dueDates.some((d) => d.iso || d.snippet);
  if (expectsDeadline && !hasDeadline && overall >= 0.65) {
    return 'amber';
  }
  if (overall >= 0.85) return 'green';
  if (overall >= 0.65) return 'amber';
  return 'red';
}

export function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
