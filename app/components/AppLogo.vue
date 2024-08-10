<script lang="ts" setup>
const route = useRoute();
</script>

<template>
	<NuxtLink :to="route.path === '/' ? '/logo' : '/'">
		<UIcon name="fluent:draw-image-24-regular" class="text-2xl" />
	</NuxtLink>
</template>

<style lang="scss" scoped></style>
