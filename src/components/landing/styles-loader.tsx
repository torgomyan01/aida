'use client';

import { useEffect } from 'react';

const FONT_LINK_ID = 'landing-fonts';
const STYLE_LINK_ID = 'landing-style';

export function LandingStylesLoader() {
  useEffect(() => {
    let styleLink = document.getElementById(STYLE_LINK_ID) as HTMLLinkElement | null;
    let fontLink = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;

    if (!styleLink) {
      styleLink = document.createElement('link');
      styleLink.id = STYLE_LINK_ID;
      styleLink.rel = 'stylesheet';
      styleLink.href = '/landing/css/style.css';
      document.head.appendChild(styleLink);
    }

    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = FONT_LINK_ID;
      fontLink.rel = 'stylesheet';
      fontLink.href =
        'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Unbounded:wght@200..900&display=swap';
      document.head.appendChild(fontLink);
    }
  }, []);

  return null;
}
