'use client';

import { useMemo } from 'react';
import { AnalysisDemoPlayer, type DemoSegment } from './analysis-demo-player';
import { motion } from 'framer-motion';

import { useLocale } from 'next-intl';

import { useLandingMessages } from '@/i18n/landing/hooks';
import type { LandingLocale } from '@/i18n/landing/messages';

export function AnalysisExampleSection() {
  const messages = useLandingMessages();
  const locale = useLocale() as LandingLocale;
  const demoSegments = useMemo(
    () => messages.analysis.segments as DemoSegment[],
    [messages.analysis.segments]
  );

  return (
    <section className="analysis-example-block">
      <div className="wrapper">
        <motion.h2
          initial={{ scale: 0.92, opacity: 0.0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 120, damping: 23 }}
        >
          {messages.analysis.sectionTitle}
        </motion.h2>
        <AnalysisDemoPlayer
          segments={demoSegments}
          speechLocale={locale}
          title={messages.analysis.demoTitle}
          eyebrow={messages.analysis.demoEyebrow}
          hint={messages.analysis.demoHint}
        />
        {/* <div className="text-info">
          <div className="texts">
            {demoSegments.map((seg, i) => (
              <p
                key={i}
                className="analysis-example-transcript__line"
                data-speaker={seg.speaker}
              >
                {seg.text}
              </p>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
