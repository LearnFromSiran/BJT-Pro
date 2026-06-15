import { NextRequest, NextResponse } from 'next/server';
import { analyze, analyzeDemo, isDemoMode } from '@/lib/pipeline';
import type { UiLang, UploadedPage } from '@/lib/types';
import { SAMPLE_LETTERS } from '@/lib/demo';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface AnalyzeBody {
  lang: UiLang;
  pages?: UploadedPage[];
  /** id of a built-in sample letter (demo onboarding) */
  sampleId?: string;
  /** force demo path */
  demo?: boolean;
}

export async function POST(req: NextRequest) {
  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const lang: UiLang = body.lang || 'ne';

  try {
    // 1) Built-in sample → always demo path with its canned OCR text.
    if (body.sampleId) {
      const sample = SAMPLE_LETTERS.find((s) => s.id === body.sampleId);
      if (!sample) {
        return NextResponse.json({ error: 'Unknown sampleId' }, { status: 404 });
      }
      return NextResponse.json(analyzeDemo(sample.ocrText, lang));
    }

    const pages = body.pages ?? [];
    if (pages.length === 0) {
      return NextResponse.json({ error: 'No pages provided' }, { status: 400 });
    }

    // 2) Demo mode (no keys) → cannot OCR a real photo, so explain that and
    //    fall back to a generic demo result keyed off any embedded text.
    if (body.demo || isDemoMode()) {
      // We can't OCR without a key; return a clear demo notice + generic shell.
      const result = analyzeDemo('', lang);
      result.confidence.reasons.unshift(
        'Demo mode: real OCR is disabled. Add GOOGLE_VISION_API_KEY and OPENAI_API_KEY, or try a built-in sample letter.',
      );
      return NextResponse.json(result);
    }

    // 3) Live pipeline
    const result = await analyze(pages, lang);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('analyze error', err);
    return NextResponse.json(
      { error: err?.message || 'Analysis failed' },
      { status: 500 },
    );
  }
}
