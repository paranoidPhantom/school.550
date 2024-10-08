<script lang="ts" setup>
const colorMode = useColorMode();
</script>

<template>
	<NuxtLink to="/" aria-label="Перейти на главную" class="home-btn">
		<NuxtImg
			style="filter: invert(calc(1 - var(--is-dark)))"
			src="/logo.png"
			width="60px"
		/>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.home-btn {
	@apply transition-all duration-1000;
	&:active {
		@apply scale-95 transition-all duration-200;
	}
}
</style>
