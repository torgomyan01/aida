'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnalysisDemoPlayer, type DemoSegment } from './analysis-demo-player';
import { motion } from 'framer-motion';

const ANALYSIS_DEMO_SEGMENTS: DemoSegment[] = [
  {
    speaker: 0,
    text: 'In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros.',
  },
  {
    speaker: 1,
    text: '[sarcastically] Not the "burn it all down" kind... but he was gentle, wise, with eyes like old stars.',
  },
  {
    speaker: 2,
    text: '[whispers] Even the birds fell silent when he passed. In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros.',
  },
  {
    speaker: 1,
    text: '[sarcastically] Not the "burn it all down" kind... but he was gentle, wise, with eyes like old stars.',
  },
  {
    speaker: 0,
    text: '[whispers] Even the birds fell silent when he passed. In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all down" kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.',
  },
];

export function AnalysisExampleSection() {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const onActiveSegmentChange = useCallback((index: number | null) => {
    setActiveLine(index);
  }, []);

  useEffect(() => {
    if (activeLine == null) return;
    const el = lineRefs.current[activeLine];
    if (!el) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, [activeLine]);

  return (
    <section className="analysis-example-block">
      <div className="wrapper">
        <motion.h2
          initial={{ scale: 0.92, opacity: 0.0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 120, damping: 23 }}
        >
          Listen to a call analysis example
        </motion.h2>
        <AnalysisDemoPlayer
          segments={ANALYSIS_DEMO_SEGMENTS}
          onActiveSegmentChange={onActiveSegmentChange}
        />
        <div className="text-info">
          <div className="texts">
            {ANALYSIS_DEMO_SEGMENTS.map((seg, i) => (
              <p
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={
                  activeLine === i
                    ? 'analysis-example-transcript__line is-active'
                    : 'analysis-example-transcript__line'
                }
                data-speaker={seg.speaker}
              >
                {seg.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
