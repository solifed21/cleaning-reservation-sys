import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './server/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          soft: '#EFF6FF',
        },
        surface: {
          subtle: '#F9FAFB',
          default: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          onbrand: '#FFFFFF',
        },
        status: {
          success: '#10B981',
          'success-soft': '#ECFDF5',
          warning: '#F59E0B',
          'warning-soft': '#FFFBEB',
          danger: '#EF4444',
          'danger-soft': '#FEF2F2',
          info: '#3B82F6',
          'info-soft': '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.06)',
        elevated: '0 6px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
