import { NextResponse } from 'next/server';

import {
  BOOK_DEMO_RELAY_DEFAULT_URL,
  BOOK_DEMO_RELAY_SECRET as BOOK_DEMO_RELAY_SECRET_FROM_FILE,
} from '@/config/book-demo-relay';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '@/config/book-demo-telegram';
import { bookDemoCorsHeaders, jsonWithCors } from '@/lib/book-demo-cors';
import { dispatchBookDemoTelegram } from '@/lib/book-demo-telegram-dispatch';

type BookDemoBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

const MAX_FIELD = 512;
const RELAY_FETCH_MS = 25_000;

function trimField(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD);
}

/** Comma-separated chat ids — used only when not using relay */
function parseTelegramChatIds(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^-?\d+$/.test(s));
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: bookDemoCorsHeaders(request),
  });
}

export async function POST(request: Request) {
  let body: BookDemoBody;
  try {
    body = (await request.json()) as BookDemoBody;
  } catch {
    return jsonWithCors(request, { error: 'invalid_json' }, { status: 400 });
  }

  const name = trimField(body.name);
  const phone = trimField(body.phone);
  const email = trimField(body.email);

  if (!name || !phone || !email) {
    return jsonWithCors(request, { error: 'validation' }, { status: 400 });
  }

  const relayUrl =
    process.env.BOOK_DEMO_RELAY_URL?.trim() || BOOK_DEMO_RELAY_DEFAULT_URL;
  const relaySecret =
    process.env.BOOK_DEMO_RELAY_SECRET?.trim() ||
    BOOK_DEMO_RELAY_SECRET_FROM_FILE.trim();

  if (relaySecret) {
    try {
      const r = await fetch(relayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${relaySecret}`,
        },
        body: JSON.stringify({ name, phone, email }),
        cache: 'no-store',
        signal: AbortSignal.timeout(RELAY_FETCH_MS),
      });
      const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;
      return NextResponse.json(data, {
        status: r.status,
        headers: bookDemoCorsHeaders(request),
      });
    } catch (err) {
      console.error('[book-demo] relay fetch failed:', err);
      return jsonWithCors(
        request,
        { ok: false, error: 'relay_failed', successful: 0, failed: 0 },
        { status: 200 }
      );
    }
  }

  const token = TELEGRAM_BOT_TOKEN.trim();
  const chatIds = parseTelegramChatIds(TELEGRAM_CHAT_ID);

  if (!token || chatIds.length === 0) {
    return jsonWithCors(request, { error: 'not_configured' }, { status: 503 });
  }

  const { ok, successful, failed } = await dispatchBookDemoTelegram(name, phone, email);

  if (!ok) {
    return jsonWithCors(
      request,
      { ok: false, error: 'telegram_failed', successful, failed },
      { status: 200 }
    );
  }

  return jsonWithCors(request, { ok: true, successful, failed });
}
