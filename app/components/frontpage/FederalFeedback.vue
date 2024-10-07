<script lang="ts" setup>
const feedbackForm = useState("feedback_form_enabled", () => false);
</script>

<template>
	<UAlert
		id="content"
		class="mx-auto w-full max-w-[1200px] space-y-4"
		data-aos="fade-right"
		color="blue"
		variant="subtle"
	>
		<template #title>
			<NuxtImg
				src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
				class="my-4 opacity-80 dark:brightness-150 dark:contrast-125"
				width="150px"
			/>
		</template>
		<template #description>
			<div class="flex flex-col gap-4">
				<p class="text-sm sm:w-3/4">
					Есть предложения по организации учебного процесса или
					знаете, как сделать школу лучше?
				</p>
				<UButton
					class="w-fit"
					icon="line-md:bell-twotone-alert-loop"
					@click="feedbackForm = true"
					>Сообщить о проблеме</UButton
				>
			</div>
		</template>
	</UAlert>
</template>

<style lang="scss" scoped></style>
