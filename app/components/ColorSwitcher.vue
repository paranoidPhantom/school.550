<script lang="ts" setup>
const colorMode = useColorMode();

const modes = [
	{
		key: "dark",
		icon: "line-md:sunny-outline-to-moon-alt-loop-transition",
	},
	{
		key: "light",
		icon: "line-md:moon-alt-to-sunny-outline-loop-transition",
	},
];

const currentMode = computed(() => {
	return modes.find((mode) => mode.key === colorMode.preference) || modes[0];
});

const toggleMode = () => {
	let done = false;
	modes.forEach((mode, index) => {
		if (currentMode.value.key === mode.key && !done) {
			done = true;
			colorMode.preference = modes[(index + 1) % modes.length].key;
		}
	});
};
</script>

<template>
	<ClientOnly>
		<UButton
			:key="currentMode.key"
			:icon="currentMode.icon"
			color="white"
			variant="link"
			@click="toggleMode"
		/>
	</ClientOnly>
</template>

<style lang="scss" scoped></style>
