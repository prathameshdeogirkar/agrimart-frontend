/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgba(38, 65, 52, 1)',
          dark: '#253e32',
          light: '#3f5944f3',
          lighter: '#b6c0b8',
          600: 'rgba(38, 65, 52, 1)',
          700: '#2d4d3d',
        },
      },
    },
  },
  plugins: [],
}


