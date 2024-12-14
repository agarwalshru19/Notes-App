import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Binds to all interfaces
    port: 5173, // Uses PORT env variable or defaults to 5173
    strictPort: true, // Ensures the app crashes if the port is already in use
  },
});
