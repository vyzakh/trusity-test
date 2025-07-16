import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 7001,
  },
});
