import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // чтобы принимать внешний трафик
    allowedHosts: [
      "398fhy-95-24-95-140.ru.tuna.am", // твой хост от Tuna
    ],
  },
});
