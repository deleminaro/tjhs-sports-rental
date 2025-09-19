/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tjhs-blue': '#1e40af',
        'tjhs-gold': '#f59e0b',
        'tjhs-green': '#10b981',
      },
    },
  },
  plugins: [],
}
