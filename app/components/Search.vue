<script lang="ts" setup>
const {
    public: { environment },
} = useRuntimeConfig();
const { search } = useAlgoliaSearch(`pages_${environment}`);

const enabled = useState("search_palette", () => false);

const results = [
    {
        key: "results",
        label: (q) => q && `Результаты "${q}"`,
        search: async (q) => {
            if (!q) {
                return [];
            }

            const { hits } = await search({ query: q });

            return hits.map((hit: Record<string, any>) => ({
                label: hit.title,
                suffix: hit.description,
                to: `/${hit.slug}`,
            }));
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
    <UModal v-model="enabled">
        <UCommandPalette
            @update:model-value="(option) => onNavigate(option.to)"
            :groups="results"
            :autoselect="false"
            placeholder="Поиск..."
            :empty-state="{
                icon: 'i-heroicons-magnifying-glass-20-solid',
                label: 'Ничего не найдено',
                queryLabel: 'Мы не нашли ничего по вашему запросу.',
            }"
        />
    </UModal>
</template>

<style lang="scss" scoped></style>
