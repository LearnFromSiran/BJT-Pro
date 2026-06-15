'use client';

import type { UiLang } from '@/lib/types';
import { tr } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({
  lang,
  onLang,
  onHistory,
  showHistory = true,
}: {
  lang: UiLang;
  onLang: (l: UiLang) => void;
  onHistory?: () => void;
  showHistory?: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          B
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-slate-900">{tr('appName', lang)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showHistory && onHistory && (
          <button
            onClick={onHistory}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {tr('history', lang)}
          </button>
        )}
        <LanguageSwitcher lang={lang} onChange={onLang} />
      </div>
    </header>
  );
}
