import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingAboutSections } from '@/components/landing/about-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://aida-sales.uz';

const SEO_BY_LOCALE = {
  en: {
    title: 'About AIDA Sales - Team and Contacts',
    description: 'Meet the AIDA Sales leadership team and get in touch with our experts.',
    localeTag: 'en_US',
    path: '/about-us',
  },
  ru: {
    title: 'О AIDA Sales - Команда и контакты',
    description: 'Познакомьтесь с командой AIDA Sales и свяжитесь с нашими экспертами.',
    localeTag: 'ru_RU',
    path: '/ru/about-us',
  },
  uz: {
    title: 'AIDA Sales haqida - Jamoa va kontaktlar',
    description: 'AIDA Sales jamoasi bilan tanishing va mutaxassislarimiz bilan bog‘laning.',
    localeTag: 'uz_UZ',
    path: '/uz/about-us',
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
        en: `${BASE_URL}/about-us`,
        ru: `${BASE_URL}/ru/about-us`,
        uz: `${BASE_URL}/uz/about-us`,
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

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="about-us" darkHeader={true}>
      <LandingAboutSections />
    </LandingPageShell>
  );
}
