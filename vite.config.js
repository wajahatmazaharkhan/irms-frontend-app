import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    server: {
      host: true, // Expose to all networks
      port: parseInt(env.PORT) || 5173, // Use Railway's PORT or default to 3000
      allowedHosts: [
        "www.iisppr.com",
        "iisppr.com",
        "ims-frontend-app-production.up.railway.app",
        ".railway.app", // Allow all Railway subdomains
        "localhost",
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
