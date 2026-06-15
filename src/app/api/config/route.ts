import { NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/pipeline';

export const runtime = 'nodejs';

// Lets the client know whether real OCR/AI is configured, so it can show the
// demo banner without exposing any secret values.
export async function GET() {
  return NextResponse.json({ demoMode: isDemoMode() });
}
