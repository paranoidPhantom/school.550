<script lang="ts" setup>
defineShortcuts({
    shift_a: {
        handler: () => navigateTo("/manage"),
    },
});
</script>

<template>
    <main class="__default">
        <slot />
    </main>
</template>

<style lang="scss" scoped></style>
