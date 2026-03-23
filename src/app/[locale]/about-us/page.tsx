import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingAboutSections } from '@/components/landing/about-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'AIDA - About Us',
  description: 'Leadership team and contacts of AIDA Sales.',
};

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="about-us" darkHeader={true}>
      <LandingAboutSections />
    </LandingPageShell>
  );
}
