'use client';

import { useRef } from 'react';
import type { UiLang, UploadedPage } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { fileToPage } from '@/lib/fileUtils';

export default function ReviewScreen({
  lang,
  pages,
  onChange,
  onBack,
  onAnalyze,
}: {
  lang: UiLang;
  pages: UploadedPage[];
  onChange: (pages: UploadedPage[]) => void;
  onBack: () => void;
  onAnalyze: () => void;
}) {
  const addRef = useRef<HTMLInputElement>(null);

  async function add(files: FileList | null) {
    if (!files) return;
    const more = await Promise.all(Array.from(files).map(fileToPage));
    onChange([...pages, ...more]);
  }

  function remove(idx: number) {
    onChange(pages.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{tr('reviewTitle', lang)}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('reviewHint', lang)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pages.map((p, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border border-slate-200">
            {p.mimeType === 'application/pdf' ? (
              <div className="flex h-32 items-center justify-center bg-slate-100 text-xs text-slate-500">
                PDF · {p.name}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.dataUrl} alt={`page ${i + 1}`} className="h-32 w-full object-cover" />
            )}
            <button
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              ✕
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[10px] text-white">
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <input
        ref={addRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
      <button className="btn-secondary" onClick={() => addRef.current?.click()}>
        ＋ {tr('addPage', lang)}
      </button>

      <div className="mt-auto flex gap-3">
        <button className="btn-secondary" onClick={onBack}>
          {tr('back', lang)}
        </button>
        <button className="btn-primary" disabled={pages.length === 0} onClick={onAnalyze}>
          {tr('analyze', lang)}
        </button>
      </div>
    </div>
  );
}
