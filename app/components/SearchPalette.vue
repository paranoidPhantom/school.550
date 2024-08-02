<script lang="ts" setup>
import type { SearchResponse } from "@nuxtjs/algolia";

const {
    public: { environment },
} = useRuntimeConfig();
const { search } = useAlgoliaSearch(`pages_${environment}`);

const enabled = useState("search_palette", () => false);

const results = [
    {
        key: "results",
        label: (q: string) => q && `Результаты поиска "${q}"`,
        search: async (q: string) => {
            if (!q) {
                return [];
            }

            const { hits } = (await search({ query: q })) as SearchResponse<{
                title: string;
                description: string;
                slug: string;
                content: string;
            }>;
            return hits.map((hit) => {
                return {
                    label: hit.title,
                    suffix: hit.description,
                    to: `/${hit.slug}`,
                };
            });
        },
    },
];

const router = useRouter();

const onNavigate = (slug: string) => {
    router.push(slug);
    enabled.value = false;
};

defineShortcuts({
    meta_k: { handler: () => (enabled.value = true) },
});
</script>

<template>
    <UModal
        v-model="enabled"
        :ui="{
            container:
                'flex min-h-full items-center justify-center text-center',
        }"
    >
        <UCommandPalette
            :groups="results"
            :autoselect="false"
            placeholder="Поиск..."
            :empty-state="{
                icon: 'i-heroicons-magnifying-glass-20-solid',
                label: 'Ничего не найдено',
                queryLabel: 'Мы не нашли ничего по вашему запросу.',
            }"
            @update:model-value="(option) => onNavigate(option.to)"
        >
            <template #empty-state>
                <div
                    class="flex flex-col items-center justify-center py-6 gap-3"
                >
                    <span class="text-sm flex items-center gap-2"
                        >Поиск реализован на основе
                        <NuxtLink to="https://www.algolia.com/">
                            <UIcon
                                class="text-6xl h-4 bg-cover bg-center"
                                name="devicon:algolia-wordmark"
                            />
                        </NuxtLink>
                    </span>
                </div>
            </template>
        </UCommandPalette>
    </UModal>
</template>

<style lang="scss" scoped></style>
