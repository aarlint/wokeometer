/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        light: {
          bg: '#ffffff',
          card: '#ffffff',
          border: '#e9ecef',
          text: '#4a5568',
          muted: '#718096',
        },
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#333333',
          text: '#f5f5f5',
          muted: '#a0a0a0',
        },
        glass: {
          bg: 'rgba(30, 30, 30, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
          highlight: 'rgba(255, 255, 255, 0.05)',
        },
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
        },
        category: {
          limited: '#10b981',
          woke: '#f59e0b',
          very: '#ef4444',
          egregiously: '#7f1d1d',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neoglass': '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
        'neoglass-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
