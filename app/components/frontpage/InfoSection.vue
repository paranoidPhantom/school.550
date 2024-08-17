<script lang="ts" setup>
const feedbackForm = useState("feedback_form_enabled", () => false);

const info = ["engineering"];

const carouselRef = ref();

onMounted(() => {
	setInterval(() => {
		if (!carouselRef.value) return;

		if (carouselRef.value.page === carouselRef.value.pages) {
			return carouselRef.value.select(0);
		}

		carouselRef.value.next();
	}, 3000);
});
</script>

<template>
	<UCarousel
		ref="carouselRef"
		v-slot="{ item }"
		:items="info"
		:ui="{ item: 'basis-full' }"
		class="overflow-hidden rounded-2xl"
	>
		<template v-if="item === 'engineering'">
			
		</template>
	</UCarousel>
</template>

<style lang="scss" scoped></style>
