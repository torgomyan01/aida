import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingHomeSections } from '@/components/landing/home-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://aida-sales.uz';

const SEO_BY_LOCALE = {
  en: {
    title: 'AIDA Sales - AI Conversation Intelligence Platform',
    description:
      'Analyze customer conversations, improve service quality, and boost team performance with AI-powered call analytics.',
    localeTag: 'en_US',
    path: '/',
  },
  ru: {
    title: 'AIDA Sales - Платформа AI-аналитики разговоров',
    description:
      'Анализируйте разговоры с клиентами, повышайте качество сервиса и эффективность команды с помощью AI.',
    localeTag: 'ru_RU',
    path: '/ru',
  },
  uz: {
    title: 'AIDA Sales - Suhbatlar AI-analitika platformasi',
    description:
      'Mijoz bilan suhbatlarni tahlil qiling, xizmat sifatini va jamoa samaradorligini AI yordamida oshiring.',
    localeTag: 'uz_UZ',
    path: '/uz',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_BY_LOCALE[locale as keyof typeof SEO_BY_LOCALE] ?? SEO_BY_LOCALE.en;
  const canonical = `${BASE_URL}${seo.path}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/`,
        ru: `${BASE_URL}/ru`,
        uz: `${BASE_URL}/uz`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: 'website',
      locale: seo.localeTag,
      siteName: 'AIDA Sales',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="home">
      <LandingHomeSections />
    </LandingPageShell>
  );
}
