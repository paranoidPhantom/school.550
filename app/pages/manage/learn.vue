<script lang="ts" setup>
definePageMeta({
	title: "Ресурсы для редакторов",
	layout: "manage",
});
const ytVids: {
	title: string;
	url: string;
}[] = [
	{
		title: "Авторизация",
		url: "https://www.youtube.com/watch?v=KQGNfAvRJcE&list=PL2sSeg_ec3jepkdiiomwD6wfT9sS5eMrb",
	},
	{
		title: "Контент",
		url: "https://www.youtube.com/watch?v=6Np2jQfdPCc&list=PL2sSeg_ec3jepkdiiomwD6wfT9sS5eMrb&index=2",
	},
	{
		title: "Новости",
		url: "https://www.youtube.com/watch?v=MaJVLs66kq4&list=PL2sSeg_ec3jepkdiiomwD6wfT9sS5eMrb&index=3",
	},
	{
		title: "Файловая система",
		url: "https://www.youtube.com/watch?v=EFjb_g_afn0&list=PL2sSeg_ec3jepkdiiomwD6wfT9sS5eMrb&index=4",
	},
];
const ytID = ({ url }: (typeof ytVids)[number]) =>
	(url.split("v=")[1] as string).split("?")[0];
</script>

<template>
	<div class="__learn flex flex-col gap-4 p-4">
		<h1 class="text-2xl font-semibold">Ресурсы</h1>
		<hr class="opacity-10" >
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
					<hr class="opacity-10" >
					<h3 class="text-lg font-semibold">{{ vid.title }}</h3>
				</div>
			</UCard>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
