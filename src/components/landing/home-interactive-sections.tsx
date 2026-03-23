'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from 'framer-motion';

import { useLocale } from 'next-intl';

import { useBookDemoModal } from '@/components/landing/book-demo-modal';
import { useLandingMessages } from '@/i18n/landing/hooks';

const heroSlideImages = [
  '/landing/img/heru-slider-img1.jpg',
  '/landing/img/heru-slider-img2.jpg',
  '/landing/img/heru-slider-img3.jpg',
];

const stepImages = [
  '/landing/img/step-img1.svg',
  '/landing/img/step-img2.svg',
  '/landing/img/step-img3.svg',
  '/landing/img/step-img4.svg',
];

/** Total ScrollTrigger scrub distance for the whole steps pin (px) */
function getStepsPinScrollPx() {
  if (typeof window === 'undefined') return 500;
  return window.innerWidth <= 767 ? 200 : 500;
}
/** Pin wrapper height — tight to avoid empty green scroll after pin */
function stepsPinContainerHeightVh(stepCount: number) {
  return `${(stepCount - 1) * 20 + 58}vh`;
}

const BANNER_DELAY_MS = 8000;
const CONTENT_FADE_OFFSET_MS = 500;

function HomeHeroSection() {
  const messages = useLandingMessages();
  const { openBookDemo } = useBookDemoModal();
  const heroSlides = useMemo(
    () =>
      messages.hero.slides.map((slide, i) => ({
        title: slide.title,
        image: heroSlideImages[i] ?? heroSlideImages[0],
      })),
    [messages.hero.slides]
  );

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    if (fadeInTimerRef.current) {
      clearTimeout(fadeInTimerRef.current);
      fadeInTimerRef.current = null;
    }
  };

  const scheduleFadeOut = () => {
    if (!swiperRef.current) return;
    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    fadeOutTimerRef.current = setTimeout(() => {
      setContentVisible(false);
    }, BANNER_DELAY_MS - CONTENT_FADE_OFFSET_MS);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <section className="hero-block">
      <Swiper
        className="hero-slider"
        modules={[Autoplay]}
        loop={true}
        speed={750}
        slidesPerView={1}
        spaceBetween={20}
        grabCursor={true}
        simulateTouch={true}
        touchRatio={1.2}
        touchAngle={45}
        autoplay={{
          delay: BANNER_DELAY_MS,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveSlideIndex(swiper.realIndex);
          setContentVisible(true);
          scheduleFadeOut();
        }}
        onSlideChangeTransitionStart={() => {
          setContentVisible(false);
        }}
        onSlideChangeTransitionEnd={(swiper) => {
          setActiveSlideIndex(swiper.realIndex);
          if (fadeInTimerRef.current) clearTimeout(fadeInTimerRef.current);
          fadeInTimerRef.current = setTimeout(() => {
            setContentVisible(true);
          }, CONTENT_FADE_OFFSET_MS);
          scheduleFadeOut();
        }}
      >
        {heroSlides.map((slide, index) => {
          const isVisible = contentVisible && activeSlideIndex === index;
          return (
            <SwiperSlide key={slide.title}>
              <div className="slide-inner" style={{ backgroundImage: `url(${slide.image})` }}>
                <div
                  className="slide-info"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.45s ease, transform 0.45s ease',
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  <h2>
                    {messages.hero.line1} <br /> {messages.hero.line2}{' '}
                    <span className="green-text">{slide.title}</span>
                  </h2>
                  <p>{messages.hero.subtitle}</p>
                  <button type="button" className="green-btn" onClick={openBookDemo}>
                    {messages.hero.cta}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

function HomeStepsSection() {
  const messages = useLandingMessages();
  const locale = useLocale();
  const steps = useMemo(
    () =>
      messages.steps.items.map((step, i) => ({
        ...step,
        image: stepImages[i] ?? stepImages[0],
      })),
    [messages.steps.items]
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !pinRef.current) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const stackGap = 20;
    const frontY = (steps.length - 1) * stackGap;
    const phaseDuration = 1.15;

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
        const baseY = (steps.length - 1 - index) * stackGap;
        gsap.set(card, {
          y: baseY,
          x: 0,
          zIndex: steps.length - index,
          opacity: Math.max(0.5, 1 - index * 0.14),
          scale: 1 - index * 0.03,
          rotateX: index === steps.length - 1 ? 0 : 6,
          rotateY: index === steps.length - 1 ? 0 : -4,
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

      if (cards.length === 1) return;
      const startOffsetPx = window.innerWidth <= 767 ? 20 : 100;
      const stepsPinScrollPx = getStepsPinScrollPx();

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top top+=${startOffsetPx}`,
          end: `+=${stepsPinScrollPx}`,
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
  }, [locale, steps]);

  return (
    <section className="steps-block">
      <div className="wrapper">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {messages.steps.sectionTitle}
        </motion.h2>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          {messages.steps.sectionSubtitle}
        </motion.p>

        <section
          ref={sectionRef}
          className="steps-pin-container"
          style={{
            position: 'relative',
            height: stepsPinContainerHeightVh(steps.length),
            minHeight: 440,
          }}
        >
          <div ref={pinRef} style={{ position: 'relative', height: 520, perspective: 1200, overflow: 'visible' }}>
            <div className="steps" style={{ position: 'relative', height: '100%' }}>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`step ${step.className}`}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, transformOrigin: 'center top' }}
                >
                  <div className="texts">
                    <b>
                      <span>{step.id}</span> {step.title}
                    </b>
                    <span>{step.description}</span>
                  </div>

                  <div className="img-wrap">
                    <img src={step.image} alt={step.title} />
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

export function LandingHomeInteractiveSections() {
  return (
    <>
      <HomeHeroSection />
      <HomeStepsSection />
    </>
  );
}
