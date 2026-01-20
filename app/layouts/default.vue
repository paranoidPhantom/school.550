<script lang="ts" setup>
defineShortcuts({
	shift_a: {
		handler: () => navigateTo("/manage"),
	},
});
</script>

<template>
	<div class="__layout-default">
		<FrontpageFederalFeedback />

		<div class="relative">
			<ClientHeader />
			<main class="px-4 pb-4 md:px-8">
				<slot />
			</main>
			<ClientFooter />
			<FeedbackForm />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
