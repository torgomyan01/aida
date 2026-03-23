'use client';

import { useMessages } from 'next-intl';

import type { LandingMessages } from './messages';

/** Typed access to nested landing copy (SSR-provided via NextIntlClientProvider). */
export function useLandingMessages(): LandingMessages {
  return useMessages() as unknown as LandingMessages;
}
