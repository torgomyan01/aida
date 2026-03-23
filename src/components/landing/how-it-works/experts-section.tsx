'use client';

import 'swiper/css/effect-cards';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useLocale } from 'next-intl';

import { useLandingMessages } from '@/i18n/landing/hooks';

type SwiperLike = {
  activeIndex: number;
  slideTo: (index: number, speed?: number) => void;
};

export function ExpertsSection() {
  const messages = useLandingMessages();
  const locale = useLocale();
  const expertTips = useMemo(() => messages.experts.tips, [messages.experts.tips]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const swiperRef = useRef<SwiperLike | null>(null);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || expertTips.length < 2) return;

    const totalSlides = expertTips.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top-=60',
        end: `+=${(totalSlides - 1) * 560}`,
        scrub: 0.35,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const swiper = swiperRef.current;
          if (!swiper) return;

          const nextIndex = Math.max(
            0,
            Math.min(totalSlides - 1, Math.round(self.progress * (totalSlides - 1)))
          );

          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            swiper.slideTo(nextIndex, 650);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [expertTips.length, locale]);

  return (
    <section ref={sectionRef} className="from-experts-block">
      <div className="wrapper">
        <div className="experts-info">
          <div className="experts-texts">
            <span className="style-text">{messages.experts.eyebrow}</span>
            <h2>{messages.experts.title}</h2>
            <p>{messages.experts.subtitle}</p>
          </div>

          <div className="experts-items experts-items--swiper">
            <Swiper
              className="experts-tips-swiper"
              modules={[EffectCards]}
              effect="cards"
              cardsEffect={{
                slideShadows: true,
                rotate: true,
                perSlideRotate: 1.25,
                perSlideOffset: 14,
              }}
              slidesPerView={1}
              loop={false}
              allowTouchMove={false}
              grabCursor={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper as unknown as SwiperLike;
                activeIndexRef.current = swiper.activeIndex;
                requestAnimationFrame(() => ScrollTrigger.refresh());
              }}
              speed={750}
            >
              {expertTips.map((tip) => (
                <SwiperSlide key={tip.title}>
                  <div className="experts-item experts-item--slide">
                    <div className="img">
                      <img src={tip.image} alt={tip.title} />
                    </div>
                    <b>{tip.title}</b>
                    <span>{tip.text}</span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
