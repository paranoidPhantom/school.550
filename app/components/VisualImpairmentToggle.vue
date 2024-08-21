<script lang="ts" setup>
const visuallyImpaired = useCookie("visImpairmentMode");
const visuallyImpairedToggleEnabled = ref(true);

const toggleVisuallyImpaired = () => {
	visuallyImpaired.value = !visuallyImpaired.value;
	visuallyImpairedToggleEnabled.value = false;

	setTimeout(() => (visuallyImpairedToggleEnabled.value = true), 1000);
};
</script>

<template>
	<UButton
		variant="solid"
		color="gray"
		icon="material-symbols:accessibility"
		label="Версия для слабовидящих"
		:disabled="!visuallyImpairedToggleEnabled"
		@click="toggleVisuallyImpaired"
	/>
</template>

<style lang="scss" scoped></style>
