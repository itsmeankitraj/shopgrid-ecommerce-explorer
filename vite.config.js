import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Enables the React JSX transform and Fast Refresh during development.
export default defineConfig({
  plugins: [react()],
});
