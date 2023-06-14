import fs from "fs";
import path from "path";
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@nuxt/devtools"],
  devtools: {
    enabled: true,
    vscode: {},
  },
  runtimeConfig: {
    public: {
      AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
      baseUrl: process.env.APP_STORAGE,
      nuxtNewFront: process.env.NEW_NUXT_SERVER,
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
});
