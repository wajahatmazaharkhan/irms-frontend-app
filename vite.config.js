import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true, // Expose to all networks
      port: parseInt(env.PORT) || 3000, // Use Railway's PORT or default to 3000
      allowedHosts: ["www.iisppr.com", "iisppr.com"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
