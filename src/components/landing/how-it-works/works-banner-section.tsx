'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLandingMessages } from '@/i18n/landing/hooks';

const easeOut = [0.22, 1, 0.36, 1] as const;

export function WorksBannerSection() {
  const messages = useLandingMessages();
  const reduceMotion = useReducedMotion();
  const yTitle = reduceMotion ? 0 : 36;
  const yPara = reduceMotion ? 0 : 26;
  const duration = reduceMotion ? 0 : 0.62;
  const durationP = reduceMotion ? 0 : 0.52;
  const stagger = reduceMotion ? 0 : 0.14;

  return (
    <section className="works-banner-block">
      <div className="wrapper">
        <div className="banner-info">
          <motion.div
            className="texts"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-48px', amount: 0.35 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: stagger, delayChildren: reduceMotion ? 0 : 0.06 },
              },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: reduceMotion ? 1 : 0, y: yTitle },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration, ease: easeOut },
                },
              }}
            >
              {messages.worksBanner.titleBefore}{' '}
              <span className="green-text">{messages.worksBanner.titleHighlight}</span>
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: reduceMotion ? 1 : 0, y: yPara },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: durationP, ease: easeOut },
                },
              }}
            >
              {messages.worksBanner.subtitle}
            </motion.p>
          </motion.div>
          <div className="info-block">
            <img src="/landing/img/decoration.png" alt="AIDA process" />
            <div className="info info1">
              <img src="/landing/img/works-icon1.svg" alt="" />
              <span>{messages.worksBanner.float1}</span>
            </div>
            <div className="info info2">
              <img src="/landing/img/works-icon2.svg" alt="" />
              <span>{messages.worksBanner.float2}</span>
            </div>
            <div className="info info3">
              <img src="/landing/img/works-icon3.svg" alt="" />
              <span>{messages.worksBanner.float3}</span>
            </div>
            <div className="info info4">
              <img src="/landing/img/works-icon4.svg" alt="" />
              <span>{messages.worksBanner.float4}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
