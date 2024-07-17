<script setup lang="ts">
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

definePageMeta({
    middleware: ["content"],
});

interface ASTData {
    title: string;
    description: string;
}

const {
    meta: { md },
    params: { slug },
} = useRoute();

const { data: ast } = await useAsyncData<{ data: ASTData; body: any }>(
    `md_${slug}`,
    () => parseMarkdown(md)
);

const refreshSeo = () => {
    if (ast.value) {
        useSeoMeta({
            title: ast.value.data.title,
            description:
                ast.value.data.description === ""
                    ? undefined
                    : ast.value.data.description,
        });
    }
};

onMounted(refreshSeo);
watch(ast, refreshSeo);
</script>

<template>
    <div :class="`__dynamic_${slug}`">
        <MarkdownFormatter>
            <MDCRenderer :body="ast.body" :data="ast.data" />
        </MarkdownFormatter>
    </div>
</template>

<style lang="scss" scoped></style>
