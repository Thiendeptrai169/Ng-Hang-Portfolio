/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Braah One", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        void: "#01011e",
        ink: "#050532",
        aura: "#60adff",
        comet: "#2e85ff",
        star: "#f6c758",
        ember: "#ff8f38"
      },
      boxShadow: {
        aura: "0 0 40px rgba(46, 133, 255, 0.32)",
        plaque: "0 -10px 30px rgba(46, 133, 255, 0.23), 0 12px 32px rgba(0, 0, 0, 0.36)"
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
