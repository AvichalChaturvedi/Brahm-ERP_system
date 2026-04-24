/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Instrument Serif"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        bg: '#EDEFF3',
        primary: '#24468E',
        accent: '#55A8D2',
      },
      boxShadow: {
        premium: '0 10px 24px rgba(36,70,142,0.12), 0 2px 8px rgba(17,24,39,0.06)',
        glass: 'inset 0 1px 0 rgba(255,255,255,.5), 0 10px 24px rgba(17,24,39,.08)',
      },
      borderRadius: {
        premium: '0.75rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
