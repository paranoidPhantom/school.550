<script lang="ts" setup>
defineProps<{
	images: string[];
}>();
</script>

<template>
	<UCarousel
		v-slot="{ item }"
		class="overflow-hidden rounded-lg"
		:items="images"
		:ui="{
			item: 'basis-full',
			indicators: {
				active: 'bg-black dark:bg-white',
				inactive:
					'border border-black border-opacity-70 dark:border-white dark:opacity-70',
				wrapper: 'opacity-70',
			},
		}"
		indicators
	>
		<img :src="item" draggable="false" />
	</UCarousel>
</template>

<style lang="scss" scoped></style>
