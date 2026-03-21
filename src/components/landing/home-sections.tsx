'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

const heroSlides = [
  {
    title: 'Sales',
    image: '/landing/img/heru-slider-img1.jpg',
  },
  {
    title: 'Sales 2',
    image: '/landing/img/heru-slider-img2.jpg',
  },
  {
    title: 'Sales 3',
    image: '/landing/img/heru-slider-img3.jpg',
  },
];

const steps = [
  {
    id: '01.',
    title: 'Record your conversations',
    description:
      'Запись осуществляется как штатными средствами рабочего места менеджера, так и специально установленными микрофонами Aida Sales',
    image: '/landing/img/step-img1.svg',
    className: 'step1',
  },
  {
    id: '02.',
    title: 'Transcribe and diarize',
    description:
      'Модели AIDA Sales позволяют работать с узбекским, русским, английским и симбиозом этих языков даже в сложных диалогах с высоким уровнем шума и нерелевантного контекста',
    image: '/landing/img/step-img2.svg',
    className: 'step2',
  },
  {
    id: '03.',
    title: 'Analyze & Customize dashboards',
    description:
      'Дашборды строятся исходя из сферы, специфики и задач. Могут накладываться скрипты и задачи для разных целей и департаментов: Commerce, Customer Exp, HR',
    image: '/landing/img/step-img3.svg',
    className: 'step3',
  },
  {
    id: '04.',
    title: 'Smart tips for managers everyday',
    description:
      'Динамичные, персонализированные и настраиваемые советы на основе современных методик сервиса и стандартов вашей компании',
    image: '/landing/img/step-img4.svg',
    className: 'step4',
  },
];

const industries = [
  { icon: '/landing/img/industries-icon1.svg', label: 'Public Sector' },
  { icon: '/landing/img/industries-icon2.svg', label: 'Insurance Companies' },
  { icon: '/landing/img/industries-icon3.svg', label: 'Sales Teams' },
  { icon: '/landing/img/industries-icon4.svg', label: 'Tour Operators & Travel Agencies' },
  { icon: '/landing/img/industries-icon5.svg', label: 'Telecom Operators' },
  { icon: '/landing/img/industries-icon6.svg', label: 'Banks & FinTech' },
  { icon: '/landing/img/industries-icon1.svg', label: 'Public Sector' },
  { icon: '/landing/img/industries-icon2.svg', label: 'Insurance Companies' },
];

function HomeHeroSection() {
  return (
    <section className="hero-block">
      <Swiper
        className="hero-slider"
        modules={[Autoplay, EffectCreative]}
        loop={true}
        speed={1000}
        slidesPerView={1}
        spaceBetween={20}
        grabCursor={true}
        simulateTouch={true}
        touchRatio={1.2}
        touchAngle={45}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            scale: 0.9,
            opacity: 0.5,
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="slide-inner" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="slide-info">
                <h2>
                  Tools <br /> to increase <span className="green-text">{slide.title}</span>
                </h2>
                <p>
                  We help <b>banks, telecom</b> and <b>government</b> to improve their service
                  conversation into success clients
                </p>
                <a href="#" className="green-btn">
                  Book Demo
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function HomeStepsSection() {
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
          filter: `blur(${Math.max(0, (steps.length - 1 - index) * 0.55)}px) saturate(${1 - index * 0.04})`,
          boxShadow: '0 24px 50px rgba(5, 77, 40, 0.16)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          force3D: true,
          willChange: 'transform, opacity',
        });
      });
      applyStackOrder(0);

      if (cards.length === 1) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
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
    <section className="steps-block">
      <div className="wrapper">
        <h2>4 Steps to Success</h2>
        <p>From voice to insight. From insight to action</p>

        <section
          ref={sectionRef}
          className="steps-pin-container"
          style={{
            position: 'relative',
            height: `${steps.length * 95}vh`,
            minHeight: 760,
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

function HomeIndustriesSection() {
  return (
    <section className="industries-block">
      <div className="wrapper">
        <h2>
          Built for industries <br /> with the highest standards
        </h2>
        <p>
          When service quality, control, and conversation analytics matter - AIDA Sales delivers
          where results are critical
        </p>
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

export function LandingHomeSections() {
  return (
    <>
      <HomeHeroSection />
      <HomeStepsSection />
      <HomeIndustriesSection />
    </>
  );
}
