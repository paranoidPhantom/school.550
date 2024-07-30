<script lang="ts" setup>
const isServer = ref(true);

onMounted(() => {
    isServer.value = false;
});
</script>

<template>
    <footer class="w-full mt-4">
        <UDivider class="w-full" />
        <section class="h-40 md:h-64" />
        <UDivider class="w-full">
            <div class="flex items-center gap-4 justify-center">
                <UBadge size="lg" color="gray" class="flex items-center gap-2">
                    <p>Мы в соцсетях</p>
                    <p class="opacity-30">|</p>
                    <UTooltip text="VK">
                        <NuxtLink to="https://vk.com/school_550_spb">
                            <UIcon name="mdi:vk" class="h-5" /> </NuxtLink
                    ></UTooltip>
                    <UTooltip text="Telegram">
                        <NuxtLink to="https://t.me/school550_spb">
                            <UIcon name="mdi:telegram" class="h-5" /> </NuxtLink
                    ></UTooltip>
                </UBadge>
            </div>
        </UDivider>
        <section
            class="h-24 md:h-16 flex items-center px-4 text-gray-400 dark:text-gray-600 pb-3"
        >
            <p>
                &copy; {{ new Date().getFullYear() }} Школа №550. Все права
                защищены. Совпадения не случайны.
            </p>
        </section>
    </footer>
</template>

<style lang="scss" scoped>
footer {
}
</style>
