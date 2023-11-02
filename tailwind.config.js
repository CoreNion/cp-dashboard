/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./components/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "dark",
    ],
  },
}
