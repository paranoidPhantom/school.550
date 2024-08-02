<script lang="ts" setup>
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

definePageMeta({
    middleware: ["content"],
});

const { data: md } = await useFetch(`/api/content/news`);

const { data: ast } = await useAsyncData<typeof parseMarkdown>(
    `md_news`,
    () => parseMarkdown(md.value),
    {
        watch: [md],
    }
);
</script>

<template>
    <section v-if="ast" class="__news max-w-[1200px] w-full mx-auto space-y-4">
        <h2 class="text-2xl font-bold">Новости</h2>
        <MarkdownFormatter>
            <MDCRenderer :body="ast.body" :data="ast.data" />
        </MarkdownFormatter>
    </section>
</template>

<style lang="scss" scoped></style>
