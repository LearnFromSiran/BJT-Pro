'use client';

import { useState } from 'react';
import type { AnalysisResult, ReplyDraft, ReplyTone, UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { HIGH_RISK_TYPES } from '@/lib/docTypes';

export default function ReplyScreen({
  lang,
  result,
  onBack,
}: {
  lang: UiLang;
  result: AnalysisResult;
  onBack: () => void;
}) {
  const isHighRisk = HIGH_RISK_TYPES.includes(result.classification.predictedType);
  const [confirmed, setConfirmed] = useState(!isHighRisk);
  const [tone, setTone] = useState<ReplyTone>('polite');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<ReplyDraft | null>(null);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const facts = JSON.stringify(
        {
          documentType: result.classification.predictedType,
          dueDates: result.extraction.dueDates,
          amounts: result.extraction.amounts,
          summary: result.explanation.oneSentenceSummary,
        },
        null,
        2,
      );
      const res = await fetch('/api/reply-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone, confirmedFacts: facts }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
      const d = (await res.json()) as ReplyDraft;
      setDraft(d);
      setText(d.draftText);
    } catch (e: any) {
      setError(e?.message || tr('error', lang));
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-lg font-bold text-slate-900">{tr('replyTitle', lang)}</h2>

      {/* Tone selector */}
      <div>
        <div className="mb-2 text-sm font-semibold text-slate-500">{tr('tone', lang)}</div>
        <div className="flex gap-2">
          {(['polite', 'very_polite'] as ReplyTone[]).map((tt) => (
            <button
              key={tt}
              onClick={() => setTone(tt)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
                tone === tt ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'
              }`}
            >
              {tt === 'polite' ? tr('tonePolite', lang) : tr('toneVeryPolite', lang)}
            </button>
          ))}
        </div>
      </div>

      {/* High-risk confirmation gate */}
      {isHighRisk && !confirmed && (
        <label className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <input type="checkbox" className="mt-1" onChange={(e) => setConfirmed(e.target.checked)} />
          <span>{tr('confirmFacts', lang)}</span>
        </label>
      )}

      {!draft ? (
        <button className="btn-primary" disabled={!confirmed || loading} onClick={generate}>
          {loading ? '…' : tr('confirmAndGenerate', lang)}
        </button>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm leading-relaxed"
            lang="ja"
          />
          <p className="text-xs text-amber-700">{draft.disclaimer}</p>
          <p className="text-[11px] text-slate-400">{tr('replyDisclaimer', lang)}</p>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={copy}>
              {copied ? tr('copied', lang) : tr('copy', lang)}
            </button>
            <button className="btn-secondary" onClick={generate} disabled={loading}>
              ↻
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button className="mt-auto w-full py-2 text-center text-sm font-medium text-slate-500" onClick={onBack}>
        ← {tr('back', lang)}
      </button>
    </div>
  );
}
