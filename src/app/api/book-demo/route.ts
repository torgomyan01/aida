import { NextResponse } from 'next/server';
import { ProxyAgent, fetch as undiciFetch } from 'undici';

type BookDemoBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

const MAX_FIELD = 512;
/** Outbound request budget; avoids hanging when the host cannot reach Telegram */
const TELEGRAM_FETCH_MS = 25_000;

function trimField(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD);
}

/** Comma-separated chat ids, e.g. `123,456,-100123` */
function parseTelegramChatIds(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^-?\d+$/.test(s));
}

function telegramApiOrigin(): string {
  const raw = process.env.TELEGRAM_API_ORIGIN?.trim() || 'https://api.telegram.org';
  return raw.replace(/\/$/, '');
}

type OutboundFetch = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * When the server cannot open TCP to Telegram (e.g. DC blocked), set TELEGRAM_HTTPS_PROXY to an
 * HTTP(S) proxy that can reach api.telegram.org — same idea as routing traffic via another host.
 * RentCar uses plain fetch; blocked hosts need a proxy or alternate API origin.
 */
function createOutboundFetch(): OutboundFetch {
  const proxy =
    process.env.TELEGRAM_HTTPS_PROXY?.trim() || process.env.TELEGRAM_HTTP_PROXY?.trim();
  if (!proxy) return (input, init) => fetch(input, init);

  const dispatcher = new ProxyAgent(proxy);
  return (input, init) =>
    undiciFetch(input, {
      method: init?.method,
      headers: init?.headers,
      body: init?.body === null ? undefined : init?.body,
      signal: init?.signal ?? undefined,
      dispatcher,
    } as Parameters<typeof undiciFetch>[1]) as unknown as Promise<Response>;
}

async function sendTelegramMessage(
  doFetch: OutboundFetch,
  token: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean }> {
  const url = `${telegramApiOrigin()}/bot${token}/sendMessage`;
  try {
    const res = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TELEGRAM_FETCH_MS),
    });
    const data = (await res.json()) as { ok?: boolean };
    return { ok: Boolean(data.ok) };
  } catch (err) {
    console.error('[book-demo] Telegram sendMessage failed:', err);
    return { ok: false };
  }
}

export async function POST(request: Request) {
  let body: BookDemoBody;
  try {
    body = (await request.json()) as BookDemoBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = trimField(body.name);
  const phone = trimField(body.phone);
  const email = trimField(body.email);

  if (!name || !phone || !email) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = parseTelegramChatIds(process.env.TELEGRAM_CHAT_ID);

  if (!token || chatIds.length === 0) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const text = [
    'Новая заявка на демо',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Email: ${email}`,
  ].join('\n');

  const doFetch = createOutboundFetch();
  const settled = await Promise.allSettled(
    chatIds.map((chatId) => sendTelegramMessage(doFetch, token, chatId, text))
  );

  const successful = settled.filter(
    (r) => r.status === 'fulfilled' && r.value.ok
  ).length;
  const failed = chatIds.length - successful;

  if (successful === 0) {
    return NextResponse.json(
      { ok: false, error: 'telegram_failed', successful, failed },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, successful, failed });
}
