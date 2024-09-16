<script lang="ts" setup>
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const ast = undefined;
</script>

<template>
	<section v-if="ast" class="__news mx-auto w-full max-w-[1200px] space-y-4">
		<div class="flex justify-between">
			<h2 class="text-2xl font-bold">Новости</h2>
			<UButton
				label="Все новости"
				to="/news"
				trailing-icon="mdi:arrow-right"
				variant="link"
			/>
		</div>
		<MarkdownFormatter>
			<MDCRenderer :body="ast.body" :data="ast.data" />
		</MarkdownFormatter>
	</section>
</template>

<style lang="scss" scoped></style>
