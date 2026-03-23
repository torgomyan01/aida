import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingHomeSections } from '@/components/landing/home-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'AIDA - Sales platform ',
  description: 'AIDA Sales platform overview and industry solutions.',
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="home">
      <LandingHomeSections />
    </LandingPageShell>
  );
}
