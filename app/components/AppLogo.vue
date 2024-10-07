<script lang="ts" setup></script>

<template>
	<NuxtLink to="/" aria-label="Перейти на главную" class="home-btn">
		<NuxtImg src="/logo.png" width="60px" />
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
