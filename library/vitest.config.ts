import { defineConfig } from "vitest/config";
import { aliasResolution } from "./vite.config";

export default defineConfig({
  resolve: {
    alias: aliasResolution,
  },
  test: {
    reporters: ["verbose"],
  },
});
