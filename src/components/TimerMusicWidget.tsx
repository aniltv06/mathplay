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
import {
  type AmbientTrack,
  getAudioCtx, resumeAudioCtx, startAmbientSound, playChime,
} from '../utils/audioSynthesis';

// ─── Types ────────────────────────────────────────────────────────────────────

type TimerState  = 'idle' | 'running' | 'paused' | 'done';

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
    try { gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, getAudioCtx().currentTime); } catch (_) {}
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
      resumeAudioCtx();
      const ctx = getAudioCtx();
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
