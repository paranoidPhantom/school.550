<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";

const sectionActive = useCookie("admin_section_content");

const pageSlugCookie = useCookie("editing_page_slug");

const toast = useToast();

const loading = ref(false);

const state = reactive<{
    slug: string;
    open: boolean;
    md: string;
}>({ slug: pageSlugCookie.value ?? "", md: "", open: true });

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
        const md = (await $fetch(`/api/content${state.slug}`)) as string;
        loading.value = false;
        return (
            md ||
            "---\ntitle: Название Страницы\ndescription: Описание Страницы\n---\n # Странца пока что пуста, но это легко исправить.\n\n[Ресурсы для редакторов](/manage/learn)"
        );
    }
}, null);

watch(fetchedMD, (md) => {
    if (md && state.slug) {
        pageSlugCookie.value = state.slug;
        return (state.md = md);
    }
});

const gotSomeMD = computed(() => fetchedMD.value || fetchedMD.value === "");

const newPageSlug = ref("");

const createNewPage = async () => {
    if (newPageSlug.value === state.slug) return;
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
    state.slug = slug;
};

const savePage = async () => {
    if (state.md === fetchedMD.value) return;
    const slug = state.slug;
    if (!slug || !slug.startsWith("/")) return;
    loading.value = true;

    const ast = await parseMarkdown(state.md);
    const { title, description } = ast.data;

    await $fetch(`/api/content${slug}`, {
        method: "PUT",
        body: { title, description, md: state.md },
    });
    loading.value = false;
    mdRefresher.value++;
};

const statusAnim = computed(() => {
    if (newPageSlug.value && newPageSlug.value !== state.slug) {
        return {
            value: null,
            animation: "swing",
        };
    }
    if (fetchedMD.value !== state.md) {
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

const promptDelete = async () => {
    if (!gotSomeMD.value) return;
    toast.add({
        title: "Удалить страницу",
        description: "Вы уверены, что хотите удалить страницу?",
        color: "red",
        actions: [
            {
                label: "Удалить",
                color: "red",
                click: async () => {
                    await $fetch(`/api/content${state.slug}`, {
                        method: "DELETE",
                    });
                    await $fetch(`/api/content`, {
                        body: {
                            firefoslug: state.slug,
                        },
                        method: "DELETE",
                    });
                    await refreshContent();
                    toast.add({
                        title: "Страница удалена",
                        description: "Страница удалена из базы данных",
                    });
                },
            },
        ],
    });
};

const colorMode = useColorMode();
</script>

<template>
    <div class="flex flex-col gap-4">
        <UAlert
            title="Редактор контента "
            :color="useKeyToColor('edit_content')"
            variant="soft"
            icon="line-md:document-code-twotone"
            :class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
            @click="sectionActive = sectionActive ? '' : 'true'"
        />
        <template v-if="sectionActive">
            <UProgress
                size="sm"
                class="transition-opacity"
                :style="{ opacity: statusAnim.value === 0 ? 0 : 1 }"
                :animation="statusAnim.animation"
                :value="statusAnim.value"
            />
            <div>
                <UButtonGroup class="w-full">
                    <UInputMenu
                        v-model="state.slug"
                        v-model:query="newPageSlug"
                        class="w-full"
                        :options="content"
                        value-attribute="label"
                        placeholder="URL страницы"
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
                        v-show="newPageSlug !== state.slug"
                        color="gray"
                        icon="line-md:plus"
                        @click="createNewPage"
                    />
                    <UButton
                        v-show="gotSomeMD"
                        color="gray"
                        icon="material-symbols:eye-tracking-outline-rounded"
                        :to="state.slug"
                        target="_blank"
                    />
                    <UButton
                        color="gray"
                        icon="akar-icons:save"
                        :disabled="fetchedMD === state.md || !gotSomeMD"
                        @click="savePage"
                    />
                    <UButton
                        color="red"
                        icon="material-symbols:delete-outline"
                        :disabled="!gotSomeMD"
                        @click="promptDelete"
                    />
                </UButtonGroup>
            </div>
            <div v-if="gotSomeMD" class="flex flex-wrap">
                <ClientOnly>
                    <div
                        class="w-full xl:!w-1/2 rounded-t-xl xl:rounded-l-xl xl:rounded-r-none"
                    >
                        <MonacoEditor
                            v-model="state.md"
                            lang="markdown"
                            class="h-full"
                            :options="{
                                theme:
                                    colorMode.value === 'dark'
                                        ? 'vs-dark'
                                        : 'vs',
                            }"
                        />
                    </div>
                    <MarkdownFormatter
                        class="border border-gray-200 dark:border-gray-800 w-full xl:w-1/2 rounded-b-xl xl:rounded-r-xl xl:rounded-l-none px-4 min-h-96"
                    >
                        <MDC v-if="state.md" class="mt-4" :value="state.md" />
                    </MarkdownFormatter>
                </ClientOnly>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped></style>
