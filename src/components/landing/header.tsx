'use client';

import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { useLandingMessages } from '@/i18n/landing/hooks';
import { LANDING_LOCALES } from '@/i18n/landing/messages';

type ActivePage = 'home' | 'how-it-works' | 'about-us';

type LandingHeaderProps = {
  activePage: ActivePage;
  darkTheme?: boolean;
};

export function LandingHeader({ activePage, darkTheme = false }: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const messages = useLandingMessages();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle('overflow', menuOpen);
    document.body.classList.toggle('overflow', menuOpen);

    return () => {
      document.documentElement.classList.remove('overflow');
      document.body.classList.remove('overflow');
    };
  }, [menuOpen]);

  const logoSrc = darkTheme ? '/landing/img/logo-black.svg' : '/landing/img/logo.svg';

  return (
    <header className={clsx('header', darkTheme && 'black-theme', menuOpen && 'bg')}>
      <div className="header-info">
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src={logoSrc} alt="AIDA logo" />
        </Link>

        <div className={clsx('menu-wrap', menuOpen && 'open')}>
          <ul className="main-menu">
            <li className={clsx(activePage === 'home' && 'active')}>
              <Link href="/" onClick={() => setMenuOpen(false)}>
                {messages.header.nav.home}
              </Link>
            </li>
            <li className={clsx(activePage === 'how-it-works' && 'active')}>
              <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>
                {messages.header.nav.howItWorks}
              </Link>
            </li>
            <li className={clsx(activePage === 'about-us' && 'active')}>
              <Link href="/about-us" onClick={() => setMenuOpen(false)}>
                {messages.header.nav.aboutUs}
              </Link>
            </li>
          </ul>

          <div className="languages">
            {LANDING_LOCALES.map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                className={clsx(locale === code && 'active')}
                onClick={() => setMenuOpen(false)}
                prefetch={false}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={clsx('drop-menu', menuOpen && 'is-active')}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>
      </div>
    </header>
  );
}
