import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/telegram-fifteen/", // имя репозитория на GitHub
  plugins: [react()],
  server: {
    host: true, // принимать внешний трафик (для Tuna/ngrok)
    allowedHosts: [
      "398fhy-95-24-95-140.ru.tuna.am", // твой хост от Tuna
    ],
  },
});
