<script lang="ts" setup>
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { Database } from "~~/supabase/types";

const supabase = useSupabaseClient<Database>();

const enabled = useState("search_palette", () => false);

const results = [
	{
		key: "results",
		label: (q: string) => q && `Результаты по запросу «${q}»`,
		search: async (q: string) => {
			if (!q) {
				return [];
			}

			const keywords = q.split(" ");

			const { data: hits, error } = await supabase
				.from("content")
				.select()
				.textSearch(
					"md",
					keywords.map((keyword) => `'${keyword}'`).join(" | "),
				);

			if (error) {
				console.error("FTS Error:", error);
				return [];
			}

			const results = await Promise.all(
				hits.map(async (hit) => {
					const { data: astData } = await parseMarkdown(hit.md);

					return {
						id: hit.id,
						label: astData.title,
						suffix: astData.description || hit.slug,
						to: hit.slug,
					};
				}),
			);
			return results;
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
