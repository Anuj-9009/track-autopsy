import React, { useState, useRef, useEffect } from 'react';
import type { AutopsyReport } from '../api';
import { getArtistDegree, generateHash } from '../utils';
import { PhosphorOscilloscope } from './PhosphorOscilloscope';

interface WaveformDissectionProps {
  currentCase: AutopsyReport;
  onBackToRegistry: () => void;
}

export const WaveformDissection: React.FC<WaveformDissectionProps> = ({ currentCase, onBackToRegistry }) => {
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const hash = generateHash(currentCase.title + currentCase.artist);
  const degree = getArtistDegree(currentCase.artist);
  const year = parseInt(currentCase.recorded) || 2012;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Flatline tone generator using Web Audio API
  const toggleFlatlineTone = () => {
    if (isPlayingTone) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      analyserRef.current = null;
      setIsPlayingTone(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        analyserRef.current = analyser;
        setIsPlayingTone(true);
      } catch (err) {
        console.error("AudioContext error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Song-adapted diagnostic parameters
  const firstFeature = currentCase.features && currentCase.features.length > 0
    ? currentCase.features[0]
    : "Repetitive melodic phrase designed for instant neural capture.";
  const secondFeature = currentCase.features && currentCase.features.length > 1
    ? currentCase.features[1]
    : "Severe vocal presence spike exceeding tolerable exposure limits.";

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-space-lg animate-fade-in pb-space-xl">
      {/* TOP MANILA DOSSIER FILE CONTAINER */}
      <div className="relative w-full bg-surface-container-low shadow-[3px_4px_0px_rgba(28,26,23,0.25)] rounded-t-lg">
        {/* Manila File Tab Edge */}
        <div className="flex items-stretch justify-between px-space-md pt-space-xs bg-surface-dim/70">
          <div className="inline-flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 -mb-px rounded-t shadow-[0_-2px_0px_rgba(28,26,23,0.1)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              DOSSIER #{currentCase.tag || "SP-2012-0881"}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
              | PATHOLOGY LEDGER SEC. 4
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-md pb-1 text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">
              LAB REEL IDENT: PCM-{1000 + (hash % 8999)}-DECEASED
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">ARCHIVAL VAULT B-12</span>
          </div>
        </div>

        {/* Dossier Sheet Body */}
        <div className="p-space-md md:p-space-lg flex flex-col gap-space-lg">
          {/* Form Top Metadata & Red Rubber Stamp Seal */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-md pb-space-md border-b border-outline-variant/60">
            <div className="flex flex-col gap-space-xs max-w-4xl">
              <div className="inline-flex items-center gap-space-xs flex-wrap">
                <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-space-xs py-0.5 tracking-widest uppercase">
                  FORM 108-C
                </span>
                <span className="font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase font-bold">
                  ACOUSTIC SPECTRAL AUTOPSY & FREQUENCY DISSECTION // DIVISION OF SONIC FORENSICS
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl uppercase font-bold tracking-tight text-on-surface leading-tight mt-1">
                WAVEFORM DISSECTION & HARMONIC DECAY ANALYSIS
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed mt-space-xs">
                Microscopic post-mortem breakdown of terminal dynamic range loss, loudness-war brickwall necrosis, acute earworm hook frequency spikes, and sudden irreversible chart-rotation flatline decay in <strong className="text-on-surface">"{currentCase.title}"</strong>.
              </p>
            </div>

            {/* Rubber Stamp Seal */}
            <div className="self-start lg:self-center shrink-0 -rotate-3 p-2 bg-error-container/40 shadow-[2px_2px_0px_rgba(124,32,24,0.3)]">
              <div className="p-2 flex flex-col items-center justify-center text-center">
                <span className="font-label-sm text-label-sm tracking-[0.2em] font-bold text-primary uppercase">
                  M.E. FORENSIC AUTOPSY
                </span>
                <span className="font-headline-md text-headline-md font-bold tracking-widest text-primary uppercase py-0.5">
                  ACOUSTIC NECROSIS
                </span>
                <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase">
                  LETHAL COMPRESSION DETECTED
                </span>
              </div>
            </div>
          </div>

          {/* SPECIMEN CLINICAL INFO BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md bg-surface-container p-space-md shadow-inner border border-outline-variant/60">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">SUBJECT DECEASED</span>
              <span className="font-body-lg text-body-lg font-bold text-primary mt-0.5 truncate">{currentCase.artist}</span>
              <span className="font-body-sm text-body-sm text-on-surface italic mt-0.5 truncate">"{currentCase.title}"</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">SPECIMEN MASTER TYPE</span>
              <span className="font-body-lg text-body-lg font-bold text-on-surface mt-0.5 truncate">
                {currentCase.custodyEvidence?.masterFormat || "Redbook 16-Bit / 44.1kHz"}
              </span>
              <span className="font-body-sm text-body-sm text-error font-bold mt-0.5 uppercase tracking-wide">Status: Seized Master</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">INTEGRATED RESIDUAL RANGE</span>
              <div className="flex items-baseline gap-space-xs mt-0.5">
                <span className="font-headline-md text-headline-md font-bold text-primary">
                  {currentCase.waveformDiagnosis?.lufs || "-8.4 LUFS"}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold">(Fatal Metric)</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">True Peak Margin: +0.6 dBTP Clipping</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">ESTIMATED TIME OF FATAL ARREST</span>
              <span className="font-body-lg text-body-lg font-bold text-on-surface mt-0.5">{currentCase.dead}</span>
              <span className="font-body-sm text-body-sm text-secondary font-bold mt-0.5">Chart Over-Exposure Asphyxiation</span>
            </div>
          </div>

          {/* MAIN OSCILLOSCOPE SPECTRAL READOUT BOX */}
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md md:p-space-lg shadow-[2px_2px_0px_#735a30] border border-outline-variant/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/40">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">graphic_eq</span>
                <div>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    PHOSPHOR SPECTROGRAPHIC TRACE // 20 Hz — 20,000 Hz
                  </h2>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    OSCILLOSCOPIC DISSECTION CHAMBER • TRACE RASTER #{10 + (hash % 89)}-X1
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md flex-wrap">
                <button
                  onClick={toggleFlatlineTone}
                  className={`inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase font-bold px-space-xs py-1 transition-all border cursor-pointer ${
                    isPlayingTone
                      ? 'bg-primary text-on-primary border-primary animate-pulse'
                      : 'bg-error-container/60 text-primary border-primary/40 hover:bg-error-container'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isPlayingTone ? 'bg-white' : 'bg-primary'} animate-pulse`}></span>
                  {isPlayingTone ? 'SILENCE FLATLINE (880Hz)' : 'AUDIBLE FLATLINE MONITOR'}
                </button>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  CALIBRATION: 0 dBFS REF
                </span>
              </div>
            </div>

            {/* Vintage Coarse Grid Audio Oscilloscope Printout */}
            <div className="relative w-full bg-[#1c1914] p-space-md text-[#d2ba8b] overflow-hidden shadow-inner border border-outline">
              {/* Grid Lines Layer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a251e_1px,transparent_1px),linear-gradient(to_bottom,#2a251e_1px,transparent_1px)] bg-[size:28px_28px] opacity-70"></div>

              {/* Top Phosphor Scale & Amplitude Ruler */}
              <div className="relative z-10 flex justify-between font-label-sm text-label-sm text-[#8c7a5b] uppercase pb-space-xs">
                <span>+6 dB (Ceiling Breach)</span>
                <span>0 dBFS (Full Scale)</span>
                <span>-6 dB (Linear Knee)</span>
                <span>-18 dB (Nominal Respiration)</span>
                <span>-48 dB (Noise Floor)</span>
              </div>

              {/* Oscilloscope Waveform & Frequency Spike Animated Phosphor Display */}
              <div className="relative z-10 w-full h-64 sm:h-72 my-space-xs flex items-center justify-center">
                <PhosphorOscilloscope
                  isPlayingTone={isPlayingTone}
                  analyser={analyserRef.current}
                  hash={hash}
                />
              </div>

              {/* Isolated Fatal Hook Stem Banner */}
              {currentCase.terminalHookLyric && (
                <div className="relative z-10 bg-[#15130f] p-space-sm border-t border-stone-800 mb-space-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[#8c7a5b] font-label-sm text-label-sm uppercase">
                    <span className="text-[#ffdeab] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      ISOLATED FATAL HOOK STEM [TERMINAL NEURAL IMPRINT]
                    </span>
                    <span className="text-[#ff8f80]">SPECTRAL CENTROID: 3.42 kHz</span>
                  </div>
                  <p className="font-headline-md text-headline-md italic font-serif text-[#fddba6] px-2 py-0.5 leading-snug">
                    “{currentCase.terminalHookLyric}”
                  </p>
                </div>
              )}

              {/* Frequency Dissection Pathology Band Annotations */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-xs pt-space-xs bg-[#15130f] p-space-xs border border-stone-800">
                <div className="p-space-xs bg-[#211d17] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between font-label-sm text-label-sm text-[#ffdeab]">
                      <span className="font-bold">20-60 Hz [SUB-BASS]</span>
                      <span className="text-[#ff8f80]">ASYSTOLE</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b8a483] mt-1">
                      {currentCase.waveformDiagnosis?.subBass || "Pulse cessation. Complete cardiovascular pump failure. Sub-audible room breathe amputated by high-pass brickwall filter."}
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#8c7a5b] mt-2 block">POWER DEFICIT: -16.2 dB</span>
                </div>

                <div className="p-space-xs bg-[#211d17] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between font-label-sm text-label-sm text-[#ffdeab]">
                      <span className="font-bold">200-500 Hz [LOW-MIDS]</span>
                      <span className="text-[#fddba6]">CONTUSION</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b8a483] mt-1">
                      {currentCase.waveformDiagnosis?.lowMids || firstFeature}
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#8c7a5b] mt-2 block">REPETITIONS: {70 + (hash % 40)} STRUCK PEAKS</span>
                </div>

                <div className="p-space-xs bg-[#211d17] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between font-label-sm text-label-sm text-[#ffdeab]">
                      <span className="font-bold">2-4 kHz [PRESENCE]</span>
                      <span className="text-[#ff8f80]">HYPER-TRAUMA</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b8a483] mt-1">
                      {currentCase.waveformDiagnosis?.presence || secondFeature}
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#ff8f80] font-bold mt-2 block">MAX SURGE: 3.42 kHz (+4.8 dB)</span>
                </div>

                <div className="p-space-xs bg-[#211d17] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between font-label-sm text-label-sm text-[#ffdeab]">
                      <span className="font-bold">10-20 kHz [HIGH AIR]</span>
                      <span className="text-[#a33c31]">NECROSIS</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b8a483] mt-1">
                      {currentCase.waveformDiagnosis?.highAir || "Terminal asphyxiation. Total decay of atmospheric headroom and natural acoustic room reverb tail. Cymbals turned to dry static."}
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#8c7a5b] mt-2 block">DECAY TIME: 0.00 SEC (CUTOFF)</span>
                </div>
              </div>
            </div>

            {/* Spectral Flatline Chronology Timeline */}
            <div className="p-space-md bg-surface-container mt-space-sm border border-outline-variant/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
                  CHRONOLOGICAL DEGRADATION TIMELINE ({year} — {year + 2})
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  EVIDENCE ITEM: HIST-LOG-9
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-space-sm bg-surface-container-lowest shadow-sm border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface">CY {year} (ORIGIN)</span>
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">STAGE 1: VITAL</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 mt-2">
                    <div className="bg-secondary h-2" style={{ width: '85%' }}></div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Tracked at {currentCase.custodyEvidence?.studioName || "Primary Recording Facility"}. Healthy dynamic respiration ({currentCase.waveformDiagnosis?.lufs ? (parseFloat(currentCase.waveformDiagnosis.lufs) - 4).toFixed(1) + " LUFS" : "14.2 LUFS"}). Reverb tails organic.
                  </p>
                </div>

                <div className="p-space-sm bg-surface-container-lowest shadow-sm border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">CY {year + 1} (INFECTION)</span>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold">STAGE 2: ACUTE</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 mt-2">
                    <div className="bg-primary h-2" style={{ width: '50%' }}></div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {currentCase.chartPeakFact || "Peak viral chart saturation & broadcast fever. Multi-band broadcast compressors crush dynamics down to terminal thresholds."}
                  </p>
                </div>

                <div className="p-space-sm bg-surface-container-lowest shadow-sm border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-error">CY {year + 2} (AUTOPSY)</span>
                    <span className="font-label-sm text-label-sm text-error uppercase font-bold">STAGE 3: FATAL</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 mt-2">
                    <div className="bg-error h-2" style={{ width: '15%' }}></div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {currentCase.tod || "Terminal compression flatline. Department store PA systems, supermarket loudspeakers, and FM exciters render audio unrecoverable."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* EVIDENCE TABLES & METRICS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Loudness War Toxicity Panel (Left 7 Columns) */}
            <div className="lg:col-span-7 bg-surface-container p-space-md md:p-space-lg flex flex-col justify-between shadow-[2px_2px_0px_#735a30] border border-outline-variant/60">
              <div>
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">warning</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      LOUDNESS WAR TOXICITY PANEL
                    </h3>
                  </div>
                  <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-xs py-0.5 uppercase tracking-widest font-bold">
                    TOXICITY CLASS IV
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant my-space-xs">
                  Laboratory measurements extracted via BS.1770-4 meter algorithm during the second chorus crescendo.
                </p>

                {/* Evidentiary Ledger Table */}
                <div className="w-full overflow-x-auto mt-space-sm">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-variant text-on-surface uppercase font-label-sm text-label-sm">
                        <th className="p-2">SPECIMEN TEST PARAMETER</th>
                        <th className="p-2">MEASURED VALUE</th>
                        <th className="p-2">SAFE EXPOSURE</th>
                        <th className="p-2">DIAGNOSTIC STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                      <tr className="bg-surface-container-lowest/60">
                        <td className="p-2 font-bold">Integrated Loudness (LUFS)</td>
                        <td className="p-2 text-primary font-bold">-8.4 LUFS</td>
                        <td className="p-2 text-on-surface-variant">-14.0 LUFS</td>
                        <td className="p-2 text-error font-bold tracking-wider uppercase">LETHAL CRUSH</td>
                      </tr>
                      <tr className="bg-surface-container/60">
                        <td className="p-2 font-bold">True Peak Level (dBTP)</td>
                        <td className="p-2 text-primary font-bold">+0.68 dBTP</td>
                        <td className="p-2 text-on-surface-variant">-1.00 dBTP</td>
                        <td className="p-2 text-error font-bold tracking-wider uppercase">INTER-SAMPLE CLIPPING</td>
                      </tr>
                      <tr className="bg-surface-container-lowest/60">
                        <td className="p-2 font-bold">Dynamic Range (DR Meter)</td>
                        <td className="p-2 text-primary font-bold">DR 5</td>
                        <td className="p-2 text-on-surface-variant">DR 11+</td>
                        <td className="p-2 text-error font-bold tracking-wider uppercase">SEVERE ATROPHY</td>
                      </tr>
                      <tr className="bg-surface-container/60">
                        <td className="p-2 font-bold">Crest Factor (RMS vs Peak)</td>
                        <td className="p-2 text-on-surface font-bold">7.2 dB</td>
                        <td className="p-2 text-on-surface-variant">14.0 dB</td>
                        <td className="p-2 text-secondary font-bold tracking-wider uppercase">HYPER-COMPRESSED</td>
                      </tr>
                      <tr className="bg-surface-container-lowest/60">
                        <td className="p-2 font-bold">Total Harmonic Squeeze (THD)</td>
                        <td className="p-2 text-primary font-bold">4.18%</td>
                        <td className="p-2 text-on-surface-variant">&lt; 0.05%</td>
                        <td className="p-2 text-error font-bold tracking-wider uppercase">TISSUE SCARRING</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stamped Legal Conclusion Note */}
              <div className="mt-space-md p-space-sm bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/60">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                    PATHOLOGIST CERTIFICATE:
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Waveform presents zero organic valley headroom. Sliced at master limiter with no surgical recovery possible.
                  </span>
                </div>
                <div className="rotate-1 shrink-0 p-1.5 bg-error-container/60 shadow-sm">
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest px-2 py-0.5 block">
                    VERIFIED DECEASED
                  </span>
                </div>
              </div>
            </div>

            {/* The Hook Asphyxiation Graph & Tissue Sample (Right 5 Columns) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Hook Asphyxiation Graph Card */}
              <div className="bg-surface-container p-space-md shadow-[2px_2px_0px_#735a30] border border-outline-variant/60">
                <div className="flex items-center justify-between pb-space-xs">
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    THE HOOK ASPHYXIATION GRAPH
                  </h4>
                  <span className="material-symbols-outlined text-secondary text-[20px]">repeat</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-space-sm">
                  RADIO LOOP NEUROSIS FREQUENCY EXPOSURE
                </span>

                {/* Inline SVG Bar Graph of Hourly Repetition Rates */}
                <div className="p-space-sm bg-surface-container-lowest border border-outline-variant/40">
                  <div className="flex items-baseline justify-between mb-space-xs">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Top-40 Hourly Rotation:</span>
                    <span className="font-label-md text-label-md font-bold text-primary">14.2 LOOPS / HR (CRITICAL)</span>
                  </div>
                  <svg className="w-full h-24" viewBox="0 0 320 80">
                    <line stroke="#ddc0bc" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="320" y1="20" y2="20"></line>
                    <line stroke="#ddc0bc" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="320" y1="50" y2="50"></line>
                    
                    <rect fill="#735a30" height="22" width="30" x="20" y="58"></rect>
                    <text fill="#1d1b18" fontFamily="'Space Mono', monospace" fontSize="9" textAnchor="middle" x="35" y="52">2.1</text>
                    <text fill="#f3ede7" fontFamily="'Space Mono', monospace" fontSize="8" textAnchor="middle" x="35" y="76">JAN</text>
                    
                    <rect fill="#735a30" height="36" width="30" x="75" y="44"></rect>
                    <text fill="#1d1b18" fontFamily="'Space Mono', monospace" fontSize="9" textAnchor="middle" x="90" y="38">5.8</text>
                    <text fill="#f3ede7" fontFamily="'Space Mono', monospace" fontSize="8" textAnchor="middle" x="90" y="76">MAR</text>
                    
                    <rect fill="#5d0705" height="56" width="30" x="130" y="24"></rect>
                    <text fill="#5d0705" fontFamily="'Space Mono', monospace" fontSize="9" fontWeight="bold" textAnchor="middle" x="145" y="18">11.4</text>
                    <text fill="#f3ede7" fontFamily="'Space Mono', monospace" fontSize="8" textAnchor="middle" x="145" y="76">MAY</text>
                    
                    <rect fill="#7c2018" height="70" width="30" x="185" y="10"></rect>
                    <text fill="#7c2018" fontFamily="'Space Mono', monospace" fontSize="9" fontWeight="bold" textAnchor="middle" x="200" y="8">14.2</text>
                    <text fill="#f3ede7" fontFamily="'Space Mono', monospace" fontSize="8" textAnchor="middle" x="200" y="76">JUL*</text>
                    
                    <rect fill="#5d0705" height="48" width="30" x="240" y="32"></rect>
                    <text fill="#5d0705" fontFamily="'Space Mono', monospace" fontSize="9" textAnchor="middle" x="255" y="26">9.6</text>
                    <text fill="#f3ede7" fontFamily="'Space Mono', monospace" fontSize="8" textAnchor="middle" x="255" y="76">SEP</text>
                  </svg>
                  <div className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs leading-tight">
                    *JULY {year}: Acoustic saturation threshold exceeded. Listener earworm paralysis recognized in 94% of tested metropolitan subjects.
                  </div>
                </div>
              </div>

              {/* Harmonic Distortion Tissue Sample Card */}
              <div className="bg-surface-container p-space-md shadow-[2px_2px_0px_#735a30] border border-outline-variant/60">
                <div className="flex items-center gap-space-xs pb-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">biotech</span>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    AUDIO TISSUE BIOPSY SAMPLE
                  </h4>
                </div>
                <div className="flex gap-space-sm p-space-sm bg-surface-container-lowest mt-space-xs border border-outline-variant/40">
                  <div className="w-24 h-24 shrink-0 bg-[#121110] overflow-hidden shadow-inner border border-outline-variant/60 relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#141210"/>
                      {/* Microscope grid */}
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#735a30" strokeWidth="0.5" strokeDasharray="2,2"/>
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#735a30" strokeWidth="0.5" strokeDasharray="2,2"/>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#735a30" strokeWidth="0.75"/>
                      <circle cx="50" cy="50" r="24" fill="none" stroke="#735a30" strokeWidth="0.5" strokeDasharray="1,2"/>
                      {/* Clipped Tape Grooves */}
                      <path d="M 8 50 Q 20 44, 32 50 T 56 50 T 80 50 T 92 50" fill="none" stroke="#554b3d" strokeWidth="1.2"/>
                      <path d="M 8 36 L 25 36 L 25 64 L 45 64 L 45 36 L 68 36 L 68 64 L 92 64" fill="none" stroke="#8a2320" strokeWidth="2"/>
                      <path d="M 12 36 L 22 36" stroke="#f3ede7" strokeWidth="1"/>
                      <path d="M 48 36 L 65 36" stroke="#f3ede7" strokeWidth="1"/>
                      {/* Magnetic particle scatter */}
                      <circle cx="28" cy="22" r="1" fill="#d9a84e"/>
                      <circle cx="72" cy="78" r="1.2" fill="#d9a84e"/>
                      <circle cx="82" cy="28" r="0.8" fill="#d9a84e"/>
                      <circle cx="38" cy="80" r="1" fill="#d9a84e"/>
                      <circle cx="65" cy="18" r="0.7" fill="#d9a84e"/>
                      <text x="50" y="94" fill="#a89f91" fontSize="6" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                        400X // CLIPPING
                      </text>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                      SPECIMEN SLIDE #T-{100 + (hash % 899)}-K
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface leading-tight mt-1">
                      Radio limiter square-wave clipping observable as mechanical groove erosion. High frequency transient hairs torn clean off specimen.
                    </p>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
                      MAGNIFICATION: 400X DIGITAL SCAN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BLOTTER & OFFICIAL RUBBER CLEARANCE STAMPS */}
          <div className="p-space-md md:p-space-lg bg-surface-variant flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md shadow-[2px_2px_0px_#735a30] border border-outline-variant/60">
            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                onClick={() => showToast(`STEM HARVESTED: 2.4kHz TO 3.8kHz TRANSIENT ISOLATED FOR "${currentCase.title}".`)}
                className="px-space-md py-2.5 bg-surface-container-lowest text-on-surface font-label-md text-label-md uppercase font-bold tracking-wider shadow-[2px_2px_0px_#1d1b18] hover:bg-on-surface hover:text-surface-container-lowest active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_cut</span>
                <span>ISOLATE TERMINAL HOOK STEM</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                  showToast("PRINT QUEUE ENGAGED: DISPATCHING COPIES TO INQUEST PANEL.");
                }}
                className="px-space-md py-2.5 bg-surface-container-lowest text-on-surface font-label-md text-label-md uppercase font-bold tracking-wider shadow-[2px_2px_0px_#1d1b18] hover:bg-on-surface hover:text-surface-container-lowest active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>EXPORT FREQUENCY DOSSIER</span>
              </button>

              <button
                onClick={() => showToast(`ACOUSTIC CORONER JURY SUMMONED FOR "${currentCase.title}". MASTER LIMITER OVERDRIVE CHARGES FILED.`)}
                className="px-space-md py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase font-bold tracking-wider shadow-[2px_2px_0px_#1d1b18] hover:bg-primary-container active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>RUN HARMONIC INQUEST</span>
              </button>

              <button
                onClick={onBackToRegistry}
                className="px-space-md py-2.5 bg-surface-container text-on-surface font-label-md text-label-md uppercase font-bold tracking-wider border border-outline hover:bg-surface-container-high transition-all flex items-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">folder</span>
                <span>RETURN TO CASE FILE</span>
              </button>
            </div>

            {/* Official Stamp Seal of Certification */}
            <div className="self-end lg:self-center -rotate-2 p-2 bg-error-container/60 shadow-[3px_3px_0px_rgba(124,32,24,0.3)]">
              <div className="p-2 text-center flex flex-col">
                <span className="font-label-sm text-label-sm tracking-[0.25em] font-bold text-primary uppercase">
                  M.E. SEAL // CONFIDENTIAL
                </span>
                <span className="font-label-lg text-label-lg font-bold tracking-[0.18em] text-primary uppercase mt-0.5">
                  LABORATORY CERTIFIED
                </span>
                <span className="font-label-sm text-label-sm tracking-[0.12em] text-primary uppercase">
                  ACOUSTIC TOXICOLOGY CONFIRMED
                </span>
              </div>
            </div>
          </div>

          {/* Bureaucratic Sign-Off Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/60">
            <div className="flex flex-col">
              <span>DISSECTING PATHOLOGIST:</span>
              <span className="font-body-md text-body-md text-on-surface font-bold mt-1">
                X Dr. {currentCase.artist}, {currentCase.examinerDegree || degree}
              </span>
              <span className="text-on-surface-variant/80 mt-0.5">License #ME-{10000 + (hash % 89999)}-AU</span>
            </div>
            <div className="flex flex-col">
              <span>LEGAL EVIDENCE REEL VAULT:</span>
              <span className="font-body-md text-body-md text-on-surface font-bold mt-1">
                DEPOT VAULT TAPE #{10 + (hash % 89)}-{1000 + (hash % 8999)}
              </span>
              <span className="text-on-surface-variant/80 mt-0.5">Chain of custody uncompromised</span>
            </div>
            <div className="flex flex-col">
              <span>FINAL FORENSIC CLASSIFICATION:</span>
              <span className="font-body-md text-body-md text-primary font-bold mt-1">
                {currentCase.status || "TERMINAL EARWORM ASPHYXIATION"}
              </span>
              <span className="text-on-surface-variant/80 mt-0.5">Closed Case // Do Not Re-Master</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST SNACKBAR */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface p-space-md shadow-2xl font-label-md text-label-md uppercase tracking-wider z-50 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
