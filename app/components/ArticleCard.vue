<script lang="ts" setup>
import type { Article } from "~/types/article";

const props = defineProps<Article>();

const route = useRoute();
</script>

<template>
	<NuxtLink :to="to" class="w-full" data-aos="fade-up">
		<article
			class="relative flex flex-col gap-2 overflow-hidden rounded-[2rem]"
			:style="{
				height:
					props['customHeight'] && route.path !== '/'
						? props['customHeight']
						: '24rem',
			}"
		>
			<USkeleton class="absolute inset-0 h-full w-full" />
			<NuxtImg
				:src="image"
				:alt="title"
				width="100%"
				height="100%"
				fit="cover"
				class="absolute inset-0 z-0 h-full w-full object-cover"
			/>
			<div class="absolute inset-3 z-10 flex flex-col justify-between">
				<div class="flex justify-between gap-8">
					<p
						class="surface rounded-full border border-white border-opacity-30 bg-white bg-opacity-25 px-6 py-3 text-white backdrop-blur-md"
					>
						{{ date }}
					</p>
					<div
						class="surface aspect-1 shadow-gray flex h-full w-auto items-center justify-center rounded-full bg-white bg-opacity-70"
					>
						<UIcon
							class="text-3xl text-black"
							name="material-symbols-light:arrow-outward-rounded"
						/>
					</div>
				</div>
				<h3
					class="surface rounded-[2rem] border border-white border-opacity-30 bg-white bg-opacity-25 px-6 py-3 text-white backdrop-blur-md"
				>
					{{ title }}
				</h3>
			</div>
		</article>
	</NuxtLink>
</template>

<style lang="scss" scoped></style>
