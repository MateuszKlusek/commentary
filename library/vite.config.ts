import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const projectRoot = path.resolve(__dirname);

export const aliasResolution = {
  "@ui": path.resolve(projectRoot, "./src/ui"),
  "@core": path.resolve(projectRoot, "./src/core"),
  // Note: Referencing files outside the package root can sometimes
  // break type generation if they aren't included in tsconfig
  "@shared": path.resolve(projectRoot, "../shared"),
};

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: "bundle-analysis.html" }),
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
      // Include the whole src directory so it can resolve @ui, @core, etc.
      include: ["src/**/*.ts", "src/**/*.tsx"],
      insertTypesEntry: true,
      outDir: "dist",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: aliasResolution,
  },
  build: {
    lib: {
      entry: path.resolve(projectRoot, "./src/ui/library/Commentary.tsx"),
      name: "Commentary",
      formats: ["es", "umd"],
      fileName: (format) => `commentary.${format}.js`,
      cssFileName: "style",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom/client": "ReactDOMClient",
        },
      },
    },
  },
});
