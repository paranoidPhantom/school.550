<script lang="ts" setup>
defineProps<{
	images: string[];
}>();
</script>

<template>
	<UCarousel
		class="overflow-hidden rounded-lg"
		:items="images"
		:ui="{
			item: 'basis-full',
			indicators: {
				active: 'border-2 border-white border-opacity-70 dark:border-black dark:border-opacity-70 bg-black dark:bg-white',
				inactive:
					'border-2 border-black border-opacity-70 dark:border-white dark:border-opacity-70',
				wrapper: 'opacity-70',
			},
		}"
		arrows
		indicators
	>
		<template #default="{ item }">
			<img :src="item" draggable="false" class="mx-auto rounded-lg" />
		</template>
	</UCarousel>
</template>

<style lang="scss" scoped></style>
