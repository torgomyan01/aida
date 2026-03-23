'use client';

import { useLandingMessages } from '@/i18n/landing/hooks';

export function LandingAboutSections() {
  const messages = useLandingMessages();
  const leaders = messages.about.leaders;

  return (
    <section className="about-us-block">
      <div className="wrapper">
        <div className="info-wrap">
          <div className="info">
            <span className="style-text">{messages.about.eyebrow}</span>
            <h1>
              {messages.about.titleAbout} <span className="green-text">{messages.about.titleUs}</span>
            </h1>
            <div className="contact-info">
              <span>{messages.about.phoneLabel}</span>
              <a href="tel:+998999999999">+998 99 999 99 99</a>
            </div>
            <div className="contact-info">
              <span>{messages.about.emailLabel} </span>
              <a href="mailto:aida@sales.uz">aida@sales.uz</a>
            </div>
            <div className="contact-info">
              <span>{messages.about.addressLabel} </span>
              <b>
                {messages.about.addressLine1} <br /> {messages.about.addressLine2}
              </b>
            </div>
          </div>

          {leaders.map((leader) => (
            <div key={leader.name} className={`info-item${leader.top ? ' item-top' : ''}`}>
              <div className="img-wrap">
                <img src={leader.image} alt={leader.name} />
              </div>
              <b>{leader.name}</b>
              <span>{leader.bio}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
