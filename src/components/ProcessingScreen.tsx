'use client';

import { useEffect, useState } from 'react';
import type { UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';

const STEP_KEYS = ['stepOcr', 'stepClassify', 'stepExtract', 'stepExplain', 'stepConfidence'] as const;

export default function ProcessingScreen({ lang }: { lang: UiLang }) {
  const [active, setActive] = useState(0);

  // Animate through the visible trust-layer steps while the request runs.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => Math.min(a + 1, STEP_KEYS.length - 1));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
      <h2 className="text-center text-base font-semibold text-slate-800">{tr('processing', lang)}</h2>
      <ul className="w-full max-w-xs space-y-3">
        {STEP_KEYS.map((key, i) => (
          <li key={key} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                i < active
                  ? 'bg-green-500 text-white'
                  : i === active
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i < active ? '✓' : i + 1}
            </span>
            <span className={i <= active ? 'text-slate-800' : 'text-slate-400'}>
              {tr(key, lang)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
