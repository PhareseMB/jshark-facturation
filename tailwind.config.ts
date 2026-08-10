import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Identité J-SHARK : bleu abysse (interface) + cyan glacier (accent)
        abyss: {
          950: '#03060c',
          900: '#060b16',
          800: '#0a1220',
          700: '#101b2e',
          600: '#182643',
          500: '#22355c',
          400: '#3a4f7a',
        },
        glacier: {
          100: '#d6faff',
          200: '#a8f2ff',
          300: '#6fe6fb',
          400: '#22d3ee',
          500: '#0cb8d6',
          600: '#0a93ac',
        },
      },
      fontFamily: {
        brand: ['"Archivo Expanded"', '"Archivo"', 'sans-serif'],
        sans: ['"Archivo"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34, 211, 238, 0.35), 0 0 24px rgba(34, 211, 238, 0.15)',
      },
    },
  },
}
