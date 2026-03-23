'use client';

import { useBookDemoModal } from '@/components/landing/book-demo-modal';
import { useLandingMessages } from '@/i18n/landing/hooks';

export function LandingCtaSection() {
  const messages = useLandingMessages();
  const { openBookDemo } = useBookDemoModal();

  return (
    <section className="information-block">
      <div className="wrapper">
        <h2>
          <span className="green-text">{messages.cta.titleLine1}</span> {messages.cta.titleLine2}
        </h2>
        <p>{messages.cta.subtitle}</p>
        <button type="button" className="green-btn" onClick={openBookDemo}>
          {messages.cta.button}
        </button>
      </div>
    </section>
  );
}
