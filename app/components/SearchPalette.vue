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
		label: (q: string) => q && `Результаты на запрос «${q}»`,
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
					id: hit.title,
					label: hit.title,
					suffix: hit.description,
					to: `/${hit.slug}`,
				};
			});
		},
	},
];

const router = useRouter();

const onNavigate = (option: { label: string; suffix: string; to: string }) => {
	router.push(option.to);
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
		<LazyUCommandPalette
			:groups="results"
			:autoselect="false"
			placeholder="Поиск..."
			:empty-state="{
				icon: 'i-heroicons-magnifying-glass-20-solid',
				label: 'Ничего не найдено',
				queryLabel: 'Мы не нашли ничего по вашему запросу.',
			}"
			@update:model-value="(option) => onNavigate(option)"
		>
			<template #empty-state>
				<div
					class="flex flex-col items-center justify-center gap-3 py-6"
				>
					<UTooltip text="Поиск реализован на основе Algolia Search">
						<NuxtLink to="https://www.algolia.com/">
							<NuxtImg
								src="/images/algolia.svg"
								alt="Algolia Search"
								width="100px"
							/>
						</NuxtLink>
					</UTooltip>
				</div>
			</template>
		</LazyUCommandPalette>
	</UModal>
</template>

<style lang="scss" scoped></style>
