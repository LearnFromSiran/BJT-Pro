'use client';

import type { AnalysisResult } from './types';

// Client-side history for the MVP. Production would use Supabase + RLS;
// here we keep results in localStorage so the app is fully functional with
// zero backend setup. Original images are NOT stored (privacy-first).

const KEY = 'bjtpro.history.v1';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  documentType: string;
  summary: string;
  confidence: number;
  level: string;
  result: AnalysisResult;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveResult(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  const entries = loadHistory();
  const entry: HistoryEntry = {
    id: result.id,
    createdAt: result.createdAt,
    documentType: result.classification.predictedType,
    summary: result.explanation.oneSentenceSummary,
    confidence: result.confidence.overall,
    level: result.confidence.level,
    result,
  };
  const next = [entry, ...entries.filter((e) => e.id !== result.id)].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function deleteEntry(id: string): void {
  if (typeof window === 'undefined') return;
  const entries = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(entries));
}
