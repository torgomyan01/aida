/**
 * When the main host cannot reach Telegram, `/api/book-demo` forwards here (same Bearer secret).
 * Deploy the same app on Vercel; override URL only if the deployment domain changes.
 */
export const BOOK_DEMO_RELAY_DEFAULT_URL =
  'https://aida-woad.vercel.app/api/book-demo-relay';

/** Must match `BOOK_DEMO_RELAY_SECRET` on Vercel. Leave empty to use env `BOOK_DEMO_RELAY_SECRET` only. */
export const BOOK_DEMO_RELAY_SECRET = '';
