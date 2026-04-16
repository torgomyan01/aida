import { NextResponse } from 'next/server';

type BookDemoBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

const MAX_FIELD = 512;

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

async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean }> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { ok?: boolean };
  return { ok: Boolean(data.ok) };
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

  const results = await Promise.all(
    chatIds.map((chatId) => sendTelegramMessage(token, chatId, text))
  );

  if (!results.every((r) => r.ok)) {
    return NextResponse.json({ error: 'telegram_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
