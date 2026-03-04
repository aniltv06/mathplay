/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Design tokens — gradient maps and brand colours.
 * GRADIENT_STYLES was previously declared inline in HomePage.tsx.
 */

// ─── Gradient class → CSS gradient map ────────────────────────────────────────
// Maps Tailwind gradient class strings to their CSS gradient values so they render
// correctly when Tailwind purges dynamic class names at build time.

export const GRADIENT_STYLES: Record<string, string> = {
  'from-blue-400 to-cyan-500':      'linear-gradient(to bottom right,rgb(96,165,250),rgb(6,182,212))',
  'from-green-400 to-emerald-500':  'linear-gradient(to bottom right,rgb(74,222,128),rgb(16,185,129))',
  'from-purple-400 to-pink-500':    'linear-gradient(to bottom right,rgb(192,132,252),rgb(236,72,153))',
  'from-orange-400 to-red-500':     'linear-gradient(to bottom right,rgb(251,146,60),rgb(239,68,68))',
  'from-yellow-400 to-amber-500':   'linear-gradient(to bottom right,rgb(250,204,21),rgb(245,158,11))',
  'from-red-400 to-pink-500':       'linear-gradient(to bottom right,rgb(248,113,113),rgb(236,72,153))',
  'from-cyan-400 to-blue-500':      'linear-gradient(to bottom right,rgb(34,211,238),rgb(59,130,246))',
  'from-indigo-400 to-purple-500':  'linear-gradient(to bottom right,rgb(129,140,248),rgb(168,85,247))',
  'from-teal-400 to-green-500':     'linear-gradient(to bottom right,rgb(45,212,191),rgb(34,197,94))',
  'from-teal-400 to-cyan-500':      'linear-gradient(to bottom right,rgb(45,212,191),rgb(6,182,212))',
  'from-blue-400 to-indigo-500':    'linear-gradient(to bottom right,rgb(96,165,250),rgb(99,102,241))',
  'from-amber-400 to-orange-500':   'linear-gradient(to bottom right,rgb(251,191,36),rgb(249,115,22))',
  'from-rose-400 to-pink-500':      'linear-gradient(to bottom right,rgb(251,113,133),rgb(236,72,153))',
};

// ─── Brand colours ─────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  purple:    '#7c3aed',
  pink:      '#ec4899',
  green:     '#16a34a',
  blue:      '#2563eb',
  orange:    '#ea580c',
  red:       '#dc2626',
  yellow:    '#ca8a04',
  teal:      '#0d9488',
  indigo:    '#4338ca',
  cyan:      '#0891b2',
} as const;
