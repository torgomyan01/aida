'use client';

import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';

const dashboardItems = [
  {
    title: '01. Sales Manager Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img1.png',
  },
  {
    title: '02. C-level Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img2.png',
  },
  {
    title: '03. CX Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img3.png',
  },
];

/** Total ScrollTrigger scrub distance for the dashboards pin (px) — matches steps section */
const DASHBOARDS_PIN_SCROLL_PX = 700;

/** `start` vertical offset (px): tighter on mobile, earlier pin on desktop */
function dashboardsScrollStartOffsetPx(): number {
  if (typeof window === 'undefined') return 200;
  return window.matchMedia('(max-width: 767px)').matches ? 20 : 200;
}

const DASHBOARDS_PIN_SCROLL_HEIGHT_MOBILE_PX = 1000;

function dashboardsPinScrollSectionHeight(itemCount: number, isMobile: boolean): string {
  if (isMobile) return `${DASHBOARDS_PIN_SCROLL_HEIGHT_MOBILE_PX}px`;
  return `${(itemCount - 1) * 20 + 58}vh`;
}

function useIsMobileDashboardsViewport() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia('(max-width: 767px)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false
  );
}

export function DashboardsSection() {
  const isMobile = useIsMobileDashboardsViewport();
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

    const ctx = gsap.context(() => {
      const applyStackOrder = (activeIndex: number) => {
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
          y: baseY,
          x: 0,
          zIndex: cards.length - index,
          opacity: Math.max(0.5, 1 - index * 0.14),
          scale: 1 - index * 0.03,
          rotateX: index === cards.length - 1 ? 0 : 6,
          rotateY: index === cards.length - 1 ? 0 : -4,
          rotateZ: 0,
          transformPerspective: 1400,
          filter: `blur(${index * 0.55}px) saturate(${1 - index * 0.04})`,
          boxShadow: '0 24px 50px rgba(5, 77, 40, 0.16)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          force3D: true,
          willChange: 'transform, opacity',
        });
      });
      applyStackOrder(0);

      const phaseDuration = 1.15;
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: () => `top top-=-${dashboardsScrollStartOffsetPx()}`,
          end: `+=${DASHBOARDS_PIN_SCROLL_PX}`,
          scrub: 0.45,
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
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
              scale: 0.8,
              rotateX: -22,
              rotateY: 24,
              rotateZ: 7,
              filter: 'blur(12px) saturate(0.86)',
              boxShadow: '0 10px 20px rgba(5, 77, 40, 0.09)',
              duration: 0.92,
              ease: 'power3.in',
            },
            transitionStart
          )
          .fromTo(
            nextCard,
            {
              y: frontY + 120,
              x: -56,
              autoAlpha: 0.35,
              scale: 0.86,
              rotateX: 12,
              rotateY: -20,
              rotateZ: -2,
              filter: 'blur(9px) saturate(1.12)',
              boxShadow: '0 28px 62px rgba(5, 77, 40, 0.18)',
            },
            {
              y: frontY - 12,
              x: 0,
              autoAlpha: 1,
              scale: 1.045,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              filter: 'blur(0px) saturate(1)',
              boxShadow: '0 34px 78px rgba(5, 77, 40, 0.24)',
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
              rotateX: 1.2,
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
              boxShadow: '0 24px 56px rgba(5, 77, 40, 0.2)',
            },
            transitionStart + 0.96
          );
      });
    }, sectionRef);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section className="dashboards-block">
      <div className="wrapper">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Dashboards for every role
        </motion.h2>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          AIDA provides personalied control panels for different organizational levels
        </motion.p>

        <section
          ref={sectionRef}
          className="dashboards-pin-scroll"
          style={{
            position: 'relative',
            height: dashboardsPinScrollSectionHeight(dashboardItems.length, isMobile),
            minHeight: isMobile ? 0 : 440,
          }}
        >
          <div
            ref={pinRef}
            className="dashboards-pin-wrap"
            style={{
              position: 'relative',
              height: isMobile ? DASHBOARDS_PIN_SCROLL_HEIGHT_MOBILE_PX : 460,
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
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transformOrigin: 'center top',
                  }}
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
