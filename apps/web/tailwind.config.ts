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
        ink: '#0f172a',
        mist: '#f4f7fb',
        sky: '#d7eefc',
        tide: '#0b4f6c',
      },
      boxShadow: {
        card: '0 18px 45px rgba(11, 79, 108, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
