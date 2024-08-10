<template>
	<div
		class="flex h-[20px] w-[40px] rounded border border-slate-600 text-slate-600 hover:border-slate-900 hover:text-slate-900 max-[600px]:w-[20px]"
	>
		<p class="mx-auto my-auto text-xl">{{ num.num }}</p>
	</div>
</template>

<script setup>
defineProps({
	num: {
		type: Object,
	},
});
</script>

<style></style>
