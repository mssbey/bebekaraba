import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4ED',
          100: '#FFE5D4',
          200: '#FFC8A8',
          300: '#FFA371',
          400: '#FB8444',
          500: '#EF742C',
          600: '#D85C18',
          700: '#B34614',
          800: '#8F3815',
          900: '#743014',
          DEFAULT: '#EF742C',
        },
        cream: {
          50: '#FEFEFE',
          100: '#FDFCF8',
          200: '#FAF7F2',
          300: '#F5F1EA',
          DEFAULT: '#F9F7F2',
        },
        sage: {
          50: '#F5F9F5',
          100: '#EBF2EB',
          200: '#D4E7D4',
          300: '#B3D3B3',
          400: '#8EBC8E',
          DEFAULT: '#EBF2EB',
        },
        orange: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD0B8',
          300: '#FFB090',
          400: '#FF8F5E',
          500: '#F4723A',
          600: '#D4571F',
          700: '#B34618',
          DEFAULT: '#F4723A',
        },
        navy: {
          50: '#EEF3FA',
          100: '#D3E2F5',
          200: '#A6C5EA',
          300: '#79A8DF',
          400: '#4C8BD4',
          500: '#2A6496',
          600: '#245480',
          700: '#1B3A5C',
          800: '#122845',
          900: '#0A1E35',
          DEFAULT: '#1B3A5C',
        },
        charcoal: {
          DEFAULT: '#2D2D3A',
          light: '#4A4A5A',
        },
        border: '#EDE9E4',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(27, 58, 92, 0.06)',
        'card-hover': '0 20px 60px rgba(27, 58, 92, 0.12)',
        'orange': '0 4px 20px rgba(244, 114, 58, 0.30)',
        'glass': '0 8px 32px rgba(27, 58, 92, 0.08)',
        'inner-soft': 'inset 0 1px 3px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'float': 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'shake': 'shake 0.4s ease',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-1deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-7px)' },
          '40%,80%': { transform: 'translateX(7px)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F9F7F2 0%, #F0F6F0 50%, #EBF2EB 100%)',
        'cta-gradient': 'linear-gradient(135deg, #122845 0%, #1B3A5C 50%, #245480 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F4723A 0%, #D4571F 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
