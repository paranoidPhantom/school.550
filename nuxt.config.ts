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
