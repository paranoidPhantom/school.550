<script lang="ts" setup>
import type { Article } from "~/types/article";

const props = defineProps<Article>();

const route = useRoute();
</script>

<template>
    <NuxtLink :to="to" class="w-full" data-aos="fade-up">
        <article
            class="flex flex-col gap-2 relative rounded-[2rem] overflow-hidden"
            :style="{
                height:
                    props['customHeight'] && route.path !== '/'
                        ? props['customHeight']
                        : '24rem',
            }"
        >
            <USkeleton class="absolute inset-0 w-full h-full" />
            <img
                :src="image"
                :alt="title"
                class="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div class="flex flex-col justify-between absolute inset-3 z-10">
                <div class="flex justify-between gap-8">
                    <p
                        class="surface px-6 py-3 rounded-full bg-white bg-opacity-25 backdrop-blur-md text-white border-white border border-opacity-30"
                    >
                        {{ date }}
                    </p>
                    <div
                        class="surface rounded-full bg-white w-auto h-full aspect-1 flex items-center justify-center"
                    >
                        <UIcon
                            class="text-black text-3xl shadow shadow-black"
                            name="material-symbols-light:arrow-outward-rounded"
                        />
                    </div>
                </div>
                <h3
                    class="surface px-6 py-3 rounded-[2rem] bg-white bg-opacity-25 backdrop-blur-md text-white border-white border border-opacity-30"
                >
                    {{ title }}
                </h3>
            </div>
        </article>
    </NuxtLink>
</template>

<style lang="scss" scoped>
article {
    .surface {
        background-image: url(/images/noise.png);
        background-repeat: no-repeat;
        background-size: 300% 300%;
        background-position: center;
    }
}
</style>
