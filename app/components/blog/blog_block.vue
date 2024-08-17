<template>
	<div class="w-[378px] max-[1670px]:w-[448px] max-[500px]:w-[300px]">
		<div class="relative">
			<NuxtImg src="/images/hand.svg" class="max-[1670px]:w-[448px]" />
			<div
				class="absolute left-[50%] top-4 flex -translate-x-1/2 space-x-4 rounded-3xl bg-white p-2"
			>
				<NuxtImg src="/images/kalendar_ison.svg" />
				<p>05.12.2023</p>
			</div>
			<div
				class="absolute bottom-2 left-[50%] flex -translate-x-1/2 place-items-center rounded-3xl bg-white p-2"
			>
				<NuxtImg src="/images/author_photo.svg" />
				<p>{{ name.second_name }}</p>
			</div>
		</div>

		<p class="text-wrap text-2xl font-bold">
			Заголовок статьи может быть и две строки
		</p>
		<p class="mt-2">
			Маленькое описание, я считаю, что оно должно занимать не больше трёх
			строк, а то как-то много получается не правда ли?
		</p>
		<div
			class="mt-3 grid place-items-center rounded-3xl border-2 border-black p-2"
		>
			<p class="text-xl font-bold">Читать</p>
		</div>
	</div>
</template>
<script setup>
defineProps({
	name: Object,
});
</script>

<style></style>
