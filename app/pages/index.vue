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
			<FrontpageFederalFeedback hydrate-on-idle />
			<FrontpageReducedNews hydrate-on-idle />
			<FrontpageLocation hydrate-on-idle />
			<FrontpageRequiredAnnouncements hydrate-on-idle />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
