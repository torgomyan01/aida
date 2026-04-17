import { ProxyAgent, fetch as undiciFetch } from 'undici';

import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '@/config/book-demo-telegram';

const TELEGRAM_FETCH_MS = 25_000;

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

export type BookDemoDispatchResult = { ok: boolean; successful: number; failed: number };

/** Sends the demo form payload to all configured Telegram chats (same host must reach Telegram). */
export async function dispatchBookDemoTelegram(
  name: string,
  phone: string,
  email: string
): Promise<BookDemoDispatchResult> {
  const token = TELEGRAM_BOT_TOKEN.trim();
  const chatIds = parseTelegramChatIds(TELEGRAM_CHAT_ID);

  if (!token || chatIds.length === 0) {
    return { ok: false, successful: 0, failed: 0 };
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

  return { ok: successful > 0, successful, failed };
}
