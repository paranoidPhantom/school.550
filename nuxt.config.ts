// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    supabase: {
        redirectOptions: {
            login: "/manage/auth",
            callback: "/manage/confirm",
            include: ["/manage*"],
            cookieRedirect: true,
        },
    },
});
