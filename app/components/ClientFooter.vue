<script lang="ts" setup>
const isServer = ref(true);

onMounted(() => {
    isServer.value = false;
});
</script>

<template>
    <footer class="w-full mt-4">
        <UDivider class="w-full" />
        <section class="h-40 md:h-64"></section>
        <UDivider class="w-full">
            <div class="flex items-center gap-4">
                <UBadge size="lg" color="gray" class="flex items-center gap-2">
                    <p>Наши socials</p>
                    <UTooltip text="VK">
                        <NuxtLink to="https://vk.com/school_550_spb">
                            <UIcon name="mdi:vk" /> </NuxtLink
                    ></UTooltip>
                    <UTooltip text="Telegram">
                        <NuxtLink to="https://t.me/school550_spb">
                            <UIcon name="mdi:telegram" /> </NuxtLink
                    ></UTooltip>
                </UBadge>
                <p>&bull;</p>
                <NuxtLink
                    to="https://github.com/paranoidPhantom/school.550/issues/new"
                >
                    <UBadge
                        size="lg"
                        color="gray"
                        class="flex items-center gap-2"
                    >
                        <p>Создать issue на</p>
                        <UTooltip text="GitHub">
                            <UIcon name="mdi:github" />
                        </UTooltip>
                    </UBadge>
                </NuxtLink>
            </div>
        </UDivider>
        <section
            class="h-24 md:h-16 flex items-center px-4 text-gray-400 dark:text-gray-600 pb-3"
        >
            <p>
                &copy; {{ new Date().getFullYear() }} Школа №550. Все права
                защищены.
            </p>
        </section>
    </footer>
</template>

<style lang="scss" scoped>
footer {
}
</style>
