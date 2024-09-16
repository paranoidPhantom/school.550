<script setup lang="ts">
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const supabase = useSupabaseClient();

const {
	params: { slug },
} = useRoute();

const { data: ast } = await useAsyncData<typeof parseMarkdown>(
	`md_${slug}`,
	async () => {
		const { data } = await supabase
			.from("content")
			.select("md")
			.eq("slug", `/${slug.join("/")}`)
			.maybeSingle();
		if (!data) return null;
		const { md } = data;
		return await parseMarkdown(md);
	},
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

const brklinks = computed(() => {
	const links = [
		{ label: "Домашняя", icon: "heroicons:home-20-solid", to: "/" },
	];
	if (slug) {
		const category = slug[0];
		switch (category) {
			case "info":
				links.push({
					label: "Сведения об ОУ",
					icon: "heroicons:information-circle-20-solid",
				} as any);
				break;
			case "for-parents":
				links.push({
					label: "Родителям",
				} as any);
				break;
			default:
				break;
		}
	}

	links.push({
		label: ast.value?.data.title,
	} as any);

	return links;
});

supabase
	.channel("_slug-changes")
	.on(
		"postgres_changes",
		{ event: "UPDATE", schema: "public", table: "content" },
		(payload: { new: Record<string, string> }) => {
			console.log(payload);
		},
	)
	.subscribe();
</script>

<template>
	<div v-if="ast" :class="`__dynamic_${slug}`" class="mx-auto max-w-[1200px]">
		<UBreadcrumb class="mb-4" :links="brklinks" />
		<MarkdownFormatter>
			<MDCRenderer :body="ast.body" :data="ast.data" />
		</MarkdownFormatter>
	</div>
</template>

<style lang="scss" scoped></style>
