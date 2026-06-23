/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // الهوية البصرية: وردي ناعم + برتقالي دافئ
        primary: {
          DEFAULT: "#E89B8B", // وردي ترابي ناعم
          light: "#F5C6BA",
          dark: "#D97D6B",
        },
        accent: {
          DEFAULT: "#F2A65A", // برتقالي دافئ
          light: "#F7C18A",
          dark: "#E08A3C",
        },
        cream: "#FFF5F2", // خلفية كريمية وردية
        ink: "#3D2B28", // نص بني داكن
        muted: "#9C8580", // نص ثانوي
      },
      fontFamily: {
        cairo: ["Cairo_400Regular"],
        "cairo-bold": ["Cairo_700Bold"],
      },
    },
  },
  plugins: [],
};
