export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f0f6',
          100: '#dddce9',
          200: '#bcbad5',
          300: '#9a97c0',
          400: '#8280b3',
          500: '#6968A6',
          600: '#565593',
          700: '#454480',
          800: '#34336a',
          900: '#252456',
          950: '#151440',
        },
        secondary: {
          50: '#fdf5f4',
          100: '#f9e8e6',
          200: '#f2d1cd',
          300: '#e5b3ac',
          400: '#CF9893',
          500: '#b87a75',
          600: '#a05f5a',
          700: '#854a46',
          800: '#6b3a37',
          900: '#562e2c',
        },
        'bg-dark': '#085078',
        'primary-purple': '#6968A6',
        'primary-magenta': '#CF9893',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}