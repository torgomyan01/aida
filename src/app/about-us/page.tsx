import type { Metadata } from 'next';

import { LandingAboutSections } from '@/components/landing/about-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

export const metadata: Metadata = {
  title: 'AIDA - About Us',
  description: 'Leadership team and contacts of AIDA Sales.',
};

export default function AboutUsPage() {
  return (
    <LandingPageShell activePage="about-us" darkHeader={true}>
      <LandingAboutSections />
    </LandingPageShell>
  );
}
