import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        risk: {
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Noto Sans',
          'Noto Sans Devanagari',
          'Noto Sans JP',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
