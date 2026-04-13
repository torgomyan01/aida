'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

import analysisTranscript from '@/data/analysis-example-transcript.json';
import type { AnalysisExampleTranscriptDialog } from '@/data/analysis-example-transcript.types';
import { useLandingMessages } from '@/i18n/landing/hooks';
import type { LandingLocale } from '@/i18n/landing/messages';

import { AnalysisDemoPlayer } from './analysis-demo-player';

const TRANSCRIPT = analysisTranscript as AnalysisExampleTranscriptDialog[];

export function AnalysisExampleSection() {
  const messages = useLandingMessages();
  const locale = useLocale() as LandingLocale;

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
          speechLocale={locale}
          title={messages.analysis.demoTitle}
          eyebrow={messages.analysis.demoEyebrow}
          hint={messages.analysis.demoHint}
        />
        <div className="text-info">
          <div className="texts analysis-example-transcript">
            {TRANSCRIPT.map((dialog) => (
              <div
                key={dialog.title}
                className="analysis-example-transcript__dialog"
                role="group"
                aria-label={dialog.title}
              >
                <h3 className="analysis-example-transcript__dialog-title">{dialog.title}</h3>
                <div className="analysis-example-transcript__lines">
                  {dialog.lines.map((line, i) => (
                    <div
                      key={`${dialog.title}-${i}`}
                      className={`analysis-example-transcript__turn analysis-example-transcript__turn--${line.role}`}
                    >
                      <span className="analysis-example-transcript__role">{line.label}</span>
                      <p className="analysis-example-transcript__text">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
