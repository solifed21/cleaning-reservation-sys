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
          primary: '#1565D8',
          'primary-hover': '#114FA6',
          secondary: '#13B8A6',
          'secondary-soft': '#E8FBF7',
          soft: '#EAF3FF',
        },
        surface: {
          subtle: '#F2F7FB',
          muted: '#F6F9FC',
          default: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#DCE5F0',
          strong: '#BCCDE1',
        },
        text: {
          primary: '#111827',
          secondary: '#526072',
          tertiary: '#8795A8',
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
        card: '0 12px 40px rgba(17, 24, 39, 0.06)',
        elevated: '0 18px 56px rgba(17, 24, 39, 0.10)',
        float: '0 16px 48px rgba(21, 101, 216, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
