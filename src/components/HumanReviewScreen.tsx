'use client';

import { useState } from 'react';
import type { AnalysisResult, UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';

export default function HumanReviewScreen({
  lang,
  result,
  onBack,
}: {
  lang: UiLang;
  result: AnalysisResult;
  onBack: () => void;
}) {
  const [consent, setConsent] = useState(false);
  const [contact, setContact] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/human-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: result.id,
          reason: `confidence ${(result.confidence.overall * 100).toFixed(0)}% (${result.confidence.level})`,
          consent,
          contact,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
      setDone(true);
    } catch (e: any) {
      setError(e?.message || tr('error', lang));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-lg font-bold text-slate-900">{tr('humanReviewTitle', lang)}</h2>
      <p className="text-sm text-slate-600">{tr('humanReviewBody', lang)}</p>

      {done ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          ✓ {tr('reviewRequested', lang)}
        </div>
      ) : (
        <>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{tr('consentHuman', lang)}</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email / LINE / phone"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <button className="btn-primary" disabled={!consent || loading} onClick={submit}>
            {loading ? '…' : tr('submit', lang)}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      )}

      <button className="mt-auto w-full py-2 text-center text-sm font-medium text-slate-500" onClick={onBack}>
        ← {tr('back', lang)}
      </button>
    </div>
  );
}
