// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-27',
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      resend: !!process.env.NUXT_PRIVATE_RESEND_API_KEY,
    },
  },
});
