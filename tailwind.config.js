/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./main.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        'comfortaa': ['Comfortaa', 'cursive'],
        'sans': ['Comfortaa', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'comfortaa-regular': '400',
        'comfortaa-medium': '500',
        'comfortaa-semibold': '600',
        'comfortaa-bold': '700',
      }
    },
  },
  plugins: [],
}
