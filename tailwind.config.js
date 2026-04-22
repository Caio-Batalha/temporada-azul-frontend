import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#e9f9ff",
          100: "#c9f1ff",
          200: "#97e4ff",
          300: "#56d2ff",
          400: "#17bfff",
          500: "#00a7f0",
          600: "#0084c2",
          700: "#006b9e",
          800: "#00557e",
          900: "#00476a",
        },
        deep: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b7ccff",
          300: "#86a6ff",
          400: "#5c80ff",
          500: "#3b5fff",
          600: "#2f49e6",
          700: "#263bb8",
          800: "#1f2f91",
          900: "#0b1c4a",
        },
        sand: {
          50: "#faf6f0",
          100: "#f1e8da",
          200: "#e5d2b9",
          300: "#d6b48f",
          400: "#c19364",
          500: "#a7774b",
          600: "#8a5f3b",
          700: "#704c31",
          800: "#5c3f2b",
          900: "#4c3525",
        },
        ink: {
          500: "#1a2a4a",
          600: "#132242",
          700: "#0b1c4a",
          800: "#071336",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Times New Roman", "serif"],
        sans: ["Source Sans 3", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(42, 122, 134, 0.25)",
      },
      backgroundImage: {
        "sea-gradient":
          "radial-gradient(1100px 620px at 18% 10%, rgba(0, 167, 240, 0.22), transparent 62%), radial-gradient(900px 520px at 84% 6%, rgba(59, 95, 255, 0.18), transparent 58%), radial-gradient(900px 700px at 50% 110%, rgba(11, 28, 74, 0.10), transparent 60%), linear-gradient(180deg, #f5fbff 0%, #eaf4ff 58%, #deedff 100%)",
        "ocean-wave":
          "linear-gradient(120deg, rgba(11, 28, 74, 0.08) 0%, rgba(0, 167, 240, 0.16) 55%, rgba(245, 251, 255, 0.74) 100%)",
      },
    },
  },
  plugins: [typography],
};
