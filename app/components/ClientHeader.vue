<script lang="ts" setup>
const searchEnabled = useState("search_palette", () => false);
</script>

<template>
    <div class="__header">
        <div class="wrapper">
            <header>
                <NuxtLink to="/" class="left">Logo</NuxtLink>
                <nav>
                    <slot />
                </nav>
                <div class="right flex items-center gap-2">
                    <UButton
                        color="white"
                        variant="ghost"
                        icon="line-md:search-twotone"
                        @click="searchEnabled = true"
                    />
                    <ColorSwitcher />
                </div>
            </header>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.__header {
    --header-height: 80px;
    height: var(--header-height);

    .wrapper {
        @apply flex justify-center z-10;

        height: var(--header-height);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 0.8rem;
        header {
            @apply flex items-center justify-between px-4 w-full h-full;
            @apply rounded-2xl backdrop-blur-xl bg-opacity-20 bg-gray-50;
            @apply dark:bg-gray-800 dark:border-gray-600 dark:border-2 dark:bg-opacity-50;
            max-width: 1200px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
    }
}
</style>
