/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0d14',
          900: '#0f1422',
          800: '#171f33',
          700: '#232d48',
          600: '#324063',
        },
        whatsapp: {
          50: '#eefdf4',
          100: '#d5fae4',
          400: '#25d366',
          500: '#128c7e',
          600: '#075e54',
          700: '#05463e',
          bubble: '#005c4b',
          incoming: '#202c33',
          chatbg: '#0b141a'
        },
        turnia: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
