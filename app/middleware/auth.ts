export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path.startsWith("/manage/auth")) {
        const { user } = useTelegramUser();
        const { data: valid } = await useFetch("/api/auth/validate");

        if (user.value && valid.value) return navigateTo("/manage");
    } else {
        const { user } = useTelegramUser();
        if (!user.value)
            return navigateTo({
                path: "/manage/auth",
                query: { redirect: to.path },
            });
    }
});
