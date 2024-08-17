<template>
	<div class="flex h-[90px] w-[245px] space-x-[5px] rounded-xl bg-slate-100">
		<NuxtImg src="/images/author_photo.svg" />
		<div class="my-auto flex flex-col space-y-[1px]">
			<p>{{ name.second_name }}</p>
			<p>{{ name.first_name }}</p>
			<p>{{ name.third_name }}</p>
		</div>
	</div>
</template>

<script setup>
defineProps({
	name: Object,
});
</script>

<style></style>
