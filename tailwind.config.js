/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true, // Centers the container
      screens: {
        sm: "100%", // Full-width on small screens
        md: "100%", // Fixed max-width for medium screens
        lg: "992px", // Fixed max-width for large screens
        xl: "992px", // Fixed max-width for extra-large screens
        "2xl": "992px", // Fixed max-width for 2xl screens
      },
    },
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"], // Change to your desired font family
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
