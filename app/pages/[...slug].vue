<script setup lang="ts">

definePageMeta({
	middleware: ["content"],
});

const {
	params: { slug: rawSlug },
  meta: { ast }
} = useRoute();

const slug = computed(() =>
	Array.isArray(rawSlug) ? `/${rawSlug.join("/")}` : `/${rawSlug}`,
);

const brklinks = computed(() => {
	const links = [
		{ label: "Домашняя", icon: "heroicons:home-20-solid", to: "/" },
	];
	if (slug.value) {
		const category = rawSlug[0];
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
			case "newspaper":
				links.push({
					label: "Школьная газета",
					icon: "fluent-emoji-high-contrast:rolled-up-newspaper",
				} as { label: string; icon: string; to: string });
				break;
			case "news":
				links.push({
					label: "Новости",
          to: "/news",
					icon: "fluent-emoji-high-contrast:rolled-up-newspaper",
				} as { label: string; icon: string; to: string });
				if (slug.value.length === 0) return links;
				break;
		}
	}
	if ((rawslug.length > 1 || links.length == 1) && ast) {
		links.push({
			label: ast.data.title,
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
