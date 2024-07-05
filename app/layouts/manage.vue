<script lang="ts" setup></script>

<template>
    <main class="__manage">
        <header
            class="fixed top-0 left-1/2 -translate-x-1/2 z-10 m-2 px-2 backdrop-blur-lg rounded-3xl border border-gray-200 dark:border-gray-800"
        >
            <ColorSwitcher />
        </header>
        <slot />
    </main>
</template>

<style lang="scss" scoped></style>
