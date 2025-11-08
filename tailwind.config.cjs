module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx,tsx}'
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
