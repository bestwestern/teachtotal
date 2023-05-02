import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
//import compress from "vite-plugin-compress";
import { registerRoute } from "workbox-routing";
export default defineConfig({
  plugins: [
    //  compress.default({ exclude: ["**.svg"] }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // runtimeCaching: [
        //   {
        //     handler: "CacheFirst",
        //     urlPattern: /\/assets\/.*\/*.svg/,
        //     method: "GET",
        //   },
        //   {
        //     handler: "CacheFirst",
        //     urlPattern: /\/imgs\/.*\/*.*/,
        //     method: "GET",
        //   },
        // ],
      },
    }),
    preact(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
