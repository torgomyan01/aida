'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

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

export function DashboardsSection() {
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
          filter: `blur(${Math.max(0, (cards.length - 1 - index) * 0.55)}px) saturate(${1 - index * 0.04})`,
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
          start: 'top top+=60',
          end: `+=${(cards.length - 1) * 700}`,
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

    return () => ctx.revert();
  }, []);

  return (
    <section className="dashboards-block">
      <div className="wrapper">
        <h2>Dashboards for every role</h2>
        <p>AIDA provides personalied control panels for different organizational levels</p>

        <section
          ref={sectionRef}
          style={{
            position: 'relative',
            height: `${dashboardItems.length * 95}vh`,
            minHeight: 700,
          }}
        >
          <div ref={pinRef} style={{ position: 'relative', height: 460, perspective: 1200, overflow: 'visible' }}>
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
