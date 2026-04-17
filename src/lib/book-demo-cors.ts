import { NextResponse } from 'next/server';

/**
 * Browser on https://aida.sale → https://aida-woad.vercel.app/api/book-demo (cross-origin).
 * Extend via BOOK_DEMO_CORS_ORIGINS (comma-separated) on the Vercel deployment.
 */
const DEFAULT_ALLOWED = new Set([
  'https://aida.sale',
  'https://www.aida.sale',
  'https://aida-woad.vercel.app',
  'http://localhost:3000',
]);

function allowedOrigins(): Set<string> {
  const s = new Set(DEFAULT_ALLOWED);
  const raw = process.env.BOOK_DEMO_CORS_ORIGINS?.trim();
  if (raw) {
    for (const o of raw.split(',')) {
      const t = o.trim();
      if (t) s.add(t);
    }
  }
  return s;
}

export function bookDemoCorsAllowOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;
  return allowedOrigins().has(origin) ? origin : null;
}

export function bookDemoCorsHeaders(request: Request): Record<string, string> {
  const allow = bookDemoCorsAllowOrigin(request);
  if (!allow) return {};
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function jsonWithCors(
  request: Request,
  body: unknown,
  init?: { status?: number }
): NextResponse {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: bookDemoCorsHeaders(request),
  });
}
