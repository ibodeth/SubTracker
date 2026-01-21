/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        card: '#1e293b',
        text: '#f8fafc',
        accent: '#3b82f6',
        warning: '#f59e0b',
      }
    },
  },
  plugins: [],
}
