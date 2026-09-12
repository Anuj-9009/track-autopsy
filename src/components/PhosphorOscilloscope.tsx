import React, { useRef, useEffect } from 'react';

interface PhosphorOscilloscopeProps {
  isPlayingTone: boolean;
  analyser?: AnalyserNode | null;
  hash?: number;
}

export const PhosphorOscilloscope: React.FC<PhosphorOscilloscopeProps> = ({
  isPlayingTone,
  analyser,
  hash = 42,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const startTime = performance.now();
    const width = 1000;
    const height = 280;

    // Audio byte array for Web Audio Analyser
    const bufferLength = analyser ? analyser.frequencyBinCount : 256;
    const audioDataArray = new Uint8Array(bufferLength);

    // Dynamic wave generator
    const getWaveY = (x: number, t: number): { y: number; clipped: boolean; zone: 'sub' | 'hook' | 'clip' | 'flat' } => {
      // Sub-bass section: 0 to 230
      if (x <= 230) {
        const swell = Math.sin(t * 3.2 - x * 0.024) * 4.8 * (1 + 0.25 * Math.sin(t * 1.4));
        const subHarmonic = Math.sin(t * 6.5 - x * 0.05) * 2.2;
        const progress = x / 230;
        const base = 140 + Math.sin(progress * Math.PI) * 2.5;
        return { y: base + swell + subHarmonic, clipped: false, zone: 'sub' };
      }

      // Transient Hook Contusion: 230 to 370
      if (x <= 370) {
        const anchors = [
          { x: 230, y: 142 },
          { x: 250, y: 90 },
          { x: 265, y: 185 },
          { x: 280, y: 110 },
          { x: 300, y: 165 },
          { x: 320, y: 80 },
          { x: 335, y: 195 },
          { x: 350, y: 120 },
          { x: 370, y: 140 },
        ];

        let i = 0;
        while (i < anchors.length - 2 && anchors[i + 1].x < x) {
          i++;
        }
        const p0 = anchors[i];
        const p1 = anchors[i + 1];
        const segProgress = (x - p0.x) / (p1.x - p0.x);
        const baseY = p0.y + (p1.y - p0.y) * segProgress;

        // Rhythmic transient pulse mimicking struck string/transient attack
        const tempoPulse = 1.0 + 0.18 * Math.sin(t * 8.2) * Math.sin(t * 4.1);
        const flutter = Math.sin(t * 32 + x * 0.3) * 2.2;
        const dynY = 140 + (baseY - 140) * tempoPulse + flutter;
        return { y: dynY, clipped: false, zone: 'hook' };
      }

      // Vocal Presence Trauma Spike into Brickwall: 370 to 640
      if (x <= 640) {
        const anchors = [
          { x: 370, y: 140 },
          { x: 410, y: 135 },
          { x: 440, y: 70 },
          { x: 465, y: 30 },
          { x: 490, y: 26 },
          { x: 515, y: 26 },
          { x: 540, y: 26 },
          { x: 560, y: 32 },
          { x: 580, y: 75 },
          { x: 610, y: 120 },
          { x: 640, y: 135 },
        ];

        let i = 0;
        while (i < anchors.length - 2 && anchors[i + 1].x < x) {
          i++;
        }
        const p0 = anchors[i];
        const p1 = anchors[i + 1];
        const segProgress = (x - p0.x) / (p1.x - p0.x);
        const baseY = p0.y + (p1.y - p0.y) * segProgress;

        // High frequency presence surge
        const presenceMod = Math.sin(t * 22 + x * 0.15) * 3.4 + Math.sin(t * 44 + x * 0.28) * 1.6;
        let dynY = baseY + presenceMod;

        // Hard clipping at fatal brickwall limit (y <= 28)
        const isHardClip = dynY <= 28.5;
        if (isHardClip) {
          // Flatten into brickwall with inter-sample distortion ripple
          dynY = 27.2 + 0.7 * Math.sin(t * 55 + x * 0.7);
        }
        return { y: dynY, clipped: isHardClip, zone: 'clip' };
      }

      // Harmonic Distortion & Flatline Asymptote: 640 to 1000
      const anchors = [
        { x: 640, y: 135 },
        { x: 660, y: 110 },
        { x: 675, y: 155 },
        { x: 690, y: 125 },
        { x: 710, y: 148 },
        { x: 730, y: 132 },
        { x: 750, y: 144 },
        { x: 780, y: 138 },
        { x: 810, y: 141 },
        { x: 850, y: 140 },
        { x: 900, y: 140 },
        { x: 950, y: 140 },
        { x: 1000, y: 140 },
      ];

      let i = 0;
      while (i < anchors.length - 2 && anchors[i + 1].x < x) {
        i++;
      }
      const p0 = anchors[i];
      const p1 = anchors[i + 1];
      const segProgress = (x - p0.x) / (p1.x - p0.x);
      const baseY = p0.y + (p1.y - p0.y) * segProgress;

      // Resonant ringing decay
      const decayFactor = Math.max(0, Math.exp(-(x - 640) / 50));
      const resonance = Math.sin(t * 26 + x * 0.2) * 5 * decayFactor;

      // Terminal high-frequency flatline noise (thermal floor)
      const noiseFloor = (Math.sin(x * 12.7 + t * 45) * 0.9) * Math.max(0, 1 - (x - 800) / 200);

      return { y: baseY + resonance + noiseFloor, clipped: false, zone: 'flat' };
    };

    const render = () => {
      if (!isRunning) return;

      const now = performance.now();
      const t = (now - startTime) / 1000;

      // Ensure canvas pixel dimensions match device pixel ratio
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear dark phosphor chamber background
      ctx.fillStyle = '#1c1914';
      ctx.fillRect(0, 0, width, height);

      // Draw Background Coarse Reference Grid Lines
      ctx.strokeStyle = '#2a251e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = 0; gx <= width; gx += 28) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy <= height; gy += 28) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // Horizontal Reference Lines
      // Zero Axis
      ctx.save();
      ctx.strokeStyle = '#4a3e2b';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.lineTo(width, 140);
      ctx.stroke();

      // Knee Reference Lines
      ctx.strokeStyle = '#7c2018';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.lineTo(width, 50);
      ctx.moveTo(0, 230);
      ctx.lineTo(width, 230);
      ctx.stroke();

      // Fatal Brickwall Ceiling Line
      ctx.strokeStyle = '#ff8f80';
      ctx.setLineDash([6, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.lineTo(width, 28);
      ctx.stroke();
      ctx.restore();

      // Brickwall Ceiling Label Text
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillStyle = '#ff8f80';
      ctx.fillText('FATAL BRICKWALL CEILING (+0.0 dBFS)', 12, 23);

      // Calculate Cathode-Ray Sweep Beam position (sweeps across in ~2.6s)
      const sweepPeriod = 2.6;
      const sweepProgress = (t % sweepPeriod) / sweepPeriod;
      const beamX = sweepProgress * width;

      // Sample points along waveform
      const step = 2;
      const numPoints = Math.floor(width / step) + 1;
      const points: { x: number; y: number; clipped: boolean; zone: string }[] = [];

      let hasClippingFrame = false;

      if (isPlayingTone && analyser) {
        // Read active Web Audio API time-domain data
        analyser.getByteTimeDomainData(audioDataArray);
        for (let i = 0; i < numPoints; i++) {
          const x = i * step;
          const dataIdx = Math.floor((i / numPoints) * audioDataArray.length);
          const v = (audioDataArray[dataIdx] - 128) / 128; // -1.0 to 1.0
          // 880Hz sine ripple with cardiac flatline monitor effect
          const toneY = 140 - v * 48;
          points.push({ x, y: toneY, clipped: false, zone: 'tone' });
        }
      } else if (isPlayingTone) {
        // Synthesize crisp 880Hz flatline monitor tone with pulse blip
        for (let i = 0; i < numPoints; i++) {
          const x = i * step;
          // 880Hz simulated oscillation + periodic heartbeat spike
          const carrier = Math.sin(t * 88.0 + x * 0.18) * 12;
          const pulseCycle = (t * 0.8) % 1;
          let cardiacSpike = 0;
          if (pulseCycle > 0.4 && pulseCycle < 0.48) {
            const spikePhase = (pulseCycle - 0.4) / 0.08;
            cardiacSpike = Math.sin(spikePhase * Math.PI * 2) * 55;
          }
          const y = 140 + carrier - cardiacSpike;
          points.push({ x, y, clipped: false, zone: 'tone' });
        }
      } else {
        // Full Track Autopsy Forensic Spectrographic Waveform
        for (let i = 0; i < numPoints; i++) {
          const x = i * step;
          const pt = getWaveY(x, t);
          if (pt.clipped) hasClippingFrame = true;
          points.push({ x, y: pt.y, clipped: pt.clipped, zone: pt.zone });
        }
      }

      // Multi-pass Phosphor Rendering:
      // Pass 1: Phosphor Luminescence Trail & Glow (ambient bloom behind beam)
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Phosphor Persistence Decay: how long ago was this point touched by beam?
        let distBehind = beamX - p1.x;
        if (distBehind < 0) distBehind += width;
        const decayAge = distBehind / width; // 0 = just swept, 1 = oldest
        // High luminescence right after sweep, fading smoothly
        const lum = Math.pow(1 - decayAge, 1.8) * 0.7 + 0.3;

        ctx.save();
        // Color mapping based on zone
        let strokeCol = '#cba878';
        let glowCol = '#e2c28f';

        if (p1.zone === 'sub') {
          strokeCol = `rgba(104, 86, 60, ${lum * 0.95})`;
          glowCol = '#8c6f44';
        } else if (p1.zone === 'hook') {
          strokeCol = `rgba(203, 168, 120, ${lum * 1.0})`;
          glowCol = '#ffdeab';
        } else if (p1.zone === 'clip') {
          if (p1.clipped) {
            strokeCol = `rgba(255, 143, 128, ${lum * 1.0})`;
            glowCol = '#ff5449';
          } else {
            strokeCol = `rgba(255, 143, 128, ${lum * 0.9})`;
            glowCol = '#ff8f80';
          }
        } else if (p1.zone === 'tone') {
          strokeCol = `rgba(255, 222, 171, ${lum * 1.0})`;
          glowCol = '#fddba6';
        } else {
          // Flatline
          strokeCol = `rgba(163, 60, 49, ${lum * 0.85})`;
          glowCol = '#7c2018';
        }

        // Phosphor Glow Bloom
        ctx.strokeStyle = strokeCol;
        ctx.shadowColor = glowCol;
        ctx.shadowBlur = p1.clipped ? 12 : 7;
        ctx.lineWidth = p1.clipped ? 3.5 : p1.zone === 'hook' ? 2.8 : 2.0;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.restore();
      }

      // Pass 2: High-Intensity Beam Core (Crisp inner electron line)
      ctx.save();
      ctx.lineWidth = 1.4;
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        let distBehind = beamX - p1.x;
        if (distBehind < 0) distBehind += width;
        const decayAge = distBehind / width;
        const lum = Math.pow(1 - decayAge, 1.4) * 0.8 + 0.2;

        if (p1.clipped) {
          ctx.strokeStyle = `rgba(255, 240, 240, ${lum})`;
        } else if (p1.zone === 'hook') {
          ctx.strokeStyle = `rgba(255, 235, 190, ${lum})`;
        } else {
          ctx.strokeStyle = `rgba(240, 220, 180, ${lum * 0.7})`;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();

      // Pass 3: Active Cathode-Ray Sweep Cursor Beam & Hot Spot
      // Find Y at current beam position
      const beamIdx = Math.min(Math.floor(beamX / step), points.length - 1);
      const beamPt = points[beamIdx] || { x: beamX, y: 140, clipped: false };

      // Vertical Scan Beam Line (subtle CRT electron sweep curtain)
      ctx.save();
      const grad = ctx.createLinearGradient(beamX - 12, 0, beamX + 2, 0);
      grad.addColorStop(0, 'rgba(255, 222, 171, 0)');
      grad.addColorStop(0.85, 'rgba(255, 222, 171, 0.08)');
      grad.addColorStop(1, 'rgba(255, 245, 220, 0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(beamX - 12, 0, 14, height);

      // Leading beam scanline
      ctx.strokeStyle = 'rgba(255, 245, 225, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(beamX, 0);
      ctx.lineTo(beamX, height);
      ctx.stroke();

      // Beam Head Phosphor Hotspot
      ctx.shadowColor = '#ffe29a';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(beamX, beamPt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer corona
      ctx.strokeStyle = 'rgba(255, 222, 171, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(beamX, beamPt.y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Pass 4: Callout Flags and Forensic Overlays (Pinpoint tracking)
      // Callout 1: Primary Hook Contusion at x=320
      const hookPt = points[Math.floor(320 / step)] || { x: 320, y: 80 };
      ctx.save();
      // Target Reticle
      ctx.fillStyle = '#ffdeab';
      ctx.beginPath();
      ctx.arc(320, hookPt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Radar pulse ring
      const pulsePhase = (t * 2) % 1;
      ctx.strokeStyle = `rgba(255, 222, 171, ${1 - pulsePhase})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(320, hookPt.y, 4 + pulsePhase * 8, 0, Math.PI * 2);
      ctx.stroke();

      // Pointer Line to label
      ctx.strokeStyle = '#e2c28f';
      ctx.beginPath();
      ctx.moveTo(320, hookPt.y);
      ctx.lineTo(320, 40);
      ctx.stroke();

      // Label Badge
      ctx.fillStyle = '#1c1914';
      ctx.fillRect(240, 24, 160, 16);
      ctx.strokeStyle = '#68563c';
      ctx.strokeRect(240, 24, 160, 16);
      ctx.fillStyle = '#ffdeab';
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText('PRIMARY HOOK CONTUSION', 246, 36);
      ctx.restore();

      // Callout 2: Clip Saturation Exposure at x=500
      const clipPt = points[Math.floor(500 / step)] || { x: 500, y: 26 };
      ctx.save();
      ctx.fillStyle = '#ff8f80';
      ctx.beginPath();
      ctx.arc(500, clipPt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Pulse alert ring when clipping is severe
      const clipPulse = (t * 3) % 1;
      ctx.strokeStyle = `rgba(255, 84, 73, ${1 - clipPulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(500, clipPt.y, 4 + clipPulse * 9, 0, Math.PI * 2);
      ctx.stroke();

      // Pointer to badge
      ctx.strokeStyle = '#ff8f80';
      ctx.beginPath();
      ctx.moveTo(500, clipPt.y);
      ctx.lineTo(500, 12);
      ctx.stroke();

      // Crimson Warning Badge
      ctx.fillStyle = '#7c2018';
      ctx.fillRect(420, 0, 160, 14);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Space Mono", monospace';
      ctx.fillText('CLIP SATURATION EXPOSURE', 425, 10);
      ctx.restore();

      // Callout 3: 18kHz Flatline Asymptote at x=920
      const flatPt = points[Math.floor(920 / step)] || { x: 920, y: 140 };
      ctx.save();
      ctx.fillStyle = '#8c7a5b';
      ctx.beginPath();
      ctx.arc(920, flatPt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1914';
      ctx.fillRect(835, 152, 150, 14);
      ctx.strokeStyle = '#4a3e2b';
      ctx.strokeRect(835, 152, 150, 14);
      ctx.fillStyle = '#d2ba8b';
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText('18kHz FLATLINE ASYMPTOTE', 840, 162);
      ctx.restore();

      // CRT Corner Telemetry HUD
      ctx.save();
      ctx.font = '8px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(140, 122, 91, 0.85)';
      ctx.fillText('TRACE: P7 PHOSPHOR PERSISTENCE', 12, height - 12);
      ctx.fillStyle = hasClippingFrame ? '#ff8f80' : 'rgba(140, 122, 91, 0.85)';
      ctx.fillText(hasClippingFrame ? 'OVERLOAD: +0.6 dBTP CLIPPING' : 'PEAK: -0.1 dBFS NOMINAL', width / 2 - 80, height - 12);
      ctx.fillStyle = 'rgba(140, 122, 91, 0.85)';
      ctx.fillText(`BEAM: ${(sweepProgress * 100).toFixed(0)}% // 44.1kHz CLK`, width - 180, height - 12);
      ctx.restore();

      ctx.restore(); // Restore dpr scale

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlayingTone, analyser, hash]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};
