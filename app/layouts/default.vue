<script lang="ts" setup>
defineShortcuts({
    shift_a: {
        handler: () => navigateTo("/manage"),
    },
});
</script>

<template>
    <div class="__layout-default">
        <ClientHeader />
        <main class="px-4 mt-4 md:px-8">
            <slot />
        </main>
        <Feedback />
    </div>
</template>

<style lang="scss" scoped></style>
