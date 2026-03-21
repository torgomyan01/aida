import type { Metadata } from 'next';
import { LandingHomeSections } from '@/components/landing/home-sections';
import { LandingPageShell } from '@/components/landing/page-shell';

export const metadata: Metadata = {
  title: 'AIDA - Sales platform ',
  description: 'AIDA Sales platform overview and industry solutions.',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return (
    <LandingPageShell activePage="home">
      <LandingHomeSections />
    </LandingPageShell>
  );
}
