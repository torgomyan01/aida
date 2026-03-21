'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type ActivePage = 'home' | 'how-it-works' | 'about-us';

type LandingHeaderProps = {
  activePage: ActivePage;
  darkTheme?: boolean;
};

export function LandingHeader({ activePage, darkTheme = false }: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
                Home
              </Link>
            </li>
            <li className={clsx(activePage === 'how-it-works' && 'active')}>
              <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>
                How It Works
              </Link>
            </li>
            <li className={clsx(activePage === 'about-us' && 'active')}>
              <Link href="/about-us" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </li>
          </ul>

          <div className="languages">
            <a href="#" className="active">
              EN
            </a>
            <a href="#">RU</a>
            <a href="#">UZ</a>
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
