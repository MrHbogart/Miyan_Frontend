module.exports = {
  darkMode: 'class',
  content: [
    './app.vue',
    './components/**/*.{vue,js,jsx,tsx}',
    './layouts/**/*.{vue,js,jsx,tsx}',
    './pages/**/*.{vue,js,jsx,tsx}',
    './composables/**/*.{js,ts}',
    './state/**/*.{js,ts}',
    './utils/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF', // now white background
        accent: '#0b0b0b', // dark text
        primary: '#1f2937',
        brand: '#5C3A21' // modern dark brown
      },
      fontFamily: {
        'b-titr': ['B Titr', 'system-ui'],
        'cinzel': ['Cinzel', 'serif']
      }
    }
  },
  plugins: []
}
