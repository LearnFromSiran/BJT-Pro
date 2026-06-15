'use client';

import { useEffect, useState } from 'react';
import type { AnalysisResult, RiskLevel, UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { typeLabel } from '@/lib/docTypes';
import { deleteEntry, loadHistory, type HistoryEntry } from '@/lib/historyStore';

export default function HistoryScreen({
  lang,
  onOpen,
  onBack,
}: {
  lang: UiLang;
  onOpen: (result: AnalysisResult) => void;
  onBack: () => void;
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  function remove(id: string) {
    deleteEntry(id);
    setEntries(loadHistory());
  }

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <h2 className="text-lg font-bold text-slate-900">{tr('history', lang)}</h2>

      {entries.length === 0 && <p className="text-sm text-slate-500">{tr('noHistory', lang)}</p>}

      {entries.map((e) => (
        <div key={e.id} className="card">
          <div className="flex items-center justify-between gap-2">
            <span className="chip bg-slate-100 text-slate-700">
              {typeLabel(e.documentType as any, lang)}
            </span>
            <span className={`chip ${dot(e.level as RiskLevel)}`}>{Math.round(e.confidence * 100)}%</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-800">{e.summary}</p>
          <p className="mt-1 text-[11px] text-slate-400">{new Date(e.createdAt).toLocaleString()}</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-secondary py-2 text-sm" onClick={() => onOpen(e.result)}>
              {tr('open', lang)}
            </button>
            <button
              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
              onClick={() => remove(e.id)}
            >
              {tr('deleteForever', lang)}
            </button>
          </div>
        </div>
      ))}

      <button className="mt-auto w-full py-2 text-center text-sm font-medium text-slate-500" onClick={onBack}>
        ← {tr('back', lang)}
      </button>
    </div>
  );
}

function dot(level: RiskLevel): string {
  return level === 'green'
    ? 'bg-green-100 text-green-800'
    : level === 'amber'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-red-100 text-red-800';
}
