import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dyadComponentTagger(), // Enables component selection in Applaa preview
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Use lucide-react CJS bundle to avoid ESM individual-icon resolution failures.
      // The ESM entry (dist/esm/lucide-react.js) re-exports from ~1700 individual
      // ./icons/*.js files; on Windows, npm sometimes extracts the tarball partially,
      // leaving those files missing and causing 1500+ Vite dep-bundling errors.
      // The CJS bundle is a single self-contained file and never has this problem.
      "lucide-react": path.resolve(__dirname, "node_modules/lucide-react/dist/cjs/lucide-react.js"),
    },
  },
});