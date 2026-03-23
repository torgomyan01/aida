'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { LandingLocale } from '@/i18n/landing/messages';

export type DemoSegment = {
  speaker: number;
  text: string;
};

/** uz: Latin-script copy in messages — Latn subtag steers engines away from “English letters” reading. */
const BCP47_BY_LOCALE: Record<LandingLocale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  uz: 'uz-Latn-UZ',
};

function voiceLangMatchesLocale(voiceLang: string, locale: LandingLocale): boolean {
  const l = voiceLang.toLowerCase().replace('_', '-');
  const exact = locale.toLowerCase();
  const pre = `${exact}-`;
  return l === exact || l.startsWith(pre);
}

function filterVoicesForLocale(all: SpeechSynthesisVoice[], locale: LandingLocale): SpeechSynthesisVoice[] {
  return all.filter((v) => voiceLangMatchesLocale(v.lang, locale));
}

function pickThreeVoices(list: SpeechSynthesisVoice[], locale: LandingLocale): SpeechSynthesisVoice[] {
  if (list.length === 0) return [];
  const byKind = (re: RegExp) => list.find((v) => re.test(v.name.toLowerCase()));
  const uniq = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice, c: SpeechSynthesisVoice) => {
    const out = [a, b, c].filter(Boolean);
    return [...new Set(out)] as SpeechSynthesisVoice[];
  };

  if (locale === 'en') {
    const a = byKind(/male|david|daniel|fred/) ?? list[0];
    const b = byKind(/female|zira|samantha|karen|veena/) ?? list.find((v) => v !== a) ?? list[0];
    const c =
      byKind(/google us english/) ??
      list.find((v) => v !== a && v !== b) ??
      list[Math.min(2, list.length - 1)] ??
      a;
    return uniq(a, b, c).length >= 2 ? uniq(a, b, c) : list.slice(0, 3);
  }

  if (locale === 'ru') {
    const a =
      byKind(/male|pavel|filipp|dmitry|yury|artem|муж/) ??
      list.find((v) => !/female|жен|irina|milena|anna|oksana|elena/i.test(v.name)) ??
      list[0];
    const b =
      byKind(/female|irina|milena|anna|elena|natalia|oksana|жен/) ?? list.find((v) => v !== a) ?? list[0];
    const c =
      byKind(/google|microsoft|yandex|katya/) ??
      list.find((v) => v !== a && v !== b) ??
      list[Math.min(2, list.length - 1)] ??
      a;
    return uniq(a, b, c).length >= 2 ? uniq(a, b, c) : list.slice(0, 3);
  }

  // uz — often few voices; spread by index
  const a = list[0];
  const b = list.find((v) => v !== a) ?? list[0];
  const c = list.find((v) => v !== a && v !== b) ?? list[Math.min(2, list.length - 1)] ?? a;
  return uniq(a, b, c).length >= 2 ? uniq(a, b, c) : list.slice(0, 3);
}

function getVoicesForLocale(speechLocale: LandingLocale): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const all = speechSynthesis.getVoices();
  const forLocale = filterVoicesForLocale(all, speechLocale);
  const picked = pickThreeVoices(forLocale, speechLocale);
  if (picked.length > 0) return picked;
  return forLocale.slice(0, Math.min(3, forLocale.length));
}

function cleanForSpeech(text: string) {
  return text
    .replace(/\[[^\]]+\]\s*/g, '')
    .replace(/[""]/g, '"')
    .trim();
}

const BARS_PER_SEGMENT = 16;

/** Rough TTS duration; biased slightly long so the playhead rarely outruns speech. */
function estimateSpeechDurationMs(text: string, rate: number, locale: LandingLocale): number {
  const t = text.trim();
  if (!t.length) return 1800;
  const baseCps = locale === 'ru' ? 10.2 : locale === 'uz' ? 10.6 : 11.5;
  const cps = baseCps * Math.max(0.5, rate);
  const ms = (t.length / cps) * 1000 * 1.22;
  return Math.round(Math.min(180_000, Math.max(1200, ms)));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function WaveformBars({
  seed,
  segmentIndex,
  segmentCount,
  playheadPct,
  active,
}: {
  seed: number;
  segmentIndex: number;
  segmentCount: number;
  playheadPct: number;
  active: boolean;
}) {
  const heightsPct = useMemo(() => {
    let s = seed * 7919 + 9973;
    const next01 = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    return Array.from({ length: BARS_PER_SEGMENT }, () => 22 + next01() * 68);
  }, [seed]);

  const totalBars = Math.max(1, segmentCount * BARS_PER_SEGMENT);
  const startBar = segmentIndex * BARS_PER_SEGMENT;

  return (
    <div className={`analysis-demo-player__bars ${active ? 'is-active' : ''}`}>
      {heightsPct.map((h, i) => {
        const globalK = startBar + i;
        const played = ((globalK + 0.5) / totalBars) * 100 <= playheadPct;
        return (
          <span
            key={i}
            className={`analysis-demo-player__bar${played ? ' is-played' : ''}`}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

type Props = {
  segments: DemoSegment[];
  /** Which language the browser TTS should use (matches site locale). */
  speechLocale?: LandingLocale;
  title?: string;
  eyebrow?: string;
  hint?: string;
  /** Fired when playback highlights a segment (`null` when not playing). */
  onActiveSegmentChange?: (segmentIndex: number | null) => void;
};

export function AnalysisDemoPlayer({
  segments,
  speechLocale = 'en',
  title = 'Demo recording of a customer conversation',
  eyebrow = 'Sample playback',
  hint = 'Browser text-to-speech (English). Speaker colors follow the transcript; voices depend on your system.',
  onActiveSegmentChange,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [smoothPlayheadPct, setSmoothPlayheadPct] = useState(0);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const segmentIndexRef = useRef(0);
  const cancelledRef = useRef(false);
  const smoothPlayheadRef = useRef(0);
  const progressRafRef = useRef<number | null>(null);
  const onActiveSegmentChangeRef = useRef(onActiveSegmentChange);
  onActiveSegmentChangeRef.current = onActiveSegmentChange;

  useEffect(() => {
    const cb = onActiveSegmentChangeRef.current;
    if (!cb) return;
    if (playing) cb(segmentIndex);
    else cb(null);
  }, [playing, segmentIndex]);

  const stopProgressAnimation = useCallback(() => {
    if (progressRafRef.current != null) {
      cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }
  }, []);

  const runProgressAnimation = useCallback((from: number, to: number, durationMs: number) => {
    stopProgressAnimation();
    const start = performance.now();
    const span = to - from;

    const tick = (now: number) => {
      if (cancelledRef.current) return;
      const elapsed = now - start;
      const rawT = durationMs <= 0 ? 1 : Math.min(1, elapsed / durationMs);
      const eased = easeInOutCubic(rawT);
      const v = from + span * eased;
      smoothPlayheadRef.current = v;
      setSmoothPlayheadPct(v);
      if (rawT < 1) {
        progressRafRef.current = requestAnimationFrame(tick);
      } else {
        progressRafRef.current = null;
        smoothPlayheadRef.current = to;
        setSmoothPlayheadPct(to);
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, [stopProgressAnimation]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      voicesRef.current = getVoicesForLocale(speechLocale);
    };

    load();
    speechSynthesis.onvoiceschanged = load;
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [speechLocale]);

  const speakSegment = useCallback(
    (index: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setPhase('done');
        setPlaying(false);
        smoothPlayheadRef.current = 100;
        setSmoothPlayheadPct(100);
        return;
      }
      const n = segments.length;
      if (index >= n) {
        stopProgressAnimation();
        setPhase('done');
        setPlaying(false);
        setSegmentIndex(Math.max(0, n - 1));
        smoothPlayheadRef.current = 100;
        setSmoothPlayheadPct(100);
        return;
      }

      cancelledRef.current = false;
      setSegmentIndex(index);
      segmentIndexRef.current = index;

      const raw = segments[index]?.text ?? '';
      const text = cleanForSpeech(raw);
      if (!text) {
        const snap = n <= 1 ? 100 : ((index + 1) / n) * 100;
        smoothPlayheadRef.current = snap;
        setSmoothPlayheadPct(snap);
        speakSegment(index + 1);
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = BCP47_BY_LOCALE[speechLocale];
      const voices = getVoicesForLocale(speechLocale);
      voicesRef.current = voices;
      const speaker = segments[index]?.speaker ?? 0;
      const voice = voices.length ? voices[speaker % voices.length] : null;
      if (voice && voiceLangMatchesLocale(voice.lang, speechLocale)) {
        utter.voice = voice;
      }
      utter.rate = speaker === 2 ? 0.92 : 1;
      utter.pitch = speaker === 1 ? 1.05 : speaker === 2 ? 0.95 : 1;

      const segmentStartPct = n <= 1 ? 0 : (index / n) * 100;
      const segmentEndPct = n <= 1 ? 100 : ((index + 1) / n) * 100;
      const fromPct = Math.min(segmentEndPct, Math.max(segmentStartPct, smoothPlayheadRef.current));
      const fullSpan = segmentEndPct - segmentStartPct;
      const remainingSpan = segmentEndPct - fromPct;
      const fullEstimate = estimateSpeechDurationMs(text, utter.rate, speechLocale);
      const durationMs =
        fullSpan > 0.5 && remainingSpan < fullSpan - 0.5
          ? Math.max(800, fullEstimate * (remainingSpan / fullSpan))
          : fullEstimate;

      runProgressAnimation(fromPct, segmentEndPct, durationMs);

      utter.onend = () => {
        if (cancelledRef.current) return;
        stopProgressAnimation();
        smoothPlayheadRef.current = segmentEndPct;
        setSmoothPlayheadPct(segmentEndPct);
        speakSegment(index + 1);
      };

      utter.onerror = () => {
        if (cancelledRef.current) return;
        stopProgressAnimation();
        smoothPlayheadRef.current = segmentEndPct;
        setSmoothPlayheadPct(segmentEndPct);
        speakSegment(index + 1);
      };

      speechSynthesis.speak(utter);
    },
    [segments, speechLocale, runProgressAnimation, stopProgressAnimation]
  );

  const handleToggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (playing) {
      cancelledRef.current = true;
      stopProgressAnimation();
      speechSynthesis.cancel();
      setPlaying(false);
      setPhase('idle');
      return;
    }

    setPlaying(true);
    setPhase('playing');
    cancelledRef.current = false;

    const restart = phase === 'done';
    const start = restart ? 0 : segmentIndexRef.current;
    if (restart) {
      setSegmentIndex(0);
      segmentIndexRef.current = 0;
      smoothPlayheadRef.current = 0;
      setSmoothPlayheadPct(0);
    }
    speechSynthesis.cancel();
    speakSegment(start);
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      speechSynthesis.cancel();
      if (progressRafRef.current != null) cancelAnimationFrame(progressRafRef.current);
    };
  }, []);

  const isActive = (i: number) => playing && i === segmentIndex;

  const playheadPct = (() => {
    const n = segments.length;
    if (n <= 0) return 0;
    if (phase === 'done') return 100;
    return Math.min(100, Math.max(0, smoothPlayheadPct));
  })();

  return (
    <div className="analysis-demo-player" role="region" aria-label="Demo call playback">
      <div className="analysis-demo-player__head">
        <div className="analysis-demo-player__brand">
          <span className="analysis-demo-player__logo-wrap" aria-hidden>
            <img src="/landing/img/logo-icon.svg" alt="" />
          </span>
          <div className="analysis-demo-player__head-text">
            <span className="analysis-demo-player__eyebrow">{eyebrow}</span>
            <p className="analysis-demo-player__title">{title}</p>
          </div>
        </div>
      </div>

      <div className="analysis-demo-player__row">
        <button
          type="button"
          className={`analysis-demo-player__play${playing ? ' analysis-demo-player__play--playing' : ''}`}
          onClick={handleToggle}
          aria-label={playing ? 'Pause demo playback' : 'Play demo recording'}
        >
          {playing ? (
            <span className="analysis-demo-player__pause-icon" aria-hidden />
          ) : (
            <span className="analysis-demo-player__play-icon" aria-hidden />
          )}
        </button>



        <div className="analysis-demo-player__wave-wrap">
          <div className="analysis-demo-player__wave">
            <div className="analysis-demo-player__track" aria-hidden />
            {segments.map((_, i) => (
              <div key={i} className="analysis-demo-player__segment">
                <WaveformBars
                  seed={i * 17 + 3}
                  segmentIndex={i}
                  segmentCount={segments.length}
                  playheadPct={playheadPct}
                  active={isActive(i)}
                />
                {i < segments.length - 1 ? <span className="analysis-demo-player__sep" aria-hidden /> : null}
              </div>
            ))}
            <span className="analysis-demo-player__dot" style={{ left: `${playheadPct}%` }} aria-hidden />
          </div>
        </div>
      </div>

      <p className="analysis-demo-player__hint">{hint}</p>
    </div>
  );
}
