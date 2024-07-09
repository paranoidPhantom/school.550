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
        "@nuxtjs/mdc",
        "@nuxtjs/algolia",
    ],
    routeRules: {
        "/manage/**": { robots: false },
    },
    sitemap: {
        sources: ["/api/sitemap/content"],
    },
    app: {
        layoutTransition: { name: "layout", mode: "out-in" },
        pageTransition: { name: "page", mode: "out-in" },
    },
    algolia: {
        instantSearch: {
            theme: "algolia",
        },
    },
    css: ["@/assets/style.scss"],
    site: {
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
            environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
        },
    },
});
