<script lang="ts" setup></script>

<template>
    <section class="__articles">
        <slot />
    </section>
</template>

<style lang="scss" scoped>
.__articles {
    display: grid;
    // Divide the grid into as many 50px columns as possible
    grid-template-columns: repeat(auto-fill, 50px);
    grid-template-rows: repeat(auto-fill, 50px);

    grid-auto-rows: 100px;

    @apply gap-4 md:gap-8;
}
</style>
