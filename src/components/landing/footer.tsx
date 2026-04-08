'use client';

import clsx from 'clsx';

import { Link } from '@/i18n/navigation';
import { useLandingMessages } from '@/i18n/landing/hooks';

type ActivePage = 'home' | 'how-it-works' | 'about-us';

type LandingFooterProps = {
  activePage: ActivePage;
};

export function LandingFooter({ activePage }: LandingFooterProps) {
  const messages = useLandingMessages();

  return (
    <footer className="footer">
      <div className="wrapper px-[150px]!">
        <ul className="footer-menu">
          <li className={clsx(activePage === 'home' && 'active')}>
            <Link href="/">{messages.header.nav.home}</Link>
          </li>
          <li className={clsx(activePage === 'how-it-works' && 'active')}>
            <Link href="/how-it-works">{messages.header.nav.howItWorks}</Link>
          </li>
          <li className={clsx(activePage === 'about-us' && 'active')}>
            <Link href="/about-us">{messages.header.nav.aboutUs}</Link>
          </li>
        </ul>
        <div className="footer-bottom">
          <img src="/landing/img/footer-logo.svg" alt="AIDA footer logo" className="footer-logo" />
          <p className="copyright">{messages.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
