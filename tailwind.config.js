/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        curieBlue: '#1a2d8d',
        curieLightBlue: '#e8ecfc',
        curieLightGray: "#ebeaef",
        curieTeal: "#cbf8fc",
        curieYellow: "#ffc928",
      },
    },
    gridTemplateColumns: {
      "auto-fit": "repeat(auto-fit, minmax(8rem, 1fr))",
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}
