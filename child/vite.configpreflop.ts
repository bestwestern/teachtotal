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
        runtimeCaching: [
          {
            handler: "CacheFirst",
            urlPattern: /\/assets\/.*\/*.svg/,
            method: "GET",
          },
          {
            handler: "CacheFirst",
            urlPattern: /\/imgs\/.*\/*.*/,
            method: "GET",
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Preflop",
        short_name: "Preflop",
        description: "Udenadslære",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    preact(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
