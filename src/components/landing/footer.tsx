import Link from 'next/link';
import clsx from 'clsx';

type ActivePage = 'home' | 'how-it-works' | 'about-us';

type LandingFooterProps = {
  activePage: ActivePage;
};

export function LandingFooter({ activePage }: LandingFooterProps) {
  return (
    <footer className="footer">
      <div className="wrapper">
        <ul className="footer-menu">
          <li className={clsx(activePage === 'home' && 'active')}>
            <Link href="/">Home</Link>
          </li>
          <li className={clsx(activePage === 'how-it-works' && 'active')}>
            <Link href="/how-it-works">How It Works</Link>
          </li>
          <li className={clsx(activePage === 'about-us' && 'active')}>
            <Link href="/about-us">About Us</Link>
          </li>
        </ul>
        <div className="footer-bottom">
          <img src="/landing/img/footer-logo.svg" alt="AIDA footer logo" className="footer-logo" />
          <p className="copyright">© 2026 AIDA Sales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
