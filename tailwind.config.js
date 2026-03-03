/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Gradient directions
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    // Operation button colors (used dynamically)
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'text-white',
    // Difficulty preset colors
    'from-green-500',
    'to-emerald-500',
    // Common gradient combinations - FROM colors
    'from-blue-400',
    'from-purple-400',
    'from-purple-500',
    'from-purple-600',
    'from-green-400',
    'from-green-500',
    'from-green-600',
    'from-orange-400',
    'from-orange-500',
    'from-orange-600',
    'from-red-400',
    'from-amber-400',
    'from-slate-500',
    'from-slate-600',
    'from-gray-400',
    'from-yellow-400',
    // Common gradient combinations - TO colors
    'to-cyan-500',
    'to-pink-500',
    'to-pink-600',
    'to-emerald-500',
    'to-emerald-600',
    'to-orange-500',
    'to-red-500',
    'to-red-600',
    'to-amber-700',
    'to-slate-700',
    'to-slate-800',
    'to-gray-600',
    'to-yellow-600',
    // Hover states for gradients
    'hover:from-purple-600',
    'hover:from-green-600',
    'hover:from-blue-500',
    'hover:from-orange-600',
    'hover:to-pink-600',
    'hover:to-emerald-600',
    'hover:to-purple-600',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
