import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@components": "/src/components/index.ts",
      "@shared": "/src/shared/",
      "@services": "/src/shared/services/index.ts",
      "@": "/src/",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-tanstack";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          if (
            id.includes("node_modules/motion") ||
            id.includes("node_modules/framer-motion")
          ) {
            return "vendor-motion";
          }
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/yup")
          ) {
            return "vendor-forms";
          }
        },
      },
    },
  },
});
