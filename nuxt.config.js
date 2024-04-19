import {isProduction} from "std-env";

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
      google_analytics_id: process.env.google_analytics_id,
      production_mode: isProduction,
    },
  },
  useHead: {
    title: "EPH Polska - styropiany, systemy elewacyjne, ocieplenia"
  },
  plugins: [
    '~/plugins/tawkto.client.ts'
  ]
});
