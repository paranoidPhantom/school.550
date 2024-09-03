<script lang="ts" setup>
const route = useRoute();
onMounted(async () => {
	if (
		!route.path.startsWith("/manage") ||
		route.path.startsWith("/manage/auth")
	)
		return;
	const valid = await $fetch("/api/auth/validate");

	if (!valid) {
		navigateTo("/manage/auth");
	}
});

useSeoMeta({
	ogImage: "/images/exterior.png",
});

useHead({
	htmlAttrs: {
		lang: "ru",
	},
	link: [
		{
			rel: "icon",
			type: "image/png",
			href: "/favicon.png",
		},
	],
});

const visuallyImpaired = useCookie("visImpairmentMode");
if (visuallyImpaired.value === undefined) visuallyImpaired.value = false;

onMounted(() => {
	document.documentElement.style.filter = visuallyImpaired.value
		? "saturate(0)"
		: "none";
});

watch(visuallyImpaired, (newValue) => {
	document.documentElement.style.filter = newValue ? "saturate(0)" : "none";
});
</script>

<template>
	<div :class="{ 'visually-impaired': visuallyImpaired }">
		<NuxtLoadingIndicator color="rgb(var(--color-primary-500))" />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<SearchPalette />
		<UNotifications />
	</div>
</template>

<style lang="scss">
/* Visually impaired mode */
.visually-impaired {
	img,
	.hero-bg,
	.dashed-circles {
		display: none !important;
	}

	.invert-if-impaired {
		@apply text-black dark:text-white;
	}

	.aos-init {
		transform: translate(0) scale(1) !important;
		transition-property: none !important;
		opacity: 1 !important;
	}
}
</style>
