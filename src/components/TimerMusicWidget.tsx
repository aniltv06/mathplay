/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * TimerMusicWidget – floating focus timer with ambient-sound panel.
 * All sounds are synthesised offline via the Web Audio API — no internet needed.
 *
 * Main sounds:
 *  🔇 Off · 🌧️ Rain · 🌊 Ocean · 🔥 Fireplace · 🎚️ Pink Noise
 *  🎵 Lo-fi (75 BPM) · 🌿 Forest · 🧠 Binaural Alpha
 *
 * "More" sounds (lo-fi variants + ambient pads):
 *  🌙 Night Lo-fi (60 BPM, Bm minor, swung)
 *  🌸 Chill Beats (82 BPM, F major, bright)
 *  💫 Dreamy (55 BPM, Eb major, lush)
 *  🎷 Jazz Lo-fi (70 BPM, swung 8ths)
 *  🎹 Ambient Pads (no drums, slow chord swells)
 *  🌧️🎵 Rain + Lo-fi (rain noise + beat combined)
 *
 * Buffer caching: once generated, each buffer is reused across plays.
 * Music stops automatically when the countdown timer finishes.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, X, Play, Pause, RotateCcw, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TimerState  = 'idle' | 'running' | 'paused' | 'done';
type AmbientTrack =
  | 'off' | 'rain' | 'ocean' | 'fire' | 'pink' | 'lofi' | 'forest' | 'binaural'
  | 'lofi-night' | 'lofi-chill' | 'lofi-dreamy' | 'lofi-jazz' | 'ambient-pads' | 'rain-lofi';

const PRESETS = [5, 10, 15, 25, 30] as const;
type Preset = (typeof PRESETS)[number];

interface Track {
  id: AmbientTrack;
  label: string;
  emoji: string;
  desc: string;
}

const MAIN_TRACKS: Track[] = [
  { id: 'off',      label: 'Off',        emoji: '🔇', desc: 'Silence'                  },
  { id: 'rain',     label: 'Rain',       emoji: '🌧️', desc: 'Steady rainfall'          },
  { id: 'ocean',    label: 'Ocean',      emoji: '🌊', desc: 'Rolling waves'             },
  { id: 'fire',     label: 'Fireplace',  emoji: '🔥', desc: 'Crackling fire'            },
  { id: 'pink',     label: 'Pink Noise', emoji: '🎚️', desc: 'Focus & memory'            },
  { id: 'lofi',     label: 'Lo-fi Beat', emoji: '🎵', desc: '75 BPM · jazz chords'      },
  { id: 'forest',   label: 'Forest',     emoji: '🌿', desc: 'Wind & birdsong'           },
  { id: 'binaural', label: 'Binaural',   emoji: '🧠', desc: 'Alpha waves · 🎧 needed'  },
];

const MORE_TRACKS: Track[] = [
  { id: 'lofi-night',   label: 'Night Lo-fi',   emoji: '🌙', desc: '60 BPM · minor key · swung'  },
  { id: 'lofi-chill',   label: 'Chill Beats',   emoji: '🌸', desc: '82 BPM · bright & upbeat'    },
  { id: 'lofi-dreamy',  label: 'Dreamy',         emoji: '💫', desc: '55 BPM · lush Eb major'      },
  { id: 'lofi-jazz',    label: 'Jazz Lo-fi',     emoji: '🎷', desc: '70 BPM · heavy swing'        },
  { id: 'ambient-pads', label: 'Ambient Pads',   emoji: '🎹', desc: 'No drums · slow chord swells'},
  { id: 'rain-lofi',    label: 'Rain + Lo-fi',   emoji: '🎶', desc: 'Rain noise + beat together'  },
];

const ALL_TRACKS = [...MAIN_TRACKS, ...MORE_TRACKS];

// ─── Singleton AudioContext ───────────────────────────────────────────────────

type WinWithWebkit = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx) {
    const Ctor = window.AudioContext ?? (window as WinWithWebkit).webkitAudioContext!;
    _ctx = new Ctor();
  }
  return _ctx;
}
function resumeCtx() { const c = getCtx(); if (c.state === 'suspended') void c.resume(); }

// ─── Buffer cache (avoids regenerating on every play) ────────────────────────

const _bufCache = new Map<string, AudioBuffer>();
function cachedBuffer(key: string, build: (ctx: AudioContext) => AudioBuffer): AudioBuffer {
  if (!_bufCache.has(key)) _bufCache.set(key, build(getCtx()));
  return _bufCache.get(key)!;
}

// ─── Completion chime C5→E5→G5→C6 ───────────────────────────────────────────

function playChime(): void {
  try {
    resumeCtx();
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.35, ctx.currentTime);
    master.connect(ctx.destination);
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator(), env = ctx.createGain();
      const t = ctx.currentTime + i * 0.2;
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(env); env.connect(master);
      osc.start(t); osc.stop(t + 0.8);
    });
  } catch (_) {}
}

// ─── Noise buffer helpers ─────────────────────────────────────────────────────

function mkWhite(ctx: AudioContext, sec = 3): AudioBuffer {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function mkPink(ctx: AudioContext, sec = 3): AudioBuffer {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
  const d = b.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random()*2-1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.07; b6=w*0.115926;
  }
  return b;
}

// ─── Fireplace ────────────────────────────────────────────────────────────────

function buildFireBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const b  = ctx.createBuffer(1, sr * 8, sr);
  const d  = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random()*2-1; last=(last+0.02*w)/1.02; d[i]=last*1.5;
  }
  for (let c = 0; c < 48; c++) {
    const pos = Math.floor(Math.random()*(d.length-sr*0.03));
    const len = Math.floor(sr*(0.005+Math.random()*0.02));
    const amp = 0.4+Math.random()*0.6;
    for (let i = 0; i < len; i++)
      d[pos+i] = Math.max(-1, Math.min(1, d[pos+i]+(Math.random()*2-1)*amp*(1-i/len)));
  }
  return b;
}

// ─── Forest bird-chirp buffer ────────────────────────────────────────────────

function buildForestBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const b  = ctx.createBuffer(1, Math.floor(sr*10), sr);
  const d  = b.getChannelData(0);
  const chirp = (startS: number, f0=2000, f1=3800) => {
    const pos = Math.floor(startS*sr), dur=0.08;
    const k = Math.log(f1/f0)/dur;
    for (let i = 0; i < Math.floor(dur*sr); i++) {
      const t = i/sr;
      const phase = 2*Math.PI*f0/k*(Math.exp(k*t)-1);
      const env   = Math.sin(Math.PI*t/dur);
      if (pos+i < d.length) d[pos+i] += Math.sin(phase)*env*0.07;
    }
  };
  chirp(0.6, 2200, 3600); chirp(0.74, 2400, 3900);
  chirp(3.1, 1900, 3200);
  chirp(5.5, 2600, 4100); chirp(5.65, 2500, 4000);
  chirp(7.8, 2000, 3500);
  chirp(9.0, 2300, 3700); chirp(9.15, 2500, 3900);
  return b;
}

// ─── Parameterised lo-fi beat builder ────────────────────────────────────────
// swing: fraction of beat to push the "and" 8th note forward (0 = straight).

interface LofiParams {
  bpm: number;
  chords: number[][];  // 4 chords, each an array of Hz values
  bassNotes: number[]; // root note Hz per bar
  swing?: number;
}

function buildLofiBuffer(ctx: AudioContext, p: LofiParams): AudioBuffer {
  const { bpm, chords, bassNotes, swing = 0 } = p;
  const sr     = ctx.sampleRate;
  const beat   = 60 / bpm;
  const bars   = 4;
  const sec    = bars * 4 * beat;
  const buf    = ctx.createBuffer(1, Math.floor(sr*sec), sr);
  const d      = buf.getChannelData(0);

  // Vinyl crackle base
  let crk = 0;
  for (let i = 0; i < d.length; i++) {
    crk=(crk+0.003*(Math.random()*2-1))/1.003; d[i]=crk*0.025;
  }

  const add = (pos: number, v: number) => { if (pos>=0&&pos<d.length) d[pos]+=v; };

  const kick = (sS: number) => {
    const pos=Math.floor(sS*sr), dur=0.20;
    for (let i=0; i<Math.floor(dur*sr); i++) {
      const t=i/sr, phase=2*Math.PI*(100/7)*(1-Math.exp(-7*t));
      add(pos+i, Math.sin(phase)*Math.exp(-10*t)*0.65);
    }
  };

  const snare = (sS: number) => {
    const pos=Math.floor(sS*sr), dur=0.10;
    for (let i=0; i<Math.floor(dur*sr); i++) {
      const t=i/sr, env=Math.exp(-25*t);
      add(pos+i, ((Math.random()*2-1)*0.28+Math.sin(2*Math.PI*200*t)*0.10)*env);
    }
  };

  const hihat = (sS: number, open=false) => {
    const pos=Math.floor(sS*sr), dur=open?0.12:0.025;
    for (let i=0; i<Math.floor(dur*sr); i++) {
      const t=i/sr;
      add(pos+i, (Math.random()*2-1)*Math.exp(-(open?18:65)*t)*0.11);
    }
  };

  const chordPad = (sS: number, freqs: number[], durS: number) => {
    const pos=Math.floor(sS*sr), len=Math.floor(durS*sr), atkLen=Math.floor(0.06*sr);
    const detunes=[1,1.002,0.9985,1.003];
    freqs.forEach((f,fi)=>{
      const df=detunes[fi%4];
      for (let i=0; i<len; i++) {
        const t=i/sr, env=(i<atkLen?i/atkLen:1)*Math.exp(-0.95*(t-durS*0.1));
        add(pos+i, (Math.sin(2*Math.PI*f*df*t)*0.048+Math.sin(2*Math.PI*f*df*2*t)*0.010)*env);
      }
    });
  };

  const bass = (sS: number, freq: number, durS: number) => {
    const pos=Math.floor(sS*sr), len=Math.floor(durS*sr);
    for (let i=0; i<len; i++) {
      const t=i/sr, env=(t<0.02?t/0.02:1)*Math.exp(-1.8*t);
      add(pos+i, Math.sin(2*Math.PI*freq*t)*env*0.20);
    }
  };

  for (let bar=0; bar<bars; bar++) {
    const bs = bar*4*beat;
    chordPad(bs, chords[bar%chords.length], 4*beat*0.92);
    bass(bs, bassNotes[bar%bassNotes.length], 4*beat*0.72);
    for (let b=0; b<4; b++) {
      const bp=bs+b*beat;
      if (b===0||b===2) kick(bp);
      if (b===1||b===3) snare(bp);
      hihat(bp);
      hihat(bp+beat*(0.5+swing));   // swung "and" beat
      if (b===3) hihat(bp+beat*0.75, true);
    }
  }

  let peak=0;
  for (let i=0; i<d.length; i++) peak=Math.max(peak,Math.abs(d[i]));
  const scale=peak>0?0.82/peak:1;
  for (let i=0; i<d.length; i++) d[i]*=scale;
  return buf;
}

// ─── Lo-fi presets ────────────────────────────────────────────────────────────

const LOFI_PRESETS: Record<string, LofiParams> = {
  // 75 BPM · Dm7→G7→Cmaj7→Am7 (ii-V-I-vi in C)
  lofi: {
    bpm: 75,
    chords: [
      [146.83,174.61,220.0, 261.63],   // Dm7
      [98.0,  123.47,146.83,174.61],   // G7
      [130.81,164.81,196.0, 246.94],   // Cmaj7
      [110.0, 130.81,164.81,196.0 ],   // Am7
    ],
    bassNotes: [73.42, 49.0, 65.41, 55.0],  // D2 G1 C2 A1
  },
  // 60 BPM · Bm7→Em7→A7→Dmaj7 (minor, moody, swung)
  'lofi-night': {
    bpm: 60,
    chords: [
      [123.47,146.83,185.0, 220.0 ],   // Bm7
      [82.41, 98.0,  123.47,146.83],   // Em7
      [55.0,  69.30, 82.41, 98.0  ],   // A7
      [73.42, 92.50, 110.0, 138.59],   // Dmaj7
    ],
    bassNotes: [61.74, 82.41, 55.0, 73.42], // B1 E2 A1 D2
    swing: 0.06,
  },
  // 82 BPM · Fmaj7→Bbmaj7→Gm7→C7 (bright F major)
  'lofi-chill': {
    bpm: 82,
    chords: [
      [87.31, 110.0, 130.81,164.81],   // Fmaj7
      [58.27, 73.42, 87.31, 110.0 ],   // Bbmaj7
      [98.0,  116.54,146.83,174.61],   // Gm7
      [65.41, 82.41, 98.0,  116.54],   // C7
    ],
    bassNotes: [43.65, 58.27, 49.0, 65.41], // F1 Bb1 G1 C2
  },
  // 55 BPM · Ebmaj7→Abmaj7→Fm7→Bb7 (lush Eb, light swing)
  'lofi-dreamy': {
    bpm: 55,
    chords: [
      [77.78, 98.0,  123.47,155.56],   // Ebmaj7
      [51.91, 65.41, 82.41, 103.83],   // Abmaj7
      [87.31, 103.83,130.81,155.56],   // Fm7
      [58.27, 73.42, 87.31, 103.83],   // Bb7
    ],
    bassNotes: [77.78, 51.91, 43.65, 58.27], // Eb2 Ab1 F1 Bb1
    swing: 0.04,
  },
  // 70 BPM · Gm7→C7→Fmaj7→Dm7 (jazz ii-V-I in F, heavy swing)
  'lofi-jazz': {
    bpm: 70,
    chords: [
      [98.0,  116.54,146.83,174.61],   // Gm7
      [65.41, 82.41, 98.0,  116.54],   // C7
      [87.31, 110.0, 130.81,164.81],   // Fmaj7
      [73.42, 87.31, 110.0, 130.81],   // Dm7
    ],
    bassNotes: [49.0, 65.41, 43.65, 73.42],  // G1 C2 F1 D2
    swing: 0.10,
  },
};

// ─── Ambient pads (no drums, slow chord swells) ───────────────────────────────

function buildAmbientPadsBuffer(ctx: AudioContext): AudioBuffer {
  const sr      = ctx.sampleRate;
  const sec     = 16;
  const buf     = ctx.createBuffer(1, Math.floor(sr*sec), sr);
  const d       = buf.getChannelData(0);
  // Cmaj9 → Am9 → Fmaj9 → Gsus4
  const chords = [
    [130.81,164.81,196.0, 246.94,293.66],  // Cmaj9
    [110.0, 130.81,164.81,196.0, 246.94],  // Am9
    [87.31, 110.0, 130.81,164.81,220.0 ],  // Fmaj9
    [98.0,  130.81,146.83,196.0, 220.0 ],  // Gsus4
  ];
  const chordDur = sec / chords.length; // 4 s each
  chords.forEach((freqs, ci) => {
    const pos    = Math.floor(ci*chordDur*sr);
    const len    = Math.floor(chordDur*sr);
    const atkLen = Math.floor(0.9*sr);
    const relLen = Math.floor(1.2*sr);
    freqs.forEach(f => {
      for (let i=0; i<len; i++) {
        const env =
          i < atkLen           ? i/atkLen :
          i > len-relLen       ? Math.max(0,(len-i)/relLen) :
          1;
        const t = i/sr;
        const p = 2*Math.PI*f*t;
        const v = pos+i;
        if (v<d.length) d[v]+=(Math.sin(p)*0.038+Math.sin(2*p)*0.009)*env;
      }
    });
  });
  let peak=0;
  for (let i=0; i<d.length; i++) peak=Math.max(peak,Math.abs(d[i]));
  const sc=peak>0?0.75/peak:1;
  for (let i=0; i<d.length; i++) d[i]*=sc;
  return buf;
}

// ─── Ambient sound engine ─────────────────────────────────────────────────────

function startAmbientSound(track: AmbientTrack, gainNode: GainNode): () => void {
  if (track === 'off') return () => {};
  const ctx   = getCtx();
  const stops: Array<() => void> = [];

  try {
    const loopBuf = (buf: AudioBuffer) => {
      const s = ctx.createBufferSource(); s.buffer=buf; s.loop=true;
      s.connect(gainNode); s.start();
      return () => { try { s.stop(); } catch (_) {} };
    };

    if (track === 'rain') {
      const src = ctx.createBufferSource();
      src.buffer=cachedBuffer('white3', c=>mkWhite(c)); src.loop=true;
      const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=0.5;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.7; lfoG.gain.value=300;
      lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start();
      src.connect(bp); bp.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();lfo.stop();}catch(_){} });

    } else if (track === 'ocean') {
      const src=ctx.createBufferSource();
      src.buffer=cachedBuffer('white5',c=>mkWhite(c,5)); src.loop=true;
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=500;
      const wMod=ctx.createGain(); wMod.gain.value=0.5;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.12; lfoG.gain.value=0.4;
      lfo.connect(lfoG); lfoG.connect(wMod.gain); lfo.start();
      src.connect(lpf); lpf.connect(wMod); wMod.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();lfo.stop();}catch(_){} });

    } else if (track === 'fire') {
      stops.push(loopBuf(cachedBuffer('fire',buildFireBuffer)));
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=2000;
      // already connected via loopBuf to gainNode directly; rebuild with filter:
      stops.pop(); // remove the direct one
      const src=ctx.createBufferSource();
      src.buffer=cachedBuffer('fire',buildFireBuffer); src.loop=true;
      src.connect(lpf); lpf.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();}catch(_){} });

    } else if (track === 'pink') {
      const src=ctx.createBufferSource();
      src.buffer=cachedBuffer('pink3',c=>mkPink(c)); src.loop=true;
      const hpf=ctx.createBiquadFilter(); hpf.type='highpass'; hpf.frequency.value=150;
      src.connect(hpf); hpf.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();}catch(_){} });

    } else if (track === 'lofi' || track === 'lofi-night' || track === 'lofi-chill' ||
               track === 'lofi-dreamy' || track === 'lofi-jazz') {
      const preset = LOFI_PRESETS[track];
      stops.push(loopBuf(cachedBuffer(track, c => buildLofiBuffer(c, preset))));

    } else if (track === 'forest') {
      // Wind: real-time noise + HPF + LFO
      const wSrc=ctx.createBufferSource();
      wSrc.buffer=cachedBuffer('white4',c=>mkWhite(c,4)); wSrc.loop=true;
      const hpf=ctx.createBiquadFilter(); hpf.type='highpass'; hpf.frequency.value=800;
      const wG=ctx.createGain(); wG.gain.value=0.28;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.2; lfoG.gain.value=0.20;
      lfo.connect(lfoG); lfoG.connect(wG.gain); lfo.start();
      wSrc.connect(hpf); hpf.connect(wG); wG.connect(gainNode); wSrc.start();
      // Birds
      const bSrc=ctx.createBufferSource();
      bSrc.buffer=cachedBuffer('forest',buildForestBuffer); bSrc.loop=true;
      bSrc.connect(gainNode); bSrc.start();
      stops.push(()=>{ try{wSrc.stop();lfo.stop();bSrc.stop();}catch(_){} });

    } else if (track === 'binaural') {
      const merger=ctx.createChannelMerger(2);
      const lOsc=ctx.createOscillator(), lG=ctx.createGain();
      lOsc.type='sine'; lOsc.frequency.value=100; lG.gain.value=0.55;
      lOsc.connect(lG); lG.connect(merger,0,0);
      const rOsc=ctx.createOscillator(), rG=ctx.createGain();
      rOsc.type='sine'; rOsc.frequency.value=110; rG.gain.value=0.55;
      rOsc.connect(rG); rG.connect(merger,0,1);
      merger.connect(gainNode); lOsc.start(); rOsc.start();
      stops.push(()=>{ try{lOsc.stop();rOsc.stop();}catch(_){} });

    } else if (track === 'ambient-pads') {
      stops.push(loopBuf(cachedBuffer('ambient-pads', buildAmbientPadsBuffer)));

    } else if (track === 'rain-lofi') {
      // Rain layer
      const rSrc=ctx.createBufferSource();
      rSrc.buffer=cachedBuffer('white3',c=>mkWhite(c)); rSrc.loop=true;
      const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=0.5;
      const rainG=ctx.createGain(); rainG.gain.value=0.45;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.7; lfoG.gain.value=300;
      lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start();
      rSrc.connect(bp); bp.connect(rainG); rainG.connect(gainNode); rSrc.start();
      // Lo-fi beat layer
      const bSrc=ctx.createBufferSource();
      bSrc.buffer=cachedBuffer('lofi',c=>buildLofiBuffer(c,LOFI_PRESETS['lofi'])); bSrc.loop=true;
      const lofiG=ctx.createGain(); lofiG.gain.value=0.65;
      bSrc.connect(lofiG); lofiG.connect(gainNode); bSrc.start();
      stops.push(()=>{ try{rSrc.stop();lfo.stop();bSrc.stop();}catch(_){} });
    }

  } catch (_) { /* Web Audio failed gracefully */ }

  return () => stops.forEach(fn => fn());
}

// ─── SVG ring ─────────────────────────────────────────────────────────────────
const RING_R=54, RING_CX=70, CIRCUM=2*Math.PI*RING_R;

// ─── Track card ───────────────────────────────────────────────────────────────

interface TrackCardProps {
  track: Track;
  active: boolean;
  onSelect: (id: AmbientTrack) => void;
}

function TrackCard({ track, active, onSelect }: TrackCardProps) {
  return (
    <button
      onClick={() => onSelect(track.id)}
      role="radio"
      aria-checked={active}
      className={`p-3 rounded-2xl text-left transition-colors ${
        active
          ? 'bg-purple-100 border-2 border-purple-400'
          : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
      }`}
    >
      <div className="text-2xl mb-1" aria-hidden="true">{track.emoji}</div>
      <div className={`text-sm font-semibold leading-tight ${active ? 'text-purple-700' : 'text-gray-700'}`}>
        {track.label}
      </div>
      <div className="text-xs text-gray-400 leading-tight mt-0.5">{track.desc}</div>
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimerMusicWidget() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [activeTab,   setActiveTab]   = useState<'timer' | 'music'>('timer');
  const [preset,      setPreset]      = useState<Preset>(15);
  const [timeLeft,    setTimeLeft]    = useState(15 * 60);
  const [timerState,  setTimerState]  = useState<TimerState>('idle');
  const [activeTrack, setActiveTrack] = useState<AmbientTrack>('off');
  const [volume,      setVolume]      = useState(0.2);
  const [isMuted,     setIsMuted]     = useState(false);
  const [showMore,    setShowMore]    = useState(false);

  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopAmbRef    = useRef<(() => void) | null>(null);
  const gainRef       = useRef<GainNode | null>(null);
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderRef   = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastTrackRef = useRef<AmbientTrack>(
    (() => {
      try { return (localStorage.getItem('mathplay_lastTrack') as AmbientTrack) || 'lofi'; }
      catch (_) { return 'lofi'; }
    })()
  );

  // ── Stop ambient helper ──────────────────────────────────────────────────
  const stopAmbient = useCallback(() => {
    if (stopAmbRef.current)  { stopAmbRef.current();  stopAmbRef.current  = null; }
    if (gainRef.current)     { try { gainRef.current.disconnect(); } catch (_) {} gainRef.current = null; }
    setActiveTrack('off');
  }, []);

  // ── Countdown tick ───────────────────────────────────────────────────────
  useEffect(() => {
    if (timerState !== 'running') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerState('done');
          playChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerState]);

  // ── Stop music when timer finishes ───────────────────────────────────────
  useEffect(() => { if (timerState === 'done') stopAmbient(); }, [timerState, stopAmbient]);

  // ── Sync gain ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gainRef.current) return;
    try { gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, getCtx().currentTime); } catch (_) {}
  }, [volume, isMuted]);

  // ── Unmount cleanup ──────────────────────────────────────────────────────
  useEffect(() => () => {
    if (stopAmbRef.current)   stopAmbRef.current();
    if (gainRef.current)      try { gainRef.current.disconnect(); } catch (_) {}
    if (intervalRef.current)  clearInterval(intervalRef.current);
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
  }, []);

  // ── Timer actions ────────────────────────────────────────────────────────
  const handleStartPause = () => {
    if (timerState === 'idle' || timerState === 'done') {
      setTimeLeft(preset*60);
      setTimerState('running');
      if (activeTrack === 'off') applyTrack(lastTrackRef.current);
      // Open panel on Music tab, auto-dismiss after 15 s
      setIsOpen(true);
      setActiveTab('music');
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
      autoDismissRef.current = setTimeout(() => { setIsOpen(false); }, 15000);
    }
    else if (timerState === 'running') setTimerState('paused');
    else setTimerState('running');
  };

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState('idle'); setTimeLeft(preset*60);
  }, [preset]);

  const handlePreset = (p: Preset) => {
    setPreset(p);
    if (timerState !== 'running') { setTimeLeft(p*60); setTimerState('idle'); }
  };

  // ── Apply track ──────────────────────────────────────────────────────────
  const applyTrack = useCallback((track: AmbientTrack) => {
    if (stopAmbRef.current) { stopAmbRef.current(); stopAmbRef.current = null; }
    if (gainRef.current)    { try { gainRef.current.disconnect(); } catch (_) {} gainRef.current = null; }
    setActiveTrack(track);
    if (track !== 'off') {
      lastTrackRef.current = track;
      try { localStorage.setItem('mathplay_lastTrack', track); } catch (_) {}
    }
    if (track === 'off') return;
    try {
      resumeCtx();
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      gain.connect(ctx.destination);
      gainRef.current    = gain;
      stopAmbRef.current = startAmbientSound(track, gain);
    } catch (_) {}
  }, [volume, isMuted]);

  // ── Volume drag ──────────────────────────────────────────────────────────
  const computeVol = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    setVolume(Math.max(0, Math.min(1, (e.clientX-r.left)/r.width)));
  };
  const onSliderDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    computeVol(e);
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const progress   = timeLeft / (preset * 60);
  const dashOffset = CIRCUM * (1 - progress);
  const displayVol = isMuted ? 0 : volume;
  const formatTime = (s: number) =>
    `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const ringColor =
    timerState==='done'    ? '#ef4444' :
    timerState==='paused'  ? '#f97316' :
    timerState==='running' ? '#8b5cf6' : '#d1d5db';

  const fabGradient =
    timerState==='running' ? 'from-violet-500 to-purple-600' :
    timerState==='paused'  ? 'from-amber-400 to-orange-500'  :
    timerState==='done'    ? 'from-green-500 to-emerald-600'  :
                             'from-purple-500 to-pink-500';

  const fabLabel =
    timerState==='running' ? formatTime(timeLeft) :
    timerState==='paused'  ? formatTime(timeLeft) :
    timerState==='done'    ? 'Done!' : 'Focus';

  const activeTrackInfo = ALL_TRACKS.find(t => t.id === activeTrack)!;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="timer-panel"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit=  {{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-[5.5rem] right-4 z-50 no-print w-80 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
            role="dialog"
            aria-modal="false"
            aria-label="Focus timer and music"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex gap-1">
                {(['timer','music'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      activeTab===tab ? 'bg-white text-purple-600 shadow' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {tab==='timer' ? '⏱ Timer' : '🎵 Music'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1">

              {/* ── Timer tab ── */}
              {activeTab === 'timer' && (
                <div className="p-5">
                  {/* Ring */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative">
                      <svg width={RING_CX*2} height={RING_CX*2} className="-rotate-90" aria-hidden="true">
                        <circle cx={RING_CX} cy={RING_CX} r={RING_R} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                        <circle cx={RING_CX} cy={RING_CX} r={RING_R} fill="none"
                          stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                          strokeDasharray={CIRCUM} strokeDashoffset={dashOffset}
                          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-bold tabular-nums text-3xl opacity-0 select-none" aria-hidden="true">88:88</span>
                        <span className="font-bold tabular-nums text-3xl text-gray-800 absolute">{formatTime(timeLeft)}</span>
                        <span className="text-xs text-gray-400 mt-6">
                          {timerState==='done'?'✅ Done!':timerState==='running'?'Focus time':timerState==='paused'?'Paused':'Ready'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="flex gap-1.5 justify-center mb-5" role="group" aria-label="Timer presets">
                    {PRESETS.map(p => (
                      <button key={p} onClick={() => handlePreset(p)}
                        disabled={timerState==='running'} aria-pressed={preset===p}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
                          preset===p ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >{p}m</button>
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    <button onClick={handleStartPause}
                      className={`flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${
                        timerState==='running' ? 'from-amber-400 to-orange-500' : 'from-purple-500 to-pink-500'
                      } hover:opacity-90 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 transition-[transform,opacity]`}
                    >
                      {timerState==='running' ? <><Pause className="w-4 h-4" aria-hidden="true" />Pause</>
                       : timerState==='paused' ? <><Play  className="w-4 h-4" aria-hidden="true" />Resume</>
                       : <><Play className="w-4 h-4" aria-hidden="true" />Start</>}
                    </button>
                    <button onClick={handleReset} aria-label="Reset"
                      className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-[transform,background-color]"
                    ><RotateCcw className="w-5 h-5" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {/* ── Music tab ── */}
              {activeTab === 'music' && (
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-3">
                    All sounds work offline. Music stops when your timer ends.
                  </p>

                  {/* Main 8 tracks */}
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Ambient sound">
                    {MAIN_TRACKS.map(track => (
                      <TrackCard key={track.id} track={track} active={activeTrack===track.id} onSelect={applyTrack} />
                    ))}
                  </div>

                  {/* ── More button ── */}
                  <button
                    onClick={() => setShowMore(s => !s)}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-purple-600 text-sm font-semibold transition-colors border-2 border-dashed border-gray-200 hover:border-purple-300"
                    aria-expanded={showMore}
                  >
                    {showMore
                      ? <><ChevronUp className="w-4 h-4" aria-hidden="true" />Less</>
                      : <><ChevronDown className="w-4 h-4" aria-hidden="true" />More sounds</>
                    }
                  </button>

                  {/* ── Expanded more section ── */}
                  <AnimatePresence initial={false}>
                    {showMore && (
                      <motion.div
                        key="more-sounds"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="pt-3 border-t border-gray-100 mt-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Lo-fi Variants & More
                          </p>
                          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="More sounds">
                            {MORE_TRACKS.map(track => (
                              <TrackCard key={track.id} track={track} active={activeTrack===track.id} onSelect={applyTrack} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Binaural tip */}
                  {activeTrack === 'binaural' && (
                    <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700">
                      <span aria-hidden="true">🎧</span>
                      <span>Left ear: 100 Hz · Right ear: 110 Hz · 10 Hz difference → alpha brainwaves. Needs headphones.</span>
                    </div>
                  )}

                  {/* Volume */}
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => setIsMuted(m => !m)} aria-label={isMuted?'Unmute':'Mute'}
                      className="text-gray-500 hover:text-purple-500 transition-colors shrink-0">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div
                      ref={sliderRef}
                      role="slider" aria-label="Volume"
                      aria-valuenow={Math.round(displayVol*100)} aria-valuemin={0} aria-valuemax={100}
                      tabIndex={0}
                      className="relative flex-1 h-3 bg-gray-200 rounded-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                      onPointerDown={onSliderDown}
                      onPointerMove={e => { if (draggingRef.current) computeVol(e); }}
                      onPointerUp={() => { draggingRef.current=false; }}
                      onPointerCancel={() => { draggingRef.current=false; }}
                      onKeyDown={e => {
                        if (e.key==='ArrowRight') setVolume(v=>Math.min(1,v+0.05));
                        if (e.key==='ArrowLeft')  setVolume(v=>Math.max(0,v-0.05));
                      }}
                    >
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none"
                        style={{ width: `${displayVol*100}%` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-400 rounded-full shadow pointer-events-none"
                        style={{ left: `calc(${displayVol*100}% - 8px)` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right tabular-nums shrink-0">
                      {Math.round(displayVol*100)}%
                    </span>
                  </div>

                  {/* Now playing */}
                  {activeTrack !== 'off' && (
                    <div className="mt-3 flex items-center gap-2 text-purple-600 bg-purple-50 rounded-xl px-3 py-2">
                      <span className="text-base animate-pulse" aria-hidden="true">{activeTrackInfo.emoji}</span>
                      <span className="text-sm font-medium">Now playing: {activeTrackInfo.label}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Open focus timer"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`fixed bottom-6 right-6 z-50 no-print flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-semibold shadow-2xl ring-[3px] ring-white/90 bg-gradient-to-r ${fabGradient}`}
      >
        <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums text-sm">{fabLabel}</span>
        {activeTrack !== 'off' && <span className="text-sm" aria-hidden="true">{activeTrackInfo.emoji}</span>}
        {timerState === 'running' && (
          <span className="w-2 h-2 bg-white/80 rounded-full animate-pulse shrink-0" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
}
