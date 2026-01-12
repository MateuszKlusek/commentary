import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export const aliasResolution = {
  "@ui": path.resolve(__dirname, "./src/ui"),
  "@core": path.resolve(__dirname, "./src/core"),
  "@shared": path.resolve(__dirname, "../shared"),
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: aliasResolution,
  },
});
