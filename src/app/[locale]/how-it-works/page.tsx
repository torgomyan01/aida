import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingHowItWorksSections } from '@/components/landing/how-it-works-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://aida-sales.uz';

const SEO_BY_LOCALE = {
  en: {
    title: 'How AIDA Sales Works - AI Call Analytics Flow',
    description:
      'See how AIDA captures calls, transcribes speech, analyzes conversations, and delivers dashboards and coaching insights.',
    localeTag: 'en_US',
    path: '/how-it-works',
  },
  ru: {
    title: 'Как работает AIDA Sales - AI-аналитика звонков',
    description:
      'Узнайте, как AIDA записывает звонки, анализирует диалоги и формирует дашборды и рекомендации для команды.',
    localeTag: 'ru_RU',
    path: '/ru/how-it-works',
  },
  uz: {
    title: 'AIDA Sales qanday ishlaydi - AI qo‘ng‘iroq tahlili',
    description:
      'AIDA qo‘ng‘iroqlarni yozib olishi, tahlil qilishi va dashboard hamda tavsiyalar berishini ko‘ring.',
    localeTag: 'uz_UZ',
    path: '/uz/how-it-works',
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
        en: `${BASE_URL}/how-it-works`,
        ru: `${BASE_URL}/ru/how-it-works`,
        uz: `${BASE_URL}/uz/how-it-works`,
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

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="how-it-works" darkHeader={true}>
      <LandingHowItWorksSections />
    </LandingPageShell>
  );
}
