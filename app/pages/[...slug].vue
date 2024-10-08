<script setup lang="ts">
definePageMeta({
	middleware: ["content"],
});

const {
	params: { slug },
	meta: { ast },
} = useRoute() as any;

const refreshSeo = () => {
	if (ast) {
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
				return links;
			default:
				break;
		}
	}

	links.push({
		label: ast.value?.data.title,
	} as any);

	return links;
});
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
