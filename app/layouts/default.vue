<script lang="ts" setup>
defineShortcuts({
	shift_a: {
		handler: () => navigateTo("/manage"),
	},
});
</script>

<template>
	<div class="__layout-default">
		<ClientHeader />
		<main class="mt-4 px-4 pb-4 md:px-8">
			<slot />
		</main>
		<ClientFooter />
		<FeedbackForm />
	</div>
</template>

<style lang="scss" scoped></style>
