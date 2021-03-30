import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    target: "chrome79",
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    },
  },
  server: {
    port: 3001,
  },
});
