'use client';

import { useMemo } from 'react';

import { useLandingMessages } from '@/i18n/landing/hooks';

const industryIcons = [
  '/landing/img/industries-icon1.svg',
  '/landing/img/industries-icon2.svg',
  '/landing/img/industries-icon3.svg',
  '/landing/img/industries-icon4.svg',
  '/landing/img/industries-icon5.svg',
  '/landing/img/industries-icon6.svg',
];

export function HomeIndustriesSection() {
  const messages = useLandingMessages();

  const industries = useMemo(() => {
    const labels = messages.industries.labels;
    return [...labels, ...labels].map((label, index) => ({
      icon: industryIcons[index % industryIcons.length],
      label,
    }));
  }, [messages.industries.labels]);

  return (
    <section className="industries-block">
      <div className="wrapper">
        <h2>
          {messages.industries.titleLine1} <br /> {messages.industries.titleLine2}
        </h2>
        <p>{messages.industries.subtitle}</p>
        <div className="industries-items">
          <div className="scroll">
            <div className="scroll-in">
              {industries.map((industry, index) => (
                <div key={`${industry.label}-${index}`} className="industries-item">
                  <span className="icon">
                    <img src={industry.icon} alt={industry.label} />
                  </span>
                  <span className="text">{industry.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
