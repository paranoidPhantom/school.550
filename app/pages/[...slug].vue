<script setup lang="ts">
definePageMeta({
	middleware: ["content"],
});

const {
	params: { slug: rawSlug },
} = useRoute();

const slug = computed(() =>
	Array.isArray(rawSlug) ? `/${rawSlug.join("/")}` : `/${rawSlug}`,
);

const supabase = useSupabaseClient();

const { data: ast } = await useAsyncData(`render_${slug.value}`, async () => {
	const { data } = await supabase
		.from("content")
		.select("md")
		.eq("slug", slug.value)
		.maybeSingle();
	if (data) {
		const { md: markdown } = data;
		const tree = await $fetch("/api/parsemd", {
			method: "POST",
			body: {
				markdown,
			},
		});
		return tree;
	}
});

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
	if (slug.value) {
		const category = slug.value[0];
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
				if (slug.value.length === 0) return links;
				break;
		}
	}
	if (slug.value.length > 1 && ast.value) {
		links.push({
			label: ast.value.data.title,
		} as { label: string; icon: string; to: string });
	}

	return links;
});
</script>

<template>
	<div class="mx-auto max-w-[1200px]">
		<div v-if="ast">
			<UBreadcrumb class="mb-4" :links="brklinks" />
			<MarkdownFormatter>
				<MDCRenderer :body="ast.body" :data="ast.data" />
			</MarkdownFormatter>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
