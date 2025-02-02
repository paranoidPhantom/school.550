<script setup lang="ts">
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const {
	params: { slug },
} = useRoute();

const supabase = useSupabaseClient();

const { data: ast } = await useAsyncData(
	`${slug.join("/")}_md_parse`,
	async () => {
		const { data } = await supabase
			.from("content")
			.select("md")
			.eq("slug", `/${slug.join("/")}`)
			.maybeSingle();
		if (data) {
			const { md } = data;
			const ast = await parseMarkdown(md);
			return ast;
		}
		return null;
	},
);

const refreshSeo = () => {
	if (ast && ast.data) {
		useSeoMeta({
			title: ast.data.title,
			description:
				ast.data.description === "" ? undefined : ast.data.description,
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
				} as { label: string; icon: string; to: string });
				break;
			case "for-parents":
				links.push({
					label: "Родителям",
				} as { label: string; icon: string; to: string });
				break;
			case "news":
				links.push({
					label: "Новости",
					icon: "fluent-emoji-high-contrast:rolled-up-newspaper",
				} as { label: string; icon: string; to: string });
				if (slug.length === 0) return links;
				break;
		}
	}
	if (slug.length > 1 && ast.value) {
		links.push({
			label: ast.value.data.title,
		} as { label: string; icon: string; to: string });
	}

	return links;
});
</script>

<template>
	<div :class="`__dynamic_${slug}`" class="mx-auto max-w-[1200px]">
		<div v-if="ast">
			<UBreadcrumb class="mb-4" :links="brklinks" />
			<MarkdownFormatter>
				<MDCRenderer :body="ast.body" :data="ast.data" />
			</MarkdownFormatter>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
