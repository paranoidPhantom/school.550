<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const route = useRoute();
onMounted(async () => {
    if (
        !route.path.startsWith("/manage") ||
        route.path.startsWith("/manage/auth")
    )
        return;
    const valid = await $fetch("/api/auth/validate");

    if (!valid) {
        navigateTo("/manage/auth");
    }
});
</script>

<template>
    <NuxtLoadingIndicator color="rgb(var(--color-primary-500))" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <Search />
    <UNotifications />
    <SpeedInsights />
</template>
