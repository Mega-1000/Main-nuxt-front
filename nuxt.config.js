import fs from "fs";
import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@nuxt/devtools"],
  devtools: {
    enabled: true,
    vscode: {},
  },
  vite: {
    server: {
      hmr: {
        protocol: 'none',
      },
    },
  },
  runtimeConfig: {
    public: {
      AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
      baseUrl: process.env.APP_STORAGE,
      nuxtNewFront: process.env.NEW_NUXT_SERVER,
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH)),
    }
  }
});
