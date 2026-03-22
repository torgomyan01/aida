'use client';

import { useEffect, useRef } from 'react';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function softNoise(t: number, seed = 0) {
  return (
    Math.sin(t * 0.87 + seed * 1.37) * 0.58 +
    Math.sin(t * 1.91 - seed * 0.73) * 0.27 +
    Math.sin(t * 3.7 + seed * 2.31) * 0.15
  );
}

export function SoundWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawRibbon = (
      t: number,
      phase: number,
      amp: number,
      baseThickness: number,
      colorA: string,
      colorB: string,
      depth: number,
      voiceEnergy: number
    ) => {
      const cx = width / 2;
      const cy = height / 2 + phase * 3;
      const points = 180;
      const left = -width * 0.05;
      const right = width * 1.05;

      const top: Array<{ x: number; y: number }> = [];
      const bottom: Array<{ x: number; y: number }> = [];
      const mid: Array<{ x: number; y: number }> = [];

      for (let i = 0; i <= points; i += 1) {
        const p = i / points;
        const x = left + (right - left) * p;
        const center1 = 0.26 + Math.sin(t * 0.46 + phase * 0.4) * 0.14;
        const center2 = 0.56 + Math.sin(t * 0.71 + 1.2 + phase * 0.2) * 0.1;
        const center3 = 0.79 + Math.sin(t * 0.61 + 2.8) * 0.09;
        const gauss = (v: number, c: number, s: number) => Math.exp(-((v - c) ** 2) / (2 * s * s));
        const formantPeaks = gauss(p, center1, 0.08) + gauss(p, center2, 0.075) + gauss(p, center3, 0.07);
        const localEnergy = 0.55 + formantPeaks * (0.9 + voiceEnergy * 0.7);

        const freqDrift = 1 + softNoise(t * 0.7, phase + p * 2.3) * 0.16;
        const speechFormant = Math.sin(t * (2.2 + softNoise(t * 0.5, phase) * 0.45) + p * 20 + phase);
        const breath = Math.sin(t * 0.52 + phase) * 0.12 + 0.88;
        const envelope = (0.62 + 0.38 * Math.sin(p * Math.PI * 2 + t * 0.3 + phase)) * breath;

        const microJitter =
          Math.sin((p * Math.PI * 50) + t * 9.5 + phase) * (1.8 + voiceEnergy * 2.4) +
          Math.sin((p * Math.PI * 90) - t * 11.2) * 0.8;

        const y =
          cy +
          Math.sin((p * Math.PI * 6 * freqDrift) + t * (1.2 + voiceEnergy * 0.9) + phase) *
            amp *
            envelope *
            (0.7 + voiceEnergy * 0.45 + formantPeaks * 0.38) +
          speechFormant * (amp * (0.16 + formantPeaks * 0.2)) +
          Math.sin((p * Math.PI * 12) - t * 0.75 - phase) * (amp * 0.26) +
          microJitter * 0.18;

        const thickness =
          baseThickness * (0.82 + voiceEnergy * 0.35 + localEnergy * 0.22) +
          Math.sin((p * Math.PI * 8) + t * 1.05 + phase) * 7 +
          Math.cos((p * Math.PI * 3) - t * 0.7) * 4 +
          Math.sin((p * Math.PI * 16) + t * 2.8 + phase) * (1.8 + voiceEnergy * 2.2);

        top.push({ x, y: y - thickness });
        bottom.push({ x, y: y + thickness });
        mid.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i < top.length; i += 1) {
        ctx.lineTo(top[i].x, top[i].y);
      }
      for (let i = bottom.length - 1; i >= 0; i -= 1) {
        ctx.lineTo(bottom[i].x, bottom[i].y);
      }
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, cy - amp, width, cy + amp);
      gradient.addColorStop(0, colorA);
      gradient.addColorStop(0.55, colorB);
      gradient.addColorStop(1, '#5df08e');

      ctx.fillStyle = gradient;
      ctx.shadowColor = `rgba(85, 255, 150, ${0.24 + depth * 0.25})`;
      ctx.shadowBlur = 14 + depth * 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      // top highlight makes ribbon look volumetric
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i < top.length; i += 1) {
        ctx.lineTo(top[i].x, top[i].y);
      }
      for (let i = top.length - 1; i >= 0; i -= 1) {
        ctx.lineTo(top[i].x, top[i].y + (6 + depth * 4));
      }
      ctx.closePath();
      const highlight = ctx.createLinearGradient(0, cy - amp * 1.2, 0, cy + amp * 0.2);
      highlight.addColorStop(0, `rgba(229, 255, 192, ${0.48 + depth * 0.2})`);
      highlight.addColorStop(1, 'rgba(229, 255, 192, 0)');
      ctx.fillStyle = highlight;
      ctx.fill();
      ctx.restore();

      // Core bright line gives a clearer "audio signal" character.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(mid[0].x, mid[0].y);
      for (let i = 1; i < mid.length; i += 1) {
        ctx.lineTo(mid[i].x, mid[i].y);
      }
      const core = ctx.createLinearGradient(0, cy - amp, width, cy + amp);
      core.addColorStop(0, 'rgba(214, 255, 170, 0.86)');
      core.addColorStop(0.5, 'rgba(180, 255, 130, 1)');
      core.addColorStop(1, 'rgba(120, 245, 130, 0.9)');
      ctx.strokeStyle = core;
      ctx.lineWidth = 3.2 + voiceEnergy * 1.6;
      ctx.shadowColor = 'rgba(166, 255, 173, 0.75)';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();
    };

    const draw = (timeMs: number) => {
      const t = timeMs * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Voice-like dynamics: changing intensity and frequency bands over time.
      const phrase = (Math.sin(t * 0.58) + Math.sin(t * 0.93 + 1.4) + 2) / 4;
      const articulation = (Math.sin(t * 3.8) + Math.sin(t * 5.1 + 1.1) + 2) / 4;
      const voiceEnergy = Math.max(0.08, Math.min(1, phrase * 0.72 + articulation * 0.28));

      ctx.save();
      roundedRect(ctx, 0, 0, width, height, 28);
      ctx.clip();

      // ambient depth glow behind waves
      const glow = ctx.createRadialGradient(
        width * 0.52,
        height * 0.55,
        height * 0.08,
        width * 0.52,
        height * 0.55,
        width * 0.5
      );
      glow.addColorStop(0, 'rgba(95, 255, 155, 0.18)');
      glow.addColorStop(0.45, 'rgba(56, 186, 108, 0.08)');
      glow.addColorStop(1, 'rgba(56, 186, 108, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Soft radial rings like the reference visual.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 5; i += 1) {
        const rr = (i + 1) * (Math.min(width, height) * 0.17);
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.55, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 255, 170, ${0.06 + voiceEnergy * 0.05 - i * 0.012})`;
        ctx.lineWidth = 20;
        ctx.shadowColor = 'rgba(120, 255, 170, 0.35)';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }
      ctx.restore();

      // single main voice wave layer
      drawRibbon(
        t,
        0,
        height * (0.12 + voiceEnergy * 0.05),
        26,
        '#c6ff88',
        '#19c263',
        1,
        voiceEnergy
      );

      ctx.restore();
      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    rafId = window.requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        width: '100%',
        aspectRatio: '16 / 10',
        display: 'block',
        borderRadius: 28,
      }}
    />
  );
}
