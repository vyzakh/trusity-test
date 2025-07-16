import { heroui } from "@heroui/theme";

export default heroui({
  defaultTheme: "light",
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#111F43",
          foreground: "#FFFFFF",
        },
        secondary: { DEFAULT: "#F79333", foreground: "#FFFFFF" },
        danger: { DEFAULT: "#FF0000", foreground: "#FFFFFF" },
        warning: { DEFAULT: "#FAAD14", foreground: "#FFFFFF" },
        success: { DEFAULT: "#52C41A", foreground: "#FFFFFF" },
      },
    },
  },
});
