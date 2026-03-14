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
		<div class="relative mx-[-2rem] h-screen">
			<FrontpageHero />
		</div>
		<div class="relative space-y-16">
			<FrontpageReducedNews />
			<FrontpageLocation />
			<FrontpageRequiredAnnouncements />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
