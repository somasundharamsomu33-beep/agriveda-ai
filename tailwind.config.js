/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          blue: '#2563eb',
          dark: '#0f172a',
          light: '#eff6ff',
          green: '#16a34a',
        }
      }
    },
  },
  plugins: [],
}
