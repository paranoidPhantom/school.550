<script lang="ts" setup>
defineProps<{
	images: string[];
}>();
</script>

<template>
	<UCarousel
		v-slot="{ item }"
		:items="images"
		:ui="{ item: 'basis-full' }"
		class="overflow-hidden rounded-lg"
	>
		<img :src="item" draggable="false" />
	</UCarousel>
</template>

<style lang="scss" scoped></style>
