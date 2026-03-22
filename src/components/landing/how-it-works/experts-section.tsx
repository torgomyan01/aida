'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const expertTips = [
  {
    title: 'Focus on results',
    text: 'Talk about value for the customer, rather than product features',
    image: '/landing/img/experts-img2.jpg',
  },
  {
    title: 'Summarize agreements',
    text: 'At the end of the call, clearly state the next steps and deadlines',
    image: '/landing/img/experts-img3.jpg',
  },
  {
    title: 'Ask open-ended questions',
    text: 'Instead of "Does this suit you?" ask "How do you envision solving this task?"',
    image: '/landing/img/experts-img4.jpg',
  },
  {
    title: 'Empathy in conversation',
    text: 'Acknowledge the customer\'s feelings: "I understand how important this is to you"',
    image: '/landing/img/experts-img5.jpg',
  },
  {
    title: 'Analyze your calls',
    text: 'Listen to 2-3 of your conversations weekly and look for points of improvement',
    image: '/landing/img/experts-img6.jpg',
  },
  {
    title: 'Active Listening',
    text: 'Let the customer speak. Listen 70% of the time, speak 30%',
    image: '/landing/img/experts-img1.jpg',
  },
];

type SwiperLike = {
  activeIndex: number;
  slideTo: (index: number, speed?: number) => void;
};

export function ExpertsSection() {
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
        start: 'top top+=60',
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
  }, []);

  return (
    <section ref={sectionRef} className="from-experts-block">
      <div className="wrapper">
        <div className="experts-info">
          <div className="experts-texts">
            <span className="style-text">Advice from experts</span>
            <h2>Learn every day</h2>
            <p>Best practices from top managers to boost communication efficiency</p>
          </div>

          <div className="experts-items" style={{ display: 'block' }}>
            <Swiper
              slidesPerView={1}
              spaceBetween={16}
              loop={false}
              allowTouchMove={false}
              grabCursor={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper as unknown as SwiperLike;
                activeIndexRef.current = swiper.activeIndex;
                requestAnimationFrame(() => ScrollTrigger.refresh());
              }}
              speed={900}
            >
              {expertTips.map((tip) => (
                <SwiperSlide key={tip.title}>
                  <div className="experts-item" style={{ marginLeft: 0, width: '100%', transform: 'none' }}>
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
