/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Web Audio DSP functions extracted from TimerMusicWidget.tsx.
 * All sounds are synthesised offline via the Web Audio API — no internet needed.
 *
 * Exports:
 *   getAudioCtx       – singleton AudioContext getter
 *   resumeAudioCtx    – resume a suspended context
 *   getCachedBuffer   – buffer cache (avoids regenerating on every play)
 *   playChime         – completion chime C5→E5→G5→C6
 *   mkWhite           – white-noise buffer
 *   mkPink            – pink-noise buffer (Paulstretch coefficients)
 *   buildFireBuffer   – fireplace crackling
 *   buildForestBuffer – forest bird-chirps + wind
 *   buildLofiBuffer   – parameterised lo-fi beat (kick/snare/hat/chord/bass)
 *   LOFI_PRESETS      – named lo-fi configurations
 *   buildAmbientPadsBuffer – slow chord swells (no drums)
 *   startAmbientSound – main ambient sound engine; returns a stop() cleanup fn
 *   fadeOut           – exponential gain fade-out helper
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type AmbientTrack =
  | 'off' | 'rain' | 'ocean' | 'fire' | 'pink' | 'lofi' | 'forest' | 'binaural'
  | 'lofi-night' | 'lofi-chill' | 'lofi-dreamy' | 'lofi-jazz' | 'ambient-pads' | 'rain-lofi';

export interface LofiParams {
  bpm: number;
  chords: number[][];   // 4 chords, each an array of Hz values
  bassNotes: number[];  // root note Hz per bar
  swing?: number;
}

// ─── Singleton AudioContext ───────────────────────────────────────────────────

type WinWithWebkit = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
let _ctx: AudioContext | null = null;

export function getAudioCtx(): AudioContext {
  if (!_ctx) {
    const Ctor = window.AudioContext ?? (window as WinWithWebkit).webkitAudioContext!;
    _ctx = new Ctor();
  }
  return _ctx;
}

export function resumeAudioCtx() {
  const c = getAudioCtx();
  if (c.state === 'suspended') void c.resume();
}

// ─── Buffer cache ─────────────────────────────────────────────────────────────

const _bufCache = new Map<string, AudioBuffer>();

export function getCachedBuffer(
  key: string,
  build: (ctx: AudioContext) => AudioBuffer,
): AudioBuffer {
  if (!_bufCache.has(key)) _bufCache.set(key, build(getAudioCtx()));
  return _bufCache.get(key)!;
}

// ─── Completion chime C5→E5→G5→C6 ───────────────────────────────────────────

export function playChime(): void {
  try {
    resumeAudioCtx();
    const ctx = getAudioCtx();
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

export function mkWhite(ctx: AudioContext, sec = 3): AudioBuffer {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

export function mkPink(ctx: AudioContext, sec = 3): AudioBuffer {
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

export function buildFireBuffer(ctx: AudioContext): AudioBuffer {
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

export function buildForestBuffer(ctx: AudioContext): AudioBuffer {
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

export function buildLofiBuffer(ctx: AudioContext, p: LofiParams): AudioBuffer {
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

export const LOFI_PRESETS: Record<string, LofiParams> = {
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

export function buildAmbientPadsBuffer(ctx: AudioContext): AudioBuffer {
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

export function startAmbientSound(track: AmbientTrack, gainNode: GainNode): () => void {
  if (track === 'off') return () => {};
  const ctx   = getAudioCtx();
  const stops: Array<() => void> = [];

  try {
    const loopBuf = (buf: AudioBuffer) => {
      const s = ctx.createBufferSource(); s.buffer=buf; s.loop=true;
      s.connect(gainNode); s.start();
      return () => { try { s.stop(); } catch (_) {} };
    };

    if (track === 'rain') {
      const src = ctx.createBufferSource();
      src.buffer=getCachedBuffer('white3', c=>mkWhite(c)); src.loop=true;
      const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=0.5;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.7; lfoG.gain.value=300;
      lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start();
      src.connect(bp); bp.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();lfo.stop();}catch(_){} });

    } else if (track === 'ocean') {
      const src=ctx.createBufferSource();
      src.buffer=getCachedBuffer('white5',c=>mkWhite(c,5)); src.loop=true;
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=500;
      const wMod=ctx.createGain(); wMod.gain.value=0.5;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.12; lfoG.gain.value=0.4;
      lfo.connect(lfoG); lfoG.connect(wMod.gain); lfo.start();
      src.connect(lpf); lpf.connect(wMod); wMod.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();lfo.stop();}catch(_){} });

    } else if (track === 'fire') {
      const src=ctx.createBufferSource();
      src.buffer=getCachedBuffer('fire',buildFireBuffer); src.loop=true;
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=2000;
      src.connect(lpf); lpf.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();}catch(_){} });

    } else if (track === 'pink') {
      const src=ctx.createBufferSource();
      src.buffer=getCachedBuffer('pink3',c=>mkPink(c)); src.loop=true;
      const hpf=ctx.createBiquadFilter(); hpf.type='highpass'; hpf.frequency.value=150;
      src.connect(hpf); hpf.connect(gainNode); src.start();
      stops.push(()=>{ try{src.stop();}catch(_){} });

    } else if (track === 'lofi' || track === 'lofi-night' || track === 'lofi-chill' ||
               track === 'lofi-dreamy' || track === 'lofi-jazz') {
      const preset = LOFI_PRESETS[track];
      stops.push(loopBuf(getCachedBuffer(track, c => buildLofiBuffer(c, preset))));

    } else if (track === 'forest') {
      // Wind: noise + HPF + LFO
      const wSrc=ctx.createBufferSource();
      wSrc.buffer=getCachedBuffer('white4',c=>mkWhite(c,4)); wSrc.loop=true;
      const hpf=ctx.createBiquadFilter(); hpf.type='highpass'; hpf.frequency.value=800;
      const wG=ctx.createGain(); wG.gain.value=0.28;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.2; lfoG.gain.value=0.20;
      lfo.connect(lfoG); lfoG.connect(wG.gain); lfo.start();
      wSrc.connect(hpf); hpf.connect(wG); wG.connect(gainNode); wSrc.start();
      // Birds
      const bSrc=ctx.createBufferSource();
      bSrc.buffer=getCachedBuffer('forest',buildForestBuffer); bSrc.loop=true;
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
      stops.push(loopBuf(getCachedBuffer('ambient-pads', buildAmbientPadsBuffer)));

    } else if (track === 'rain-lofi') {
      // Rain layer
      const rSrc=ctx.createBufferSource();
      rSrc.buffer=getCachedBuffer('white3',c=>mkWhite(c)); rSrc.loop=true;
      const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=0.5;
      const rainG=ctx.createGain(); rainG.gain.value=0.45;
      const lfo=ctx.createOscillator(), lfoG=ctx.createGain();
      lfo.frequency.value=0.7; lfoG.gain.value=300;
      lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start();
      rSrc.connect(bp); bp.connect(rainG); rainG.connect(gainNode); rSrc.start();
      // Lo-fi beat layer
      const bSrc=ctx.createBufferSource();
      bSrc.buffer=getCachedBuffer('lofi',c=>buildLofiBuffer(c,LOFI_PRESETS['lofi'])); bSrc.loop=true;
      const lofiG=ctx.createGain(); lofiG.gain.value=0.65;
      bSrc.connect(lofiG); lofiG.connect(gainNode); bSrc.start();
      stops.push(()=>{ try{rSrc.stop();lfo.stop();bSrc.stop();}catch(_){} });
    }

  } catch (_) { /* Web Audio failed gracefully */ }

  return () => stops.forEach(fn => fn());
}

// ─── Fade out helper ──────────────────────────────────────────────────────────

export function fadeOut(gainNode: GainNode, durationSec = 0.5): void {
  try {
    const ctx = getAudioCtx();
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
  } catch (_) {}
}
