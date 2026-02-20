/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1E293B',
        },
        royal: {
          600: '#2563EB',
          500: '#3B82F6',
        },
        coral: {
          500: '#EF4444',
          600: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}
