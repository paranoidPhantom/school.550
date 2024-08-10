<script lang="ts" setup>
definePageMeta({
	title: "Ресурсы для редакторов",
	layout: "manage",
	middleware: ["auth"],
});
const ytVids: {
	title: string;
	url: string;
}[] = [
	{
		title: "Ресурсы для редакторов сайта - Часть 1 - Авторизация",
		url: "https://youtube.com/watch?v=aWsS0d7xpB4",
	},
];
const ytID = ({ url }: (typeof ytVids)[number]) =>
	(url.split("v=")[1] as string).split("?")[0];
</script>

<template>
	<div class="__learn flex flex-col gap-4 p-4">
		<h1 class="text-2xl font-semibold">Ресурсы</h1>
		<hr class="opacity-10" />
		<div class="flex flex-wrap gap-2">
			<UCard
				v-for="vid in ytVids"
				:key="vid.url"
				class="w-full cursor-pointer sm:w-1/2 md:w-1/3 lg:w-1/4"
				:ui="{ body: { padding: '!px-4 !py-4' } }"
				@click="navigateTo(vid.url, { external: true })"
			>
				<div class="flex flex-col gap-4">
					<NuxtImg
						style="aspect-ratio: 16/9"
						class="w-full rounded object-cover"
						:src="`https://i.ytimg.com/vi/${ytID(
							vid,
						)}/sddefault.jpg`"
						:alt="vid.title"
					/>
					<hr class="opacity-10" />
					<h3 class="text-lg font-semibold">{{ vid.title }}</h3>
				</div>
			</UCard>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
