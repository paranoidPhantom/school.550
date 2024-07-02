// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 80,
        host: "0.0.0.0",
    },
    devtools: { enabled: true },
    modules: [
        "nuxt-aos",
        "@nuxt/ui",
        "@nuxtjs/seo",
        "@nuxt/fonts",
        "@paranoidphantom/tgauth",
    ],
    seo: {
        url: "https://portal.ort.spb.ru",
        name: "Школа №550",
        description: "Оффициальный портал ГБОУ СОШ №550",
        defaultLocale: "ru",
    },
    future: {
        compatibilityVersion: 4,
    },
    runtimeConfig: {
        public: {
            tgbot: process.env.TG_BOT,
        },
    },
});
