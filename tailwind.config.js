/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          curieBlue: '#1a2d8d',
          curieLightBlue: '#e8ecfc',
          curieLightGray: "#ebeaef",
          curieTeal: "#cbf8fc",
        },
      },
    },
    plugins: [],
  }
  