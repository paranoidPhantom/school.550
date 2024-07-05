<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { config } from "md-editor-v3";
import RU from "@vavt/cm-extension/dist/locale/ru";
import "md-editor-v3/lib/style.css";

const editContentState = reactive<{
    slug: string;
    open: boolean;
    md: string;
}>({ slug: "", md: "", open: true });

const colorMode = useColorMode();
config({
    editorConfig: {
        languageUserDefined: {
            ru: RU,
        },
    },
});

const { data: content } = await useFetch("/api/content", {
    transform: (data) =>
        data.map((item) => ({
            label: item.slug,
        })),
});

const fetchedMD = computedAsync(async () => {
    const md = (await $fetch(`/api/content${editContentState.slug}`)) as string;
    return md;
});

watch(fetchedMD, (md) => (editContentState.md = md));
</script>

<template>
    <UAlert
        title="Редактор контента "
        :color="useKeyToColor('edit_content')"
        variant="soft"
        icon="line-md:document-code-twotone"
    />
    <div>
        <UButtonGroup class="w-full">
            <UInputMenu
                class="w-full"
                :options="[...content, { label: '/test/content' }]"
                value-attribute="label"
                v-model="editContentState.slug"
            />
            <UButton color="gray" icon="line-md:watch" />
            <UButton color="gray" icon="akar-icons:save" />
        </UButtonGroup>
    </div>
    <div class="flex flex-wrap">
        <ClientOnly>
            <MDEditor
                v-model="editContentState.md"
                :class="{
                    'md-editor-dark': colorMode.value === 'dark',
                }"
                class="w-full xl:!w-1/2 rounded-t-xl xl:rounded-l-xl xl:rounded-r-none"
                language="ru"
                codeTheme="github"
                previewTheme="github"
                editorId="md-editor-manage"
                :onUploadImg="async () => 'url'"
                :toolbars="[
                    'bold',
                    'underline',
                    'italic',
                    '-',
                    'title',
                    'strikeThrough',
                    'sub',
                    'sup',
                    'quote',
                    'unorderedList',
                    'orderedList',
                    'task',
                    '-',
                    'link',
                    'image',
                    'table',
                    '-',
                    'revoke',
                    'next',
                ]"
                :preview="false"
                style="--md-bk-color: var(--color-gray-900)"
            />
            <MarkdownFormatter
                class="border border-gray-200 dark:border-gray-800 w-full xl:w-1/2 rounded-b-xl xl:rounded-r-xl xl:rounded-l-none px-4 min-h-96"
            >
                <MDC
                    v-if="editContentState.md"
                    class="mt-4"
                    :value="editContentState.md"
                />
            </MarkdownFormatter>
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped></style>
