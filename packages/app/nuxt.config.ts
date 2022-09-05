import { defineNuxtConfig } from "nuxt";
import BaseTSConfig from "./tsconfig.nuxt.json";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },

  css: [
    "@/assets/scss/main.scss",
    "vuetify/lib/styles/main.sass",
    "mdi/css/materialdesignicons.min.css",
  ],

  modules: ["@pinia/nuxt"],

  ssr: false,

  components: {
    dirs: [
      "~/components",
      {
        path: "~/components",
        extensions: ["vue"],
      },
    ],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;',
        },
      },
    },
    define: {
      "process.env.DEBUG": false,
    },
  },

  typescript: {
    shim: true,
    strict: true,
    tsConfig: BaseTSConfig,
    typeCheck: true,
  },
});
