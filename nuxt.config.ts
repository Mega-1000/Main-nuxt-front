// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-module-hotjar"],
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
