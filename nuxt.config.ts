// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    nitro: {
        storage: {
            default: {
                driver: "cloudflare-kv-http",
                accountId: process.env.KV_ACCOUND_ID,
                namespaceId: process.env.KV_NAMESPACE_ID,
                apiToken: process.env.KV_API_TOKEN,
            },
        },
    },
    devServer: {
        port: 80,
        host: "0.0.0.0",
    },
    devtools: { enabled: true },
    image: {
        provider: "vercel",
        formats: ["webp", "avif"],
    },
    monacoEditor: {
        // These are default values:
        locale: "ru",
    },
    mdc: {
        headings: {
            anchorLinks: false,
        },
    },
    cookieControl: {
        locales: ["ru"],
    },
    modules: [
        "nuxt-aos",
        "@nuxt/ui",
        "@nuxtjs/seo",
        "@nuxt/fonts",
        "@paranoidphantom/tgauth",
        "@nuxtjs/mdc",
        "@nuxtjs/algolia",
        "nuxt-monaco-editor",
        "@nuxt/image",
        "@dargmuesli/nuxt-cookie-control",
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
