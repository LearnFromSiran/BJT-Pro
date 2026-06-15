'use client';

import { useRef } from 'react';
import type { UiLang, UploadedPage } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { fileToPage } from '@/lib/fileUtils';
import { SAMPLE_LETTERS } from '@/lib/demo';

export default function WelcomeUpload({
  lang,
  demoMode,
  onPages,
  onSample,
}: {
  lang: UiLang;
  demoMode: boolean;
  onPages: (pages: UploadedPage[]) => void;
  onSample: (id: string) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const pages = await Promise.all(Array.from(files).map(fileToPage));
    onPages(pages);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
        <h1 className="text-lg font-bold leading-snug">{tr('tagline', lang)}</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-50">{tr('heroPromise', lang)}</p>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button className="btn-primary" onClick={() => cameraRef.current?.click()}>
        📷 {tr('takePhoto', lang)}
      </button>
      <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
        🖼️ {tr('uploadFile', lang)}
      </button>

      {demoMode && (
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          {tr('demoNote', lang)}
        </div>
      )}

      <div className="card">
        <div className="mb-2 text-sm font-semibold text-slate-700">{tr('tryDemo', lang)}</div>
        <div className="flex flex-col gap-2">
          {SAMPLE_LETTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSample(s.id)}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm active:bg-slate-50"
            >
              <span>{s.title}</span>
              <span className="text-brand-600">{tr('open', lang)} →</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-2 text-[11px] leading-relaxed text-slate-400">
        <p>⚠️ {tr('notLegalAdvice', lang)}</p>
        <p>🔒 {tr('privacyNote', lang)}</p>
      </div>
    </div>
  );
}
