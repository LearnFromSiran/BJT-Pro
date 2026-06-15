import type { Amount, DueDate } from './types';

// Deterministic regex extraction for Japanese dates and amounts.
// Used by demo mode and as a sanity cross-check ("rule validator") against
// the LLM extraction.

const ERA_BASE: Record<string, number> = {
  令和: 2018, // 令和1 = 2019
  平成: 1988, // 平成1 = 1989
  昭和: 1925, // 昭和1 = 1926
};

/** Convert a Japanese-era or western year string into a 4-digit year. */
function resolveYear(era: string | undefined, year: number): number {
  if (era && ERA_BASE[era] != null) return ERA_BASE[era] + year;
  if (year < 100) return 2000 + year; // 2-digit western year
  return year;
}

export function extractDatesFromText(text: string): DueDate[] {
  const results: DueDate[] = [];
  const seen = new Set<string>();

  // 令和8年7月1日 / 平成31年4月30日 / 2026年7月1日
  const full =
    /(令和|平成|昭和)?\s*(\d{1,4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g;
  let m: RegExpExecArray | null;
  while ((m = full.exec(text))) {
    const year = resolveYear(m[1], parseInt(m[2], 10));
    const month = parseInt(m[3], 10);
    const day = parseInt(m[4], 10);
    const iso = toIso(year, month, day);
    const snippet = m[0].replace(/\s+/g, '');
    const label = deadlineLabel(text, m.index);
    const key = iso ?? snippet;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ iso, snippet, label });
    }
  }

  // 7月31日 (no year) — only if no full date already captured it
  if (results.length === 0) {
    const md = /(\d{1,2})\s*月\s*(\d{1,2})\s*日/g;
    while ((m = md.exec(text))) {
      const snippet = m[0].replace(/\s+/g, '');
      if (seen.has(snippet)) continue;
      seen.add(snippet);
      results.push({ iso: null, snippet, label: deadlineLabel(text, m.index) });
    }
  }

  return results;
}

function deadlineLabel(text: string, idx: number): string | undefined {
  const before = text.slice(Math.max(0, idx - 12), idx);
  if (before.includes('納期限') || before.includes('納付期限') || before.includes('期限')) {
    return 'deadline';
  }
  if (before.includes('第1期') || before.includes('第一期')) return '1st installment';
  return undefined;
}

function toIso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function extractAmountsFromText(text: string): Amount[] {
  const results: Amount[] = [];
  const seen = new Set<number>();
  // 18,000円 / ¥18,000 / 12000円
  const re = /(?:¥\s*)?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s*円?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = m[1].replace(/,/g, '');
    const value = parseInt(raw, 10);
    // Skip tiny numbers and year-like tokens unless followed by 円 / ¥ prefix.
    const hasYen = m[0].includes('円') || m[0].includes('¥');
    if (!hasYen) continue;
    if (Number.isNaN(value) || value < 100) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    results.push({ value, currency: 'JPY', snippet: m[0].trim(), label: 'amount' });
  }
  return results;
}
