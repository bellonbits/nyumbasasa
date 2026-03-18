import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — blue
        brand: {
          50:  "#eef3ff",
          100: "#d9e4ff",
          200: "#bccbff",
          300: "#8ea9ff",
          400: "#567bff",
          500: "#0057ff",  // primary — brand blue
          600: "#003ecc",
          700: "#003099",
          800: "#002580",
          900: "#001a5c",
          950: "#000f38",
        },
        // Accent — warm orange
        accent: {
          DEFAULT: "#f97c00",
          light:   "#fff3e0",
          dark:    "#c46000",
        },
        // Neutral text
        ink: {
          DEFAULT: "#191919",  // primary text
          muted:   "#707070",  // secondary text
          faint:   "#a0a0a0",  // placeholder / captions
        },
        // Surface / background
        surface: {
          DEFAULT: "#f9f9f9",
          card:    "#ffffff",
          muted:   "#f2f4f8",
          border:  "#e8ecf2",
          sage:    "#f0f4f0",   // dashboard canvas background
          "sage-dark": "#e4ece4",
        },
      },
      fontFamily: {
        sans:    ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["3.5rem",  { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-lg": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.02em" }],
        "display-sm": ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        lg:  "0.75rem",   // 12px
        xl:  "1rem",      // 16px
        "2xl": "1.25rem", // 20px
        "3xl": "1.5rem",  // 24px
        md:  "0.5rem",
        sm:  "0.375rem",
      },
      boxShadow: {
        card:    "0 1px 10px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.12)",
        blue:    "0 4px 24px rgba(0,87,255,0.18)",
        "blue-lg": "0 8px 40px rgba(0,87,255,0.25)",
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(160deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 100%)",
        "brand-gradient":  "linear-gradient(135deg, #0057ff 0%, #003ecc 100%)",
        "card-gradient":   "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.82) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        slideLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.4s ease forwards",
        "float":     "float 4s ease-in-out infinite",
        "slide-left":"slideLeft 0.5s ease forwards",
        "shimmer":   "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: { addUtilities: (utils: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};

export default config;
