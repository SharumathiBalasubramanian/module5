/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds & surfaces
        surface: {
          DEFAULT: '#FAFAFA', // Page body
          card: '#FFFFFF',    // Product cards & modals
          muted: '#F4F4F5',   // Sub-containers & image boxes
          border: '#E4E4E7',  // Neutral divider line
        },
        // Deep Charcoal / Onyx (replaces 'ink')
        brand: {
          DEFAULT: '#18181B', // Primary text & heavy accents (zinc-900)
          dark: '#09090B',    // Footers, navbars, solid elements
          light: '#27272A',   // Secondary elevated elements
        },
        // Nordic Emerald / Sage (replaces 'clay' and 'plum')
        accent: {
          light: '#A7F3D0',   // Emerald 200 (subtle badges/tags)
          DEFAULT: '#10B981', // Emerald 500 (buttons, active links)
          hover: '#059669',   // Emerald 600 (interaction state)
          dark: '#064E3B',    // Emerald 900 (deep accent text)
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        hover: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};