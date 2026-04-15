'use client';

import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { useLocale } from 'next-intl';

import { useLandingMessages } from '@/i18n/landing/hooks';

/** Scroll distance while dashboards stack is pinned (px) — aligned with steps section */
const DASHBOARDS_PIN_SCROLL_PX = 1200;

const DASHBOARDS_PIN_SECTION_HEIGHT_PX = '1600px';

export function DashboardsSection() {
  const messages = useLandingMessages();
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const dashboardItems = useMemo(() => messages.dashboards.items, [messages.dashboards.items]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !pinRef.current) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < 2) return;

    const stackGap = 20;
    const frontY = (cards.length - 1) * stackGap;
    const phaseDuration = 1.15;
    const cardShadow = '0 24px 50px rgba(5, 77, 40, 0.16)';

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        let lastStackIndex = -1;

        const applyStackOrder = (activeIndex: number) => {
          if (activeIndex === lastStackIndex) return;
          lastStackIndex = activeIndex;
          cards.forEach((card, i) => {
            if (i === activeIndex) {
              gsap.set(card, { zIndex: cards.length + 30 });
              return;
            }
            if (i > activeIndex) {
              gsap.set(card, { zIndex: cards.length + 10 - (i - activeIndex) });
              return;
            }
            gsap.set(card, { zIndex: 5 - (activeIndex - i) });
          });
        };

        cards.forEach((card, index) => {
          const baseY = (cards.length - 1 - index) * stackGap;
          gsap.set(card, {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            y: baseY,
            x: 0,
            zIndex: cards.length - index,
            opacity: Math.max(0.52, 1 - index * 0.12),
            scale: 1 - index * 0.028,
            rotateX: index === cards.length - 1 ? 0 : 5,
            rotateY: index === cards.length - 1 ? 0 : -3,
            rotateZ: 0,
            transformPerspective: 1200,
            boxShadow: cardShadow,
            border: '1px solid rgba(255, 255, 255, 0.6)',
            force3D: true,
            transformOrigin: 'center top',
          });
        });
        applyStackOrder(0);

        const startOffsetPx = 100;

        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top top+=${startOffsetPx}`,
            end: `+=${DASHBOARDS_PIN_SCROLL_PX}`,
            scrub: true,
            pin: pinRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            onUpdate: (self) => {
              const mapped = self.progress * (cards.length - 1);
              const activeIndex = Math.max(0, Math.min(cards.length - 1, Math.floor(mapped + 0.35)));
              applyStackOrder(activeIndex);
            },
          },
        });

        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;

          const nextCard = cards[index + 1];
          const transitionStart = index * phaseDuration + 0.2;
          timeline
            .to(
              card,
              {
                y: -250,
                x: 70,
                autoAlpha: 0,
                scale: 0.82,
                rotateX: -18,
                rotateY: 20,
                rotateZ: 6,
                duration: 0.92,
                ease: 'power3.in',
              },
              transitionStart
            )
            .fromTo(
              nextCard,
              {
                y: frontY + 120,
                x: -52,
                autoAlpha: 0.38,
                scale: 0.88,
                rotateX: 10,
                rotateY: -16,
                rotateZ: -2,
              },
              {
                y: frontY - 12,
                x: 0,
                autoAlpha: 1,
                scale: 1.04,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                duration: 0.72,
                ease: 'power4.out',
                immediateRender: false,
              },
              transitionStart
            )
            .to(
              nextCard,
              {
                y: frontY + 2,
                x: 0,
                scale: 0.995,
                rotateX: 1,
                duration: 0.24,
                ease: 'sine.inOut',
              },
              transitionStart + 0.72
            )
            .to(
              nextCard,
              {
                y: frontY,
                scale: 1,
                rotateX: 0,
                duration: 0.26,
                ease: 'sine.out',
              },
              transitionStart + 0.96
            );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [locale, dashboardItems]);

  return (
    <section className="dashboards-block">
      <div className="wrapper">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.55,
            ease: reduceMotion ? 'linear' : 'easeOut',
          }}
        >
          {messages.dashboards.title}
        </motion.h2>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.45,
            delay: reduceMotion ? 0 : 0.1,
            ease: reduceMotion ? 'linear' : 'easeOut',
          }}
        >
          {messages.dashboards.subtitle}
        </motion.p>

        <section
          ref={sectionRef}
          className="dashboards-pin-scroll"
          style={{
            position: 'relative',
            height: DASHBOARDS_PIN_SECTION_HEIGHT_PX,
            minHeight: 440,
          }}
        >
          <div
            ref={pinRef}
            className="dashboards-pin-wrap"
            style={{
              position: 'relative',
              height: 460,
              perspective: 1200,
              overflow: 'visible',
            }}
          >
            <div className="dashboards-items" style={{ position: 'relative', height: '100%' }}>
              {dashboardItems.map((item, index) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="dashboards-item"
                >
                  <div className="texts">
                    <b>{item.title}</b>
                    <span>{item.text}</span>
                  </div>
                  <div className="img">
                    <img src={item.image} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
