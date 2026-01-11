/** @type {import('tailwindcss').Config} */
export default {
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
    // Existing gradient colors
    'from-blue-400',
    'to-cyan-500',
    'from-purple-400',
    'to-pink-500',
    'from-green-400',
    'to-emerald-500',
    'from-orange-400',
    'from-orange-500',
    'from-orange-600',
    'to-red-500',
    'to-red-600',
    'from-amber-400',
    'to-orange-500',
    // Coin gradient colors
    'to-amber-700',
    'from-slate-500',
    'to-slate-700',
    'from-slate-600',
    'to-slate-800',
    'from-gray-400',
    'to-gray-600',
    'to-yellow-600',
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
