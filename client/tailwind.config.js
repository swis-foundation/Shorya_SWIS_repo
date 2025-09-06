/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#FFFBF5', // Warm Creamy White
        'brand-primary': '#9C3353',    // Milaap's Pink/Maroon
        'brand-primary-hover': '#872b47',
        'brand-secondary': '#F5D0A9',  // Light Accent
        'brand-text': '#333333',      // Dark text
        'brand-text-light': '#555555', // Lighter text
      }
    },
  },
  plugins: [],
}
