import type { Metadata } from 'next';

import { LandingHowItWorksSections } from '@/components/landing/how-it-works-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

export const metadata: Metadata = {
  title: 'AIDA - How It Works',
  description: 'How AIDA analyzes calls and improves sales communication.',
};

export default function HowItWorksPage() {
  return (
    <LandingPageShell activePage="how-it-works" darkHeader={true}>
      <LandingHowItWorksSections />
    </LandingPageShell>
  );
}
