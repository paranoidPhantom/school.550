<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { config } from "md-editor-v3";
import RU from "@vavt/cm-extension/dist/locale/ru";
import "md-editor-v3/lib/style.css";

const pageSlugCookie = useCookie("editing_page_slug");

const loading = ref(false);

const editContentState = reactive<{
    slug: string;
    open: boolean;
    md: string;
}>({ slug: pageSlugCookie.value ?? "", md: "", open: true });

const colorMode = useColorMode();

onMounted(() => {
    config({
        editorConfig: {
            languageUserDefined: {
                ru: RU,
            },
        },
    });
});

const { data: content, refresh: refreshContent } = await useFetch(
    "/api/content",
    {
        transform: (data) =>
            data.map((item) => ({
                label: item.slug,
            })),
    }
);

const mdRefresher = ref(1);
const fetchedMD = computedAsync(async () => {
    if (mdRefresher.value) {
        loading.value = true;
        const md = (await $fetch(
            `/api/content${editContentState.slug}`
        )) as string;
        loading.value = false;
        return (
            md ||
            "> Страница пуста (она не будет отображаться для пользователей)"
        );
    }
}, null);

watch(fetchedMD, (md) => {
    if (md && editContentState.slug) {
        pageSlugCookie.value = editContentState.slug;
        return (editContentState.md = md);
    }
});

const gotSomeMD = computed(() => fetchedMD.value || fetchedMD.value === "");

const newPageSlug = ref("");

const createNewPage = async () => {
    if (newPageSlug.value === editContentState.slug) return;
    const slug = newPageSlug.value;
    if (!slug || !slug.startsWith("/")) return;
    loading.value = true;
    await $fetch(`/api/content`, {
        method: "POST",
        body: {
            slug: slug,
        },
    });
    await refreshContent();
    loading.value = false;
    editContentState.slug = slug;
};

const savePage = async () => {
    if (editContentState.md === fetchedMD.value) return;
    const slug = editContentState.slug;
    if (!slug || !slug.startsWith("/")) return;
    loading.value = true;

    const ast = await parseMarkdown(editContentState.md);
    const { title, description } = ast.data;

    await $fetch(`/api/content${slug}`, {
        method: "PUT",
        body: { title, description, md: editContentState.md },
    });
    loading.value = false;
    mdRefresher.value++;
};

const statusAnim = computed(() => {
    if (newPageSlug.value && newPageSlug.value !== editContentState.slug) {
        return {
            value: null,
            animation: "swing",
        };
    }
    if (fetchedMD.value !== editContentState.md) {
        return {
            value: null,
            animation: "elastic",
        };
    }
    return {
        value: 0,
        animation: "",
    };
});

defineShortcuts({
    meta_s: { handler: savePage, usingInput: true },
    enter: {
        handler: createNewPage,
        usingInput: "content-slug",
    },
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <UAlert
            title="Редактор контента "
            :color="useKeyToColor('edit_content')"
            variant="soft"
            icon="line-md:document-code-twotone"
        />
        <UProgress
            size="sm"
            class="transition-opacity"
            :style="{ opacity: statusAnim.value === 0 ? 0 : 1 }"
            :animation="statusAnim.animation"
            :value="statusAnim.value"
        />
        <UModal prevent-close v-model="loading">
            <div
                class="py-8 flex items-center justify-center flex-col gap-2 w-full"
            >
                <UIcon name="svg-spinners:ring-resize" class="text-4xl" />
                <h3 class="text-lg font-semibold">Обработка запроса</h3>
            </div>
        </UModal>
        <div>
            <UButtonGroup class="w-full">
                <UInputMenu
                    class="w-full"
                    :options="content"
                    value-attribute="label"
                    placeholder="URL страницы"
                    v-model="editContentState.slug"
                    v-model:query="newPageSlug"
                    name="content-slug"
                >
                    <template #option-empty="{ query }">
                        Страница с URL <q>{{ query }}</q> не существует
                    </template>
                    <template #empty>
                        Пока что не создано ни одной страницы
                    </template>
                </UInputMenu>

                <UButton
                    color="gray"
                    icon="line-md:plus"
                    v-show="newPageSlug !== editContentState.slug"
                    @click="createNewPage"
                />
                <UButton
                    color="gray"
                    icon="material-symbols:eye-tracking-outline-rounded"
                    v-show="gotSomeMD"
                    :to="editContentState.slug"
                    target="_blank"
                />
                <UButton
                    color="gray"
                    icon="akar-icons:save"
                    @click="savePage"
                    :disabled="fetchedMD === editContentState.md || !gotSomeMD"
                />
            </UButtonGroup>
        </div>
        <div class="flex flex-wrap" v-if="gotSomeMD">
            <ClientOnly>
                <MDEditor
                    v-if="typeof editContentState.md === 'string'"
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
    </div>
</template>

<style lang="scss" scoped></style>
