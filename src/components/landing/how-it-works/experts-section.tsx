'use client';

import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useLocale } from 'next-intl';

import { useLandingMessages } from '@/i18n/landing/hooks';

type SwiperLike = {
  activeIndex: number;
  slideTo: (index: number, speed?: number) => void;
};

const EXPERTS_SCROLL_PIN_MIN_PX = 993;

function useExpertsTouchSliderMode() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${EXPERTS_SCROLL_PIN_MIN_PX - 1}px)`);
    const apply = () => setTouch(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return touch;
}

export function ExpertsSection() {
  const messages = useLandingMessages();
  const locale = useLocale();
  const expertTips = useMemo(() => messages.experts.tips, [messages.experts.tips]);
  const touchSlider = useExpertsTouchSliderMode();

  const sectionRef = useRef<HTMLElement | null>(null);
  const swiperRef = useRef<SwiperLike | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const inst = swiperRef.current as unknown as { update?: () => void } | null;
    inst?.update?.();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [touchSlider]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || expertTips.length < 2) return;

    const totalSlides = expertTips.length;

    const mm = gsap.matchMedia();

    mm.add(`(min-width: ${EXPERTS_SCROLL_PIN_MIN_PX}px)`, () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top+=80',
          end: `+=${(totalSlides - 1) * 560}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
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
    });

    return () => mm.revert();
  }, [expertTips.length, locale]);

  return (
    <section
      ref={sectionRef}
      className={`from-experts-block${touchSlider ? ' from-experts-block--touch-slider' : ''}`}
    >
      <div className="wrapper">
        <div className="experts-info">
          <div className="experts-texts">
            <span className="style-text">{messages.experts.eyebrow}</span>
            <h2>{messages.experts.title}</h2>
            <p>{messages.experts.subtitle}</p>
          </div>

          <div className="experts-items experts-items--swiper">
            <Swiper
              key={touchSlider ? 'experts-touch' : 'experts-scroll'}
              className={`experts-tips-swiper${touchSlider ? ' experts-tips-swiper--slide-touch' : ''}`}
              modules={touchSlider ? [Pagination] : [EffectCards, Pagination]}
              effect={touchSlider ? 'slide' : 'cards'}
              {...(!touchSlider
                ? {
                    cardsEffect: {
                      slideShadows: true,
                      rotate: true,
                      perSlideRotate: 1.25,
                      perSlideOffset: 14,
                    },
                  }
                : {})}
              slidesPerView={1}
              spaceBetween={touchSlider ? 20 : 0}
              loop={false}
              allowTouchMove={touchSlider}
              grabCursor={touchSlider}
              nested={touchSlider}
              touchEventsTarget="wrapper"
              touchRatio={1}
              touchAngle={45}
              threshold={touchSlider ? 10 : 5}
              touchStartPreventDefault={!touchSlider}
              touchStartForcePreventDefault={false}
              passiveListeners
              followFinger
              pagination={
                touchSlider
                  ? {
                      clickable: true,
                      dynamicBullets: expertTips.length > 4,
                    }
                  : false
              }
              onSwiper={(swiper) => {
                swiperRef.current = swiper as unknown as SwiperLike;
                activeIndexRef.current = swiper.activeIndex;
                requestAnimationFrame(() => ScrollTrigger.refresh());
              }}
              onSlideChange={(swiper) => {
                activeIndexRef.current = swiper.activeIndex;
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
