/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom color palette based on requirements - NO shadcn colors
        platinum: {
          DEFAULT: "#dcdcdd",
          50: "#f8f8f8",
          100: "#f1f1f1",
          200: "#e9e9ea",
          300: "#e2e2e3",
          400: "#afafb0",
          500: "#dcdcdd",
          600: "#828285",
          700: "#575759",
          800: "#2b2b2c",
          900: "#f8f8f8",
        },
        french_gray: {
          DEFAULT: "#c5c3c6",
          50: "#f3f3f4",
          100: "#e8e7e8",
          200: "#dcdbdd",
          300: "#d1cfd1",
          400: "#9e9aa0",
          500: "#c5c3c6",
          600: "#777279",
          700: "#4f4c51",
          800: "#282628",
          900: "#f3f3f4",
        },
        outer_space: {
          DEFAULT: "#46494c",
          50: "#d9dbdc",
          100: "#b4b7b9",
          200: "#8e9297",
          300: "#6a6e73",
          400: "#393b3e",
          500: "#46494c",
          600: "#2b2c2e",
          700: "#1c1e1f",
          800: "#0e0f0f",
          900: "#d9dbdc",
        },
        "payne's_gray": {
          DEFAULT: "#4c5c68",
          50: "#d9dfe3",
          100: "#b2bec7",
          200: "#8c9eab",
          300: "#677d8e",
          400: "#3c4953",
          500: "#4c5c68",
          600: "#2d373e",
          700: "#1e2429",
          800: "#0f1215",
          900: "#d9dfe3",
        },
        blue_munsell: {
          DEFAULT: "#1985a1",
          50: "#c7edf6",
          100: "#8edaed",
          200: "#56c8e5",
          300: "#22b3d7",
          400: "#146a7f",
          500: "#1985a1",
          600: "#0f4f5f",
          700: "#0a3540",
          800: "#051a20",
          900: "#c7edf6",
        },
        black_shades: {
          DEFAULT: "#121212",
          100: "#191919",
          200: "#252525"
        },




        modal_light: {
          DEFAULT: "#e8e7e8",
          100: "#f8f8f8"
        },
        modal_dark: {
          DEFAULT: "#121212",
          100: "#1e1e1e",
        },
        modal_blue: {
          DEFAULT: "#146a7f",
          100: "#0f4f5f"
        },

        page_light: {
          DEFAULT: "#f4f4f4", // page
          100: "#ffffff"      // card
        },
        page_dark: {
          DEFAULT: "#0e1011",   // page
          100: "#17191a"        // card
        },
        page_gray: {
          DEFAULT: "#616a77",   // text
          100: "#d1cfd1",       // border
           200: "#46494c"
        },
        page_blue: {
          DEFAULT: "#8edaed",   // background
          100: "#1985a1"        // icon
        }



      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
}