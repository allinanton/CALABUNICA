/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        "orange": "#ff3c0c",
        "red": "#ff7f66",
        "secondary": "#555",
        "prigmayBG": "#FCFCFC"
      },
      fontFamily:{
        "primary" : ['Dancing Script', 'serif']
      }
    },
  },
  plugins: [require("daisyui")],
}

