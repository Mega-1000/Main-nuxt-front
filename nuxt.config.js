export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@nuxt/devtools", "nuxt-gtag"],
  gtag: {
    tags: [
      {
        id: 'G-24K8JMGMKW'
      },
      {
        id: 'AW-16473353139'
      }
    ]
  },
  scripts: {
    registry: {
      hotjar: {
        id: '5017434'
      }
    }
  },
  devtools: {
    enabled: true,
    vscode: {}
  },
  runtimeConfig: {
    public: {
      AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
      baseUrl: process.env.APP_STORAGE,
      nuxtNewFront: process.env.NEW_NUXT_SERVER,
      google_analytics_id: process.env.google_analytics_id
    }
  },
  useHead: {
    title: "EPH Polska - styropiany, systemy elewacyjne, ocieplenia"
  }
});
