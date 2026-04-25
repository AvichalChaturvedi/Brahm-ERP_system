/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
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
        background: '#F4F5F7',
        surface: '#FFFFFF',
        surfaceMuted: '#EDEFF3',
        bg: '#F4F5F7',
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          soft: '#FFF3E0',
          muted: '#FDBA74',
        },
        accent: '#55A8D2',
        ink: {
          DEFAULT: '#1F2937',
          soft: '#374151',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        sidebar: {
          DEFAULT: '#111827',
          hover: '#1F2937',
          active: '#F97316',
          text: '#F9FAFB',
          muted: '#9CA3AF',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#475569',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
        card: '0 8px 24px rgba(15, 23, 42, 0.06)',
        elevated: '0 16px 40px rgba(15, 23, 42, 0.10)',
        premium: '0 8px 24px rgba(15, 23, 42, 0.06)',
        glass: 'inset 0 1px 0 rgba(255,255,255,.5), 0 10px 24px rgba(17,24,39,.08)',
      },
      borderRadius: {
        premium: '0.75rem',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'industrial-grid':
          'linear-gradient(rgba(31,41,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,41,55,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
};
