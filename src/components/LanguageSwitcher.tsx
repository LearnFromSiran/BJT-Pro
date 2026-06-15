'use client';

import type { UiLang } from '@/lib/types';
import { LANG_LABEL } from '@/lib/i18n';

const LANGS: UiLang[] = ['ne', 'ja', 'en'];

export default function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: UiLang;
  onChange: (l: UiLang) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded-full px-3 py-1 font-medium transition ${
            lang === l ? 'bg-brand-600 text-white' : 'text-slate-600'
          }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
