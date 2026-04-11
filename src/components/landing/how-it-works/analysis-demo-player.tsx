'use client';

import { useEffect, useRef, useState } from 'react';

import type { LandingLocale } from '@/i18n/landing/messages';

export type DemoSegment = {
  speaker: number;
  text: string;
};

const AUDIO_SRC = '/audio/call.mp3';
const DEFAULT_WAVE_BAR_COUNT = 96;
const RATE_STEPS = [1, 1.25, 1.5, 2] as const;

function getSafeDuration(audio: HTMLAudioElement | null, fallback = 0): number {
  if (!audio) return fallback;
  if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;
  if (audio.seekable && audio.seekable.length > 0) {
    const end = audio.seekable.end(audio.seekable.length - 1);
    if (Number.isFinite(end) && end > 0) return end;
  }
  return fallback;
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
  const sec = Math.floor(totalSeconds);
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function buildFallbackBars(barCount: number): number[] {
  return Array.from({ length: barCount }, (_, i) => {
    const t = i / Math.max(1, barCount - 1);
    const waveA = Math.sin(t * Math.PI * 4.2) * 11;
    const waveB = Math.sin((t + 0.17) * Math.PI * 9.4) * 7;
    return Number((30 + waveA + waveB).toFixed(4));
  });
}

type Props = {
  segments: DemoSegment[];
  speechLocale?: LandingLocale;
  title?: string;
  eyebrow?: string;
  hint?: string;
};

export function AnalysisDemoPlayer({
  segments,
  speechLocale: _speechLocale = 'en',
  title = 'Demo recording of a customer conversation',
  eyebrow = 'Sample playback',
  hint = '',
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const visualRafRef = useRef<number | null>(null);
  const smoothedBarsRef = useRef<number[]>(buildFallbackBars(DEFAULT_WAVE_BAR_COUNT));
  const [playing, setPlaying] = useState(false);
  const [playheadPct, setPlayheadPct] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [waveformBars, setWaveformBars] = useState<number[]>(() => buildFallbackBars(DEFAULT_WAVE_BAR_COUNT));
  const progressValue = duration > 0 ? Math.min(duration, currentTime) : 0;

  useEffect(() => {
    return () => {
      if (visualRafRef.current != null) {
        cancelAnimationFrame(visualRafRef.current);
      }
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  const ensureAnalyser = () => {
    const audio = audioRef.current;
    if (!audio) return null;
    if (analyserRef.current) return analyserRef.current;

    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;

    const ctx = new Ctx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.72;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    freqDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    return analyser;
  };

  const stopVisualizer = () => {
    if (visualRafRef.current != null) {
      cancelAnimationFrame(visualRafRef.current);
      visualRafRef.current = null;
    }
  };

  const startVisualizer = () => {
    const analyser = ensureAnalyser();
    const freq = freqDataRef.current;
    if (!analyser || !freq) return;

    if (audioCtxRef.current?.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    stopVisualizer();

    const tick = () => {
      analyser.getByteFrequencyData(freq);
      const barCount = DEFAULT_WAVE_BAR_COUNT;
      const n = freq.length;
      const nextBars: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const t0 = i / barCount;
        const t1 = (i + 1) / barCount;
        const i0 = Math.floor((t0 ** 1.7) * (n - 1));
        const i1 = Math.max(i0 + 1, Math.floor((t1 ** 1.7) * (n - 1)));
        let sum = 0;
        let cnt = 0;

        for (let k = i0; k < i1 && k < n; k++) {
          sum += freq[k] ?? 0;
          cnt++;
        }

        const avg = cnt > 0 ? sum / cnt : 0;
        const normalized = Math.min(1, Math.max(0, avg / 255));
        const shaped = normalized ** 1.45;
        nextBars.push(14 + shaped * 86);
      }

      const smoothed = nextBars.map((v, i) => {
        const prev = smoothedBarsRef.current[i] ?? 20;
        return Number((prev * 0.72 + v * 0.28).toFixed(4));
      });
      smoothedBarsRef.current = smoothed;
      setWaveformBars(smoothed);
      visualRafRef.current = requestAnimationFrame(tick);
    };

    visualRafRef.current = requestAnimationFrame(tick);
  };

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      stopVisualizer();
      return;
    }

    if (audio.duration && audio.currentTime >= audio.duration - 0.05) {
      audio.currentTime = 0;
      setPlayheadPct(0);
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
    setPlaying(true);
    startVisualizer();
  };

  const handleSeekChange = (nextPct: number) => {
    const audio = audioRef.current;
    const total = getSafeDuration(audio, duration);
    if (!audio || total <= 0) return;
    const clamped = Math.min(total, Math.max(0, nextPct));
    const nextTime = clamped;
    audio.currentTime = nextTime;
    setPlayheadPct((nextTime / total) * 100);
    setCurrentTime(nextTime);
    setDuration(total);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !audio.muted;
    audio.muted = next;
    setMuted(next);
  };

  const handleVolumeChange = (nextVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const normalized = Math.max(0, Math.min(100, nextVolume));
    audio.volume = normalized / 100;
    setVolume(normalized);
    if (normalized > 0 && audio.muted) {
      audio.muted = false;
      setMuted(false);
    }
  };

  const handleRateToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const idx = RATE_STEPS.findIndex((x) => x === playbackRate);
    const next = RATE_STEPS[(idx + 1) % RATE_STEPS.length] ?? 1;
    audio.playbackRate = next;
    setPlaybackRate(next);
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextDuration = getSafeDuration(audio, duration);
    setDuration(nextDuration);
    setCurrentTime(audio.currentTime || 0);
    audio.volume = volume / 100;
    audio.playbackRate = playbackRate;
    audio.muted = muted;
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextDuration = getSafeDuration(audio, duration);
    if (nextDuration > 0) {
      setPlayheadPct((audio.currentTime / nextDuration) * 100);
    } else {
      setPlayheadPct(0);
    }
    setCurrentTime(audio.currentTime);
  };

  const onDurationChange = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextDuration = getSafeDuration(audio, duration);
    setDuration(nextDuration);
  };

  const onEnded = () => {
    setPlaying(false);
    setPlayheadPct(100);
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.duration || 0);
    stopVisualizer();
  };

  const onPause = () => {
    setPlaying(false);
    stopVisualizer();
  };

  const onPlay = () => {
    setPlaying(true);
    startVisualizer();
  };

  return (
    <div className="analysis-demo-player" role="region" aria-label="Demo call playback">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onLoadedMetadata}
        onDurationChange={onDurationChange}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPause={onPause}
        onPlay={onPlay}
      />

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
        <div className="analysis-demo-player__controls">
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
        </div>

        <div className="analysis-demo-player__wave-wrap">
          <div className="analysis-demo-player__wave">
            <div className="analysis-demo-player__track" aria-hidden />
            <div className="analysis-demo-player__bars analysis-demo-player__bars--audio">
              {waveformBars.map((h, i) => {
                const p = ((i + 0.5) / waveformBars.length) * 100;
                const played = p <= playheadPct;
                const isNearPlayhead = Math.abs(p - playheadPct) < 1.2;
                return (
                  <span
                    key={i}
                    className={`analysis-demo-player__bar${played ? ' is-played' : ''}${isNearPlayhead ? ' is-active' : ''}`}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
            {/* <span className="analysis-demo-player__dot" style={{ left: `${playheadPct}%` }} aria-hidden /> */}
          </div>
          <div className="analysis-demo-player__progress" aria-label="Audio progress">
            <span className="analysis-demo-player__progress-track" aria-hidden />
            <span className="analysis-demo-player__progress-fill" style={{ width: `${playheadPct}%` }} aria-hidden />
            <span className="analysis-demo-player__progress-thumb" style={{ left: `${playheadPct}%` }} aria-hidden />
            <input
              className="analysis-demo-player__progress-input"
              type="range"
              min={0}
              max={duration > 0 ? duration : 1}
              step={0.01}
              value={progressValue}
              onInput={(e) => handleSeekChange(Number((e.target as HTMLInputElement).value))}
              onChange={(e) => handleSeekChange(Number(e.target.value))}
              aria-label="Seek audio position"
            />
          </div>
          <div className="analysis-demo-player__meta">
            <span className="analysis-demo-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="analysis-demo-player__extra-controls">
              <button
                type="button"
                className="analysis-demo-player__pill-btn"
                onClick={handleRateToggle}
                aria-label="Change playback speed"
              >
                {playbackRate}x
              </button>
              <button
                type="button"
                className="analysis-demo-player__pill-btn"
                onClick={handleMuteToggle}
                aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <label className="analysis-demo-player__volume" aria-label="Volume">
                <span className="analysis-demo-player__volume-label">Vol</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {hint ? <p className="analysis-demo-player__hint">{hint}</p> : null}
    </div>
  );
}
