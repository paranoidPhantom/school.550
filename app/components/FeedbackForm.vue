<script setup lang="ts">
const feedbackForm = useState("feedback_form_enabled", () => false);

let msgListener: EventListener | undefined = undefined;
onMounted(() => {
	if (msgListener) {
		return;
	}
	msgListener = window.addEventListener(
		"message",
		function (event) {
			if (event.data.close) {
				feedbackForm.value = false;
			}
		},
		false,
	);
});

const spinner = ref(true);
const hideSpinner = () => (spinner.value = false);
</script>

<template>
	<UModal v-model="feedbackForm">
		<UCard
			:ui="{
				base: 'overflow-hidden',
				body: { base: 'h-[600px] bg-white', padding: '!p-0' },
			}"
		>
			<UIcon
				v-if="spinner"
				class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-6xl text-gray-900"
				name="svg-spinners:6-dots-rotate"
			/>

			<iframe
				ref="iframe"
				class="h-full w-full"
				src="https://pos.gosuslugi.ru/form/?opaId=268828&fz59=false"
				frameborder="0"
				@load="hideSpinner"
			/>
		</UCard>
	</UModal>
</template>

<style scoped lang="scss"></style>
