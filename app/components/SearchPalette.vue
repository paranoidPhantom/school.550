<script lang="ts" setup>
const enabled = useState("search_palette", () => false);

const results = [
	{
		key: "results",
		label: (q: string) => q && `Результаты на запрос «${q}»`,
		search: async (q: string) => {
			if (!q) {
				return [];
			}
			return [];

			// const { hits } = (await search({ query: q })) as SearchResponse<{
			// 	title: string;
			// 	description: string;
			// 	slug: string;
			// 	content: string;
			// }>;
			// return hits.map((hit) => {
			// 	return {
			// 		id: hit.title,
			// 		label: hit.title,
			// 		suffix: hit.description,
			// 		to: `/${hit.slug}`,
			// 	};
			// });
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
			@update:model-value="(option) => onNavigate(option)"
		>
			<template #empty-state> <div /></template>
		</LazyUCommandPalette>
	</UModal>
</template>

<style lang="scss" scoped></style>
