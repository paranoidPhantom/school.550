<script lang="ts" setup></script>

<template>
    <div class="__home">
        <div class="hero">
            <img
                src="/images/gradient.png"
                alt="Фон"
                class="absolute top-0 left-0 h-screen object-cover blur-md"
            />
            <img
                src="/images/noise.png"
                class="absolute top-0 left-0 h-screen object-cover opacity-30"
            />
        </div>
        test
    </div>
</template>

<style lang="scss" scoped>
.__home {
    .hero {
        @apply w-full h-screen;
        height: calc(100vh - 80px + 3rem);
    }
}
</style>
