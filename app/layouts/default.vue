<script lang="ts" setup>
defineShortcuts({
    shift_a: {
        handler: () => navigateTo("/manage"),
    },
});

useSeoMeta({
    ogImage: "/images/exterior.png",
});

useHead({
    htmlAttrs: {
        lang: "ru",
    },
    link: [
        {
            rel: "icon",
            type: "image/png",
            href: "/favicon.png",
        },
    ],
});
</script>

<template>
    <div class="__layout-default pb-32">
        <ClientHeader />
        <main class="px-4 mt-4 md:px-8 pb-4">
            <slot />
        </main>
        <ClientFooter />
        <Feedback />
    </div>
</template>

<style lang="scss" scoped></style>
