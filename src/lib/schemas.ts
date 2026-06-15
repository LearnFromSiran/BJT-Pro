import { z } from 'zod';
import { DOCUMENT_TYPES } from './docTypes';
import type { DocumentType } from './types';

const docTypeEnum = z.enum(DOCUMENT_TYPES as [DocumentType, ...DocumentType[]]);

export const ClassificationSchema = z.object({
  predicted_type: docTypeEnum,
  confidence: z.number().min(0).max(1),
  alt_types: z
    .array(z.object({ type: docTypeEnum, confidence: z.number().min(0).max(1) }))
    .default([]),
});

export const DueDateSchema = z.object({
  iso: z.string().nullable(),
  snippet: z.string().default(''),
  label: z.string().optional(),
});

export const AmountSchema = z.object({
  value: z.number().nullable(),
  currency: z.string().default('JPY'),
  snippet: z.string().default(''),
  label: z.string().optional(),
});

export const ExtractionSchema = z.object({
  issuer_name: z.string().nullable().default(null),
  recipient_name: z.string().nullable().default(null),
  issue_date: z.string().nullable().default(null),
  due_dates: z.array(DueDateSchema).default([]),
  amounts: z.array(AmountSchema).default([]),
  required_actions: z.array(z.string()).default([]),
  risk_if_ignored: z.array(z.string()).default([]),
  contact_methods: z.array(z.string()).default([]),
  cited_snippets: z.array(z.string()).default([]),
});

export const ExplanationSchema = z.object({
  one_sentence_summary: z.string().default(''),
  simple_explanation: z.string().default(''),
  urgent_actions: z.array(z.string()).default([]),
  deadlines: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  questions_to_ask_if_unclear: z.array(z.string()).default([]),
});

export const ReplySchema = z.object({
  draft_text: z.string().default(''),
});
