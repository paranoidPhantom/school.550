<script lang="ts" setup>
// to='' is also required for the link to work
defineProps<{
    title: string;
    image: string;
    date: string;
    posx: number;
    posy: number;
    sizex: number;
    sizey: number;
}>();
</script>

<template>
    <NuxtLink
        class="article"
        :style="{
            gridRow: posy ? `${posy} / ${posy + sizey}` : `span ${sizey}`,
            gridColumn: posx ? `${posx} / ${posx + sizex}` : `span ${sizex}`,
        }"
    >
        <article>
            <img :src="image" :alt="title" class="w-full h-full" />
        </article>
    </NuxtLink>
</template>

<style lang="scss" scoped>
.article {
    > article {
        @apply w-full h-full;
        > img {
            @apply object-cover;
        }
    }
}
</style>
