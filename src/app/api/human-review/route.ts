import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ReviewBody {
  documentId?: string;
  reason?: string;
  consent?: boolean;
  contact?: string;
}

// In production this would insert into the `human_reviews` table (Supabase)
// and notify the founder/admin dashboard. For the MVP we acknowledge the
// request; persistence is wired when SUPABASE_SERVICE_ROLE_KEY is configured.
export async function POST(req: NextRequest) {
  let body: ReviewBody;
  try {
    body = (await req.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.consent) {
    return NextResponse.json(
      { error: 'Consent is required to share the document with a human reviewer.' },
      { status: 400 },
    );
  }

  // TODO: persist to Supabase `human_reviews` + notify reviewer.
  console.log('human-review requested', {
    documentId: body.documentId,
    reason: body.reason,
    hasContact: !!body.contact,
  });

  return NextResponse.json({ ok: true, status: 'queued' });
}
