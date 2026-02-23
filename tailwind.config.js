/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',  // Small mobile devices
        'sm': '640px',  // Standard mobile
        'md': '768px',  // Tablet
        'lg': '1024px', // Desktop
        'xl': '1280px', // Large desktop
      },
      colors: {
        obsidian: "#09090b",
        "obsidian-light": "#0c0c0e",
        emerald: "#10b981",
        luxury: {
          dark: "#0f172a",
          darker: "#0a0e27",
          gold: "#fbd34d",
        }
      },
      fontSize: {
        base: "1rem",
        '3.5xl': '2rem',
      },
      letterSpacing: {
        tighter: "-0.05em",
        wider: "0.1em",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        body: ["Roboto", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "hard-offset": "20px 20px 0px #000",
      },
      spacing: {
        'touch-target': '44px', // Minimum touch target size
      },
    },
  },
  plugins: [],
}
