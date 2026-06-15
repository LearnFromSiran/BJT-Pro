import { NextRequest, NextResponse } from 'next/server';
import { generateReply, isDemoMode } from '@/lib/pipeline';
import type { ReplyTone } from '@/lib/types';

export const runtime = 'nodejs';

interface ReplyBody {
  goal?: string;
  confirmedFacts?: string;
  tone?: ReplyTone;
}

export async function POST(req: NextRequest) {
  let body: ReplyBody;
  try {
    body = (await req.json()) as ReplyBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const draft = await generateReply({
      goal: body.goal ?? '',
      confirmedFacts: body.confirmedFacts ?? '',
      tone: body.tone === 'very_polite' ? 'very_polite' : 'polite',
      demo: isDemoMode(),
    });
    return NextResponse.json(draft);
  } catch (err: any) {
    console.error('reply-draft error', err);
    return NextResponse.json({ error: err?.message || 'Reply generation failed' }, { status: 500 });
  }
}
