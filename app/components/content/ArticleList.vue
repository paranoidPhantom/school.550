<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { Article } from "~/app/types/article";

const props = defineProps<{
	articles: (Article & { globalIndex: number })[];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);

const shown = computed(() => {
	if (breakpoints["xl"].value || import.meta.server) return 4;
	if (breakpoints["lg"].value) return 3;
	if (breakpoints["md"].value) return 2;
	return 1;
});

const route = useRoute();

const articleRows = computed(() => {
	const arrayOfArrays: (Article & { globalIndex: number })[][] = new Array(
		shown.value,
	);
	props.articles.forEach((article, index) => {
		if (route.path === "/" && index >= shown.value) return;
		if (!arrayOfArrays[index % shown.value]) {
			arrayOfArrays[index % shown.value] = [];
		}
		(
			arrayOfArrays[index % shown.value] as (Article & {
				globalIndex: number;
			})[]
		).push({
			...article,
			globalIndex: index,
		});
	});
	return arrayOfArrays;
});

const entryStaggerMs = 50;
</script>

<template>
	<section class="__articles w-full">
		<div class="flex">
			<ArticleCard
				v-for="article in articleRows[0]"
				:key="article.title"
				v-bind="article"
				:data-aos-delay="article.globalIndex * entryStaggerMs"
			/>
		</div>
		<div class="hidden md:flex">
			<ArticleCard
				v-for="article in articleRows[1]"
				:key="article.title"
				v-bind="article"
				:data-aos-delay="article.globalIndex * entryStaggerMs"
			/>
		</div>
		<div class="hidden lg:flex">
			<ArticleCard
				v-for="article in articleRows[2]"
				:key="article.title"
				v-bind="article"
				:data-aos-delay="article.globalIndex * entryStaggerMs"
			/>
		</div>
		<div class="hidden xl:flex">
			<ArticleCard
				v-for="article in articleRows[3]"
				:key="article.title"
				v-bind="article"
				:data-aos-delay="article.globalIndex * entryStaggerMs"
			/>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.__articles {
	@apply flex justify-center gap-4;
	> div {
		@apply w-full max-w-96 md:w-1/2 lg:w-1/3 xl:w-1/4;
		@apply flex-col items-center gap-4 p-2;
	}
}
</style>
