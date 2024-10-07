<script lang="ts" setup>
useHead({
	link: [
		{
			rel: "preload",
			href: "/fonts/akony.ttf",
			as: "font",
			type: "font/ttf",
			crossorigin: "anonymous",
		},
	],
});
</script>

<template>
	<div class="__home">
		<FrontpageHero />
		<div class="space-y-16">
			<FrontpageFederalFeedback />
			<FrontpageReducedNews />
			<FrontpageLocation />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
