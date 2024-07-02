export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user } = useTelegramUser();
    if (!user.value) return navigateTo("/manage/auth");
    const { data: valid } = await useFetch("/api/auth/validate");
    if (!valid.value) return navigateTo("/manage/auth");
});
