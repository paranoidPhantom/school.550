<script lang="ts" setup>
import type { Article } from "~/types/article";

defineProps<Article>();

const route = useRoute();
</script>

<template>
    <USkeleton
        class="w-full rounded-[2rem]"
        :style="{
            height: customHeight && route.path !== '/' ? customHeight : '24rem',
        }"
    />
</template>

<style lang="scss" scoped></style>
