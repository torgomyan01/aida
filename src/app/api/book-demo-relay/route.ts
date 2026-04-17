import { timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';

import { dispatchBookDemoTelegram } from '@/lib/book-demo-telegram-dispatch';

type Body = { name?: unknown; phone?: unknown; email?: unknown };

const MAX_FIELD = 512;

function trimField(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD);
}

function secretOk(expected: string, got: string | null): boolean {
  if (!got || expected.length !== got.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(got, 'utf8'));
  } catch {
    return false;
  }
}

/**
 * Server-to-server relay: Vercel (or any host that can reach Telegram) exposes this route;
 * blocked hosts call it with Authorization: Bearer <BOOK_DEMO_RELAY_SECRET>.
 */
export async function POST(request: Request) {
  const expected = process.env.BOOK_DEMO_RELAY_SECRET?.trim();
  if (!expected) {
    return NextResponse.json({ error: 'relay_not_configured' }, { status: 503 });
  }

  const auth = request.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  if (!secretOk(expected, bearer)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = trimField(body.name);
  const phone = trimField(body.phone);
  const email = trimField(body.email);

  if (!name || !phone || !email) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  const { ok, successful, failed } = await dispatchBookDemoTelegram(name, phone, email);

  if (!ok) {
    return NextResponse.json(
      { ok: false, error: 'telegram_failed', successful, failed },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, successful, failed });
}
