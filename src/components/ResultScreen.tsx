'use client';

import { useState } from 'react';
import type { AnalysisResult, UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { typeLabel } from '@/lib/docTypes';
import ConfidenceBadge from './ConfidenceBadge';

export default function ResultScreen({
  lang,
  result,
  onReply,
  onHumanReview,
  onNew,
}: {
  lang: UiLang;
  result: AnalysisResult;
  onReply: () => void;
  onHumanReview: () => void;
  onNew: () => void;
}) {
  const [showSource, setShowSource] = useState(false);
  const { explanation: ex, extraction, confidence, classification } = result;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Confidence + type */}
      <div className="flex flex-wrap items-center gap-2">
        <ConfidenceBadge level={confidence.level} overall={confidence.overall} label={tr('confidence', lang)} />
        <span className="chip bg-slate-100 text-slate-700">
          {tr('docType', lang)}: {typeLabel(classification.predictedType, lang)}
        </span>
        {result.demo && <span className="chip bg-amber-100 text-amber-800">{tr('demoBadge', lang)}</span>}
      </div>

      {/* Caution banners */}
      {confidence.level === 'red' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {tr('lowConfidence', lang)}
        </div>
      )}
      {confidence.level === 'amber' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {tr('amberConfidence', lang)}
        </div>
      )}

      {/* Summary */}
      <section className="card">
        <h3 className="mb-1 text-sm font-semibold text-slate-500">{tr('meaningNp', lang)}</h3>
        <p className="text-base font-semibold leading-relaxed text-slate-900">{ex.oneSentenceSummary}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{ex.simpleExplanation}</p>
      </section>

      {/* Deadlines */}
      <section className="card">
        <h3 className="mb-2 text-sm font-semibold text-slate-500">{tr('deadline', lang)}</h3>
        {ex.deadlines.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ex.deadlines.map((d, i) => (
              <span key={i} className="chip bg-brand-50 text-brand-700">
                🗓️ {d}
              </span>
            ))}
          </div>
        ) : (
          <span className="chip bg-red-100 text-red-800">{tr('notDetected', lang)}</span>
        )}
      </section>

      {/* Actions */}
      {ex.urgentActions.length > 0 && (
        <section className="card">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">{tr('actions', lang)}</h3>
          <ol className="space-y-2">
            {ex.urgentActions.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-800">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Risk */}
      {ex.risks.length > 0 && (
        <section className="card border-amber-200 bg-amber-50">
          <h3 className="mb-2 text-sm font-semibold text-amber-700">⚠️ {tr('risk', lang)}</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-900">
            {ex.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Questions */}
      {ex.questionsIfUnclear.length > 0 && (
        <section className="card">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">{tr('questions', lang)}</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {ex.questionsIfUnclear.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Japanese source fields (transparency) */}
      <button
        onClick={() => setShowSource((s) => !s)}
        className="text-left text-sm font-medium text-brand-600"
      >
        {showSource ? '▲' : '▼'} {tr('viewJapanese', lang)}
      </button>
      {showSource && (
        <section className="card space-y-3 text-sm">
          {extraction.issuerName && (
            <Row label={tr('issuer', lang)} value={extraction.issuerName} />
          )}
          {extraction.dueDates.map((d, i) => (
            <Row key={`d${i}`} label={tr('deadline', lang)} value={`${d.iso ?? '—'}  「${d.snippet}」`} />
          ))}
          {extraction.amounts.map((a, i) => (
            <Row
              key={`a${i}`}
              label={tr('amount', lang)}
              value={`${a.value != null ? a.value.toLocaleString() : '—'} ${a.currency}  「${a.snippet}」`}
            />
          ))}
          {extraction.contactMethods.length > 0 && (
            <Row label="📞" value={extraction.contactMethods.join(', ')} />
          )}
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer">{tr('sourceSnippet', lang)} (OCR)</summary>
            <pre className="mt-1 whitespace-pre-wrap break-words text-[11px] text-slate-600">
              {result.ocr.text || '(none)'}
            </pre>
          </details>
        </section>
      )}

      {confidence.reasons.length > 0 && (
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer">{tr('confidence', lang)} — details</summary>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {confidence.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Actions footer */}
      <div className="mt-2 space-y-2">
        <button className="btn-primary" onClick={onReply}>
          ✍️ {tr('generateReply', lang)}
        </button>
        <button className="btn-secondary" onClick={onHumanReview}>
          👤 {tr('humanReview', lang)}
        </button>
        <button className="w-full py-2 text-center text-sm font-medium text-slate-500" onClick={onNew}>
          + {tr('newDoc', lang)}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="flex-none font-semibold text-slate-500">{label}:</span>
      <span className="break-words text-slate-800">{value}</span>
    </div>
  );
}
