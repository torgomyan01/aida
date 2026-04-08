'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLandingMessages } from '@/i18n/landing/hooks';

export function LandingAboutSections() {
  const messages = useLandingMessages();
  const leaders = messages.about.leaders;
  const reduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.15 : 0.45,
        staggerChildren: reduceMotion ? 0.02 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.15 : 0.45, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section
      className="about-us-block"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="wrapper">
        <div className="info-wrap">
          <motion.div className="info" variants={itemVariants}>
            <motion.span className="style-text" variants={itemVariants}>
              {messages.about.eyebrow}
            </motion.span>
            <motion.h1 variants={itemVariants}>
              {messages.about.titleAbout} <span className="green-text">{messages.about.titleUs}</span>
            </motion.h1>
            <motion.div className="contact-info" variants={itemVariants}>
              <span>{messages.about.phoneLabel}</span>
              <a href="tel:+998999999999">+998 99 999 99 99</a>
            </motion.div>
            <motion.div className="contact-info" variants={itemVariants}>
              <span>{messages.about.emailLabel} </span>
              <a href="mailto:aida@sales.uz">aida@sales.uz</a>
            </motion.div>
            <motion.div className="contact-info" variants={itemVariants}>
              <span>{messages.about.addressLabel} </span>
              <b>
                {messages.about.addressLine1} <br /> {messages.about.addressLine2}
              </b>
            </motion.div>
          </motion.div>

          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              className={`info-item${leader.top ? ' item-top' : ''}`}
              variants={itemVariants}
              transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      transition: { duration: 0.2 },
                    }
              }
            >
              <div className="img-wrap">
                <img src={leader.image} alt={leader.name} />
              </div>
              <b>{leader.name}</b>
              <span>{leader.bio}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
