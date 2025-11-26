import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-26',
  ssr: true,
  devtools: { enabled: false },
  experimental: {
    appManifest: true,
  },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/app.css',
    '~/assets/css/fonts.css',
    'leaflet/dist/leaflet.css',
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://miyangroup.com/api',
      siteDomain: process.env.NUXT_PUBLIC_SITE_DOMAIN || 'https://miyangroup.com',
    },
  },
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      title: 'Miyan Group',
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      meta: [
        { name: 'description', content: 'Miyan Group cafés and roastery' },
      ],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
