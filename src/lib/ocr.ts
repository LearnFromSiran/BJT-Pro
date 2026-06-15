import type { OcrResult, UploadedPage } from './types';

// Google Cloud Vision OCR adapter. Uses DOCUMENT_TEXT_DETECTION which is
// optimized for dense documents and exposes page/block/paragraph/word
// confidence. Japanese (ja) is set as a language hint.
//
// Docs: https://cloud.google.com/vision/docs/ocr

const VISION_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

function stripDataUrl(dataUrl: string): string {
  const comma = dataUrl.indexOf(',');
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

export function hasVisionKey(): boolean {
  return !!process.env.GOOGLE_VISION_API_KEY;
}

export async function runOcr(pages: UploadedPage[]): Promise<OcrResult> {
  const start = Date.now();
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_VISION_API_KEY not set');
  }

  const requests = pages.map((p) => ({
    image: { content: stripDataUrl(p.dataUrl) },
    features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
    imageContext: { languageHints: ['ja', 'ne', 'en'] },
  }));

  const res = await fetch(`${VISION_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vision API error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const responses: any[] = data.responses ?? [];

  const texts: string[] = [];
  const confidences: number[] = [];

  for (const r of responses) {
    const full = r.fullTextAnnotation;
    if (full?.text) texts.push(full.text);
    // Aggregate word/page confidences when present.
    for (const page of full?.pages ?? []) {
      if (typeof page.confidence === 'number') confidences.push(page.confidence);
    }
  }

  const avgConfidence =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : texts.length > 0
        ? 0.8 // text returned but no confidence field — assume decent
        : 0.0;

  return {
    text: texts.join('\n\n').trim(),
    avgConfidence,
    provider: 'google_vision',
    durationMs: Date.now() - start,
  };
}
