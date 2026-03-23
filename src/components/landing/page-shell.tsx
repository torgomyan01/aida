import { ReactNode } from 'react';

import { BookDemoModalProvider } from './book-demo-modal';
import { LandingCtaSection } from './cta-section';
import { LandingFooter } from './footer';
import { LandingHeader } from './header';

type ActivePage = 'home' | 'how-it-works' | 'about-us';

type LandingPageShellProps = {
  children: ReactNode;
  activePage: ActivePage;
  darkHeader?: boolean;
};

export function LandingPageShell({
  children,
  activePage,
  darkHeader = false,
}: LandingPageShellProps) {
  return (
    <BookDemoModalProvider>
      <LandingHeader activePage={activePage} darkTheme={darkHeader} />
      {children}
      <LandingCtaSection />
      <LandingFooter activePage={activePage} />
    </BookDemoModalProvider>
  );
}
