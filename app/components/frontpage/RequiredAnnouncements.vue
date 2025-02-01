<script lang="ts" setup>
import type { Database } from "~~/supabase/types";

defineProps<{
	underedit?: boolean;
}>();

const supabase = useSupabaseClient<Database>();

const { data: links, refresh } = await useAsyncData(async () => {
	const { data } = await supabase.from("required-announcements").select();
	data?.sort((a, b) => {
		return a.index - b.index ? a.index - b.index : a.id - b.id;
	});
	return data;
});

const inputify = (content: typeof links.value) =>
	content
		? content.map((item) => {
				return {
					...item,
					label: item.label === null ? "" : item.label,
					description:
						item.description === null ? "" : item.description,
					route: item.route === null ? "" : item.route,
					image_url: item.image_url === null ? "" : item.image_url,
					index: item.index === null ? 0 : item.index,
				};
			})
		: [];

const mirror = ref<typeof links.value>(inputify([...(links.value ?? [])]));

watch(links, (content) => {
	if (content) mirror.value = inputify([...(links.value ?? [])]);
});

const saveLink = async (index: number) => {
	if (mirror.value) {
		const data = mirror.value[index];
		if (data) {
			const { error } = await supabase
				.from("required-announcements")
				.update(data)
				.eq("id", data.id);
			if (!error) refresh();
		}
	}
};

const createLink = async () => {
	const { error } = await supabase.from("required-announcements").insert({
		label: "Новая ссылка",
	});
	if (!error) refresh();
};

const deleteLink = async (index: number) => {
	if (mirror.value && mirror.value[index]) {
		const { error } = await supabase
			.from("required-announcements")
			.delete()
			.eq("id", mirror.value[index].id);
		if (!error) refresh();
	}
};
</script>

<template>
	<section class="__announcements mx-auto w-full max-w-[1200px] space-y-4">
		<h2 class="text-2xl font-bold">Полезные ссылки</h2>
		<UCarousel
			v-slot="{ item: link, index }"
			:items="links ?? undefined"
			arrows
			:ui="{ container: 'gap-4' }"
		>
			<UPopover
				:text="link.description"
				:mode="underedit ? 'click' : 'hover'"
			>
				<NuxtLink
					:to="link.route && !underedit ? link.route : undefined"
					external
				>
					<img
						v-if="link.image_url"
						class="h-24 rounded-lg"
						:src="link.image_url ?? ''"
						alt="Сопровождающая картинка для ссылки"
					/>
					<UCard
						:ui="{
							base: 'h-24 overflow-hidden',
							body: { padding: '!p-3' },
						}"
						v-else
					>
						<h5 class="max-w-64 text-sm font-semibold">
							{{ link.label }}
						</h5>
					</UCard>
				</NuxtLink>
				<template #panel>
					<UCard
						v-if="underedit && mirror && mirror[index]"
						:ui="{
							body: { base: 'space-y-2', padding: '!p-2' },
						}"
					>
						<UFormGroup label="Ссылка на картинку">
							<UInput
								v-model="mirror[index].image_url as string"
								placeholder="https://example.ru/image.png"
							/>
						</UFormGroup>
						<UFormGroup
							label="Подпись"
							hint="Игнорируется при наличии картинки"
						>
							<UInput
								v-model="mirror[index].label as string"
								placeholder="Ссылка туда-то"
							/>
						</UFormGroup>
						<UFormGroup label="Ссылка">
							<UInput v-model="mirror[index].route as string" />
						</UFormGroup>
						<UFormGroup label="Индекс">
							<UInput
								v-model="mirror[index].index"
								type="number"
								placeholder="0"
							/>
						</UFormGroup>
						<UFormGroup label="Описание">
							<UTextarea
								v-model="mirror[index].description as string"
								class="w-96 text-xs"
							/>
						</UFormGroup>
						<UButtonGroup size="xs">
							<UButton
								label="Сохранить"
								:disabled="
									inputify(links)[index]?.label ===
										mirror[index].label &&
									inputify(links)[index]?.index ===
										mirror[index].index &&
									inputify(links)[index]?.route ===
										mirror[index].route &&
									inputify(links)[index]?.description ===
										mirror[index].description &&
									inputify(links)[index]?.image_url ===
										mirror[index].image_url
								"
								@click="saveLink(index)"
							/>
							<UButton
								color="red"
								variant="outline"
								label="Удалить (двойным кликом)"
								@dblclick="deleteLink(index)"
							/>
						</UButtonGroup>
					</UCard>
					<UCard
						v-else
						:ui="{
							base: 'opacity-80',
							body: { base: 'space-y-2', padding: '!p-2' },
						}"
					>
						<p class="max-w-64 text-xs">{{ link.description }}</p>
						<UButton
							size="xs"
							label="Переити"
							external
							:to="link.route"
						/>
					</UCard>
				</template>
			</UPopover>
		</UCarousel>
		<UButton
			v-if="links && underedit"
			icon="mdi:plus"
			@click="createLink"
		/>
	</section>
</template>

<style lang="scss" scoped></style>
