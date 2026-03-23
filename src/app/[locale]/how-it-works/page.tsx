import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LandingHowItWorksSections } from '@/components/landing/how-it-works-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'AIDA - How It Works',
  description: 'How AIDA analyzes calls and improves sales communication.',
};

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingPageShell activePage="how-it-works" darkHeader={true}>
      <LandingHowItWorksSections />
    </LandingPageShell>
  );
}
