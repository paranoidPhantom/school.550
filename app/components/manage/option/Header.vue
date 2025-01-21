<script lang="ts" setup>
import type { Dropdown, Logic } from "~/types/header";
import type { Database } from "~~/supabase/types";

const sectionActive = useCookie("admin_section_header");

const supabase = useSupabaseClient<Database>();

const { data: linkGroups, refresh } = await useAsyncData(async () => {
	const { data: groups } = await supabase.from("header-links").select("*");
	if (!groups) return [];

	return groups.toSorted((a, b) => a.index - b.index);
});

const tabs = computed(() =>
	linkGroups.value
		? linkGroups.value.map((group) => ({
				label: group.groupName,
				group,
			}))
		: undefined,
);

const logic = ref<
	Record<
		number,
		Omit<Database["public"]["Tables"]["header-links"]["Row"], "logic"> & {
			logic:
				| { to: string }
				| Array<{
						column: string;
						data: Dropdown[string];
				  }>;
		}
	>
>({});

const updateLogic = (content: typeof linkGroups.value) => {
	if (content) {
		logic.value = Object.fromEntries([
			...content.map((item, index) => [
				index,
				{
					...item,
					logic: (item.logic as Logic).to
						? item.logic
						: Object.entries(item.logic as Logic).map((entry) => ({
								column: entry[0],
								data: entry[1],
							})),
				},
			]),
		]);
	}
};

onMounted(() => {
	if (logic.value) updateLogic(linkGroups.value);
});

watch(linkGroups, updateLogic);

const { data: pages } = await useAsyncData(
	"content_list_sb",
	async () => {
		const { data, error } = await supabase.from("content").select("*");
		if (error) throw error;
		return data;
	},
	{
		transform: (data) =>
			data.map((item) => ({
				...item,
				label: item.slug,
			})),
	},
);

const newGroup = async (complex: boolean) => {
	const item = {
		groupName: complex ? "Новый раздел" : "Новая ссылка",
		height: 200,
		index: 0,
		logic: complex
			? {
					Столбец: {
						index: 0,
						links: [],
					},
				}
			: {
					to: "/info/primary",
				},
	};
	const { error } = await supabase.from("header-links").insert(item);
	if (!error) refresh();
};

const removeGroup = async (id: number) => {
	const { error } = await supabase.from("header-links").delete().eq("id", id);
	if (!error) refresh();
};

const saveGroup = async (index: number) => {
	const saving = logic.value[index];
	if (saving) {
		const { error } = await supabase
			.from("header-links")

			.update({
				...saving,
				logic: saving.logic.to
					? saving.logic
					: Object.fromEntries(
							saving.logic.map((item) => [
								item.column,
								item.data,
							]),
						),
			})
			.eq("id", saving.id);
		if (!error) refresh();
	}
};

const index = ref<number>(0);

const group = computed(() => {
	return linkGroups.value ? linkGroups.value[index.value] : undefined;
});
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Меню сайта"
			:color="useKeyToColor('site-menu')"
			variant="soft"
			icon="fluent:panel-left-header-add-24-filled"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive">
			<UCard :ui="{ body: { base: 'space-y-2' } }">
				<template v-if="logic" #header>
					<UButtonGroup class="mb-4">
						<UButton
							v-for="(tab, btn_index) in tabs"
							:key="btn_index"
							:label="tab.label"
							:variant="index === btn_index ? 'solid' : 'link'"
							color="gray"
							@click="index = btn_index"
						/>
					</UButtonGroup>
					<div v-if="logic[index]" class="space-y-2">
						<UFormGroup label="Текст раздела">
							<UInput v-model="logic[index].groupName" />
						</UFormGroup>
						<UFormGroup label="Высота раздела">
							<UInput
								v-model="logic[index].height"
								type="number"
							/>
						</UFormGroup>
						<UFormGroup label="Индекс раздела">
							<UInput
								v-model="logic[index].index"
								type="number"
							/>
						</UFormGroup>
						<div
							v-if="!(logic[index].logic as Logic)?.to"
							class="flex gap-4"
						>
							<UCard
								v-for="(column, col_index) in Array.isArray(
									logic[index].logic,
								)
									? logic[index].logic
									: []"
								:key="col_index"
								:ui="{
									base: 'w-fit',
									body: { base: 'space-y-2' },
								}"
							>
								<UFormGroup
									label="Текст столбца"
									hint="Можно оставить пустым"
								>
									<UInput
										v-model="
											logic[index].logic[col_index].column
										"
										placeholder="Пусто"
										size="xs"
									/>
								</UFormGroup>
								<UFormGroup label="Индекс стобца">
									<UInput
										v-model="
											logic[index].logic[col_index].data
												.index
										"
										placeholder="Пусто"
										size="xs"
									/>
								</UFormGroup>
								<div
									v-for="(link, link_index) in logic[index]
										.logic[col_index].data.links"
									:key="link_index"
									class="flex items-center gap-4"
								>
									<UInput
										v-model="
											logic[index].logic[col_index].data
												.links[link_index].label
										"
										size="xs"
									/>
									<UIcon name="mdi:arrow-right" />
									<UInputMenu
										v-model="
											logic[index].logic[col_index].data
												.links[link_index].to
										"
										size="xs"
										:options="pages"
										value-attribute="label"
									/>
									<UButton
										v-if="link_index > 0"
										variant="soft"
										icon="mdi:arrow-up"
										size="xs"
										@click="
											() => {
												const clicked = {
													...logic[index].logic[
														col_index
													].data.links[link_index],
												};
												logic[index].logic[
													col_index
												].data.links[link_index] =
													logic[index].logic[
														col_index
													].data.links[
														link_index - 1
													];

												logic[index].logic[
													col_index
												].data.links[link_index - 1] =
													clicked;
											}
										"
									/>
									<UButton
										v-if="
											link_index <
											logic[index].logic[col_index].data
												.links.length -
												1
										"
										variant="soft"
										icon="mdi:arrow-down"
										size="xs"
										@click="
											() => {
												const clicked = {
													...logic[index].logic[
														col_index
													].data.links[link_index],
												};
												logic[index].logic[
													col_index
												].data.links[link_index] =
													logic[index].logic[
														col_index
													].data.links[
														link_index + 1
													];

												logic[index].logic[
													col_index
												].data.links[link_index + 1] =
													clicked;
											}
										"
									/>
									<UButton
										icon="mdi:close"
										color="red"
										variant="soft"
										size="xs"
										@click="
											logic[index].logic[
												col_index
											].data.links.splice(link_index, 1)
										"
									/>
								</div>
								<UButtonGroup>
									<UButton
										label="Добавить ссылку"
										@click="
											logic[index].logic[
												col_index
											].data.links.push({
												to: '/...',
												label: 'Новая ссылка',
											})
										"
									/>
									<UButton
										label="Удалить столбец (двойным кликом)"
										color="red"
										variant="outline"
										@dblclick="
											logic[index].logic.splice(
												col_index,
												1,
											)
										"
									/>
								</UButtonGroup>
							</UCard>
							<UButton
								icon="mdi:plus"
								variant="soft"
								@click="
									logic[index].logic.push({
										column: 'Новый столбец',
										data: {
											index: 0,
											links: [],
										},
									})
								"
							/>
						</div>
						<UFormGroup v-else label="Ссылка">
							<UInput v-model="logic[index].logic.to" />
						</UFormGroup>
						<UButtonGroup>
							<UButton
								label="Сохранить"
								@click="saveGroup(index)"
							/>
							<UButton
								color="red"
								variant="outline"
								label="Удалить раздел (двойным кликом)"
								@dblclick="removeGroup(group.id)"
							/>
						</UButtonGroup>
					</div>
				</template>
				<UButtonGroup>
					<UButton
						icon="mdi:plus"
						label="Создать раздел"
						@click="newGroup(true)"
					/>
					<UButton
						icon="mdi:plus"
						label="Создать ссылку"
						variant="soft"
						@click="newGroup(false)"
					/>
				</UButtonGroup>
				<p class="opacity-50">
					Элементы сортируются по индеку: элемент с наиманьшим
					индексом будет левее других.
				</p>
			</UCard>
		</template>
	</div>
</template>

<style lang="scss" scoped></style>
