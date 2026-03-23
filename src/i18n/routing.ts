import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'uz'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
