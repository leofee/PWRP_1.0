import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  server: {
    port: 4321,
  },
  devToolbar: {
    enabled: false,
  },
});
