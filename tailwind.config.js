/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Cal Sans"', '"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f7f8', 100: '#eeeef0', 200: '#d9d9de', 300: '#b7b8c0',
          400: '#8f909c', 500: '#6f6f7d', 600: '#585865', 700: '#484852',
          800: '#3d3d45', 900: '#25252b', 950: '#17171b',
        },
        brand: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        accent: {
          rose: '#fb7185', violet: '#8b5cf6', amber: '#f59e0b',
          emerald: '#10b981', cyan: '#06b6d4',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(23,23,27,0.06), 0 8px 24px -8px rgba(23,23,27,0.08)',
        card: '0 1px 2px rgba(23,23,27,0.04), 0 12px 32px -12px rgba(23,23,27,0.10)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px -8px rgba(59,130,246,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem', xl3: '1.75rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        shimmer: 'shimmer 2.2s infinite linear',
      },
    },
  },
  plugins: [],
}
