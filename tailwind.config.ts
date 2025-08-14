import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px", },
    },
    extend: {
      animation: { 'fade-up': 'fade-up 0.5s ease-out forwards', },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: { 'fade-up': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' }, }, },

      colors: {
        white: { "active": "#ffff", "semi-active": "#e6eef8", "mini-active": "#A0DBF4" },
        secondary: {  "active": "#F7AC25", "semi-active": "#FFC459", "mini-active": "#efe8d9" },
        primary: { "active": "#082777", "semi-active": "#4B93E7", "mini-active": "#9dc2ef", "micro-active": "#d3e4f8" },
        
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      },
      
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

