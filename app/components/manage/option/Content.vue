<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import type * as Monaco from "monaco-editor";

const sectionActive = useCookie("admin_section_content");

const pageSlugCookie = useCookie("editing_page_slug");

const toast = useToast();

const loading = ref(false);

const state = reactive<{
	slug: string;
	open: boolean;
	md: string;
}>({ slug: pageSlugCookie.value ?? "", md: "", open: true });

const { data: content, refresh: refreshContent } = await useFetch(
	"/api/content",
	{
		transform: (data) =>
			data.map((item) => ({
				label: item.slug,
			})),
	},
);

const mdRefresher = ref(1);
const fetchedMD = computedAsync(async () => {
	if (mdRefresher.value) {
		loading.value = true;
		const md = (await $fetch(`/api/content${state.slug}`)) as string;
		loading.value = false;
		return (
			md ||
			"---\ntitle: Название Страницы\ndescription: Описание Страницы\n---\n # Странца пока что пуста, но это легко исправить.\n\n[Ресурсы для редакторов](/manage/learn)"
		);
	}
}, null);

watch(fetchedMD, (md) => {
	if (md && state.slug) {
		pageSlugCookie.value = state.slug;
		return (state.md = md);
	}
});

const gotSomeMD = computed(() => fetchedMD.value || fetchedMD.value === "");

const newPageSlug = ref("");

const createNewPage = async () => {
	if (newPageSlug.value === state.slug) return;
	const slug = newPageSlug.value;
	if (!slug || !slug.startsWith("/")) return;
	loading.value = true;
	await $fetch(`/api/content`, {
		method: "POST",
		body: {
			slug: slug,
		},
	});
	await refreshContent();
	loading.value = false;
	state.slug = slug;
};

const savePage = async () => {
	if (state.md === fetchedMD.value) return;
	const slug = state.slug;
	if (!slug || !slug.startsWith("/")) return;
	loading.value = true;

	const ast = await parseMarkdown(state.md);
	const { title, description } = ast.data;

	await $fetch(`/api/content${slug}`, {
		method: "PUT",
		body: { title, description, md: state.md },
	});
	loading.value = false;
	mdRefresher.value++;
};

const statusAnim = computed(() => {
	if (newPageSlug.value && newPageSlug.value !== state.slug) {
		return {
			value: null,
			animation: "swing",
		};
	}
	if (fetchedMD.value !== state.md) {
		return {
			value: null,
			animation: "elastic",
		};
	}
	return {
		value: 0,
		animation: "",
	};
});

defineShortcuts({
	meta_s: { handler: savePage, usingInput: true },
	enter: {
		handler: createNewPage,
		usingInput: "content-slug",
	},
});

const promptDelete = async () => {
	if (!gotSomeMD.value) return;
	toast.add({
		title: "Удалить страницу",
		description: "Вы уверены, что хотите удалить страницу?",
		color: "red",
		actions: [
			{
				label: "Удалить",
				color: "red",
				click: async () => {
					await $fetch(`/api/content${state.slug}`, {
						method: "DELETE",
					});
					await $fetch(`/api/content`, {
						body: {
							firefoslug: state.slug,
						},
						method: "DELETE",
					});
					await refreshContent();
					toast.add({
						title: "Страница удалена",
						description: "Страница удалена из базы данных",
					});
				},
			},
		],
	});
};

const colorMode = useColorMode();

const editor = ref<Monaco.editor.ICodeEditor | null>(null);

const getSelection = () => {
	if (editor.value) {
		const model = editor.value.getModel();
		const selection = editor.value.getSelection();

		if (model && selection) {
			const start = model.getOffsetAt(selection.getStartPosition());
			const end = model.getOffsetAt(selection.getEndPosition());
			return { start, end };
		}
	}
	return { start: 0, end: 0 };
};

const initialSetupEditor = (editorPassed: Monaco.editor.ICodeEditor) => {
	editor.value = editorPassed;
};

const monaco = useMonaco();
onMounted(() => {
	setTimeout(() => {
		if (monaco && import.meta.client) {
			const { editor } = monaco;
			const editors = editor.getEditors();
			editors.map(initialSetupEditor);
		}
	}, 100);
});

// const wrapSelection = (wrapper: string) => {
//     const { start, end } = getSelection();
//     const wrapperLength = wrapper.length;
//     const checkString = state.md;
//     if (editor.value) {
//         if (
//             checkString.slice(start - wrapperLength, start) === wrapper &&
//             checkString.slice(end, end + wrapperLength) === wrapper
//         ) {
//             console.log("Already wrapped");
//             // Unwrap if already wrapped
//             editor.value.pushEditOperations([
//                 {
//                     range: new Range(
//                         start - wrapperLength,
//                         start,
//                         end + wrapperLength,
//                         end
//                     ),
//                     text: checkString.slice(start, end),
//                 },
//             ]);
//         } else {
//             // Wrap
//             editor.value.pushEditOperations([
//                 {
//                     range: new Range(start, start),
//                     text: wrapper,
//                 },
//                 {
//                     range: new Range(end, end),
//                     text: wrapper,
//                 },
//             ]);
//         }
//     }
// };

// defineShortcuts({
//     meta_b: { handler: () => wrapSelection("**"), usingInput: true },
// });
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Редактор контента "
			:color="useKeyToColor('edit_content')"
			variant="soft"
			icon="line-md:document-code-twotone"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive">
			<UProgress
				size="sm"
				class="transition-opacity"
				:style="{ opacity: statusAnim.value === 0 ? 0 : 1 }"
				:animation="statusAnim.animation"
				:value="statusAnim.value"
			/>
			<div>
				<UButtonGroup class="w-full">
					<UInputMenu
						v-model="state.slug"
						v-model:query="newPageSlug"
						class="w-full"
						:options="content"
						value-attribute="label"
						placeholder="URL страницы"
						name="content-slug"
					>
						<template #option-empty="{ query }">
							Страница с URL <q>{{ query }}</q> не существует
						</template>
						<template #empty>
							Пока что не создано ни одной страницы
						</template>
					</UInputMenu>

					<UButton
						v-show="newPageSlug !== state.slug"
						color="gray"
						icon="line-md:plus"
						@click="createNewPage"
					/>
					<UButton
						v-show="gotSomeMD"
						color="gray"
						icon="material-symbols:eye-tracking-outline-rounded"
						:to="state.slug"
						target="_blank"
					/>
					<UButton
						color="gray"
						icon="akar-icons:save"
						:disabled="fetchedMD === state.md || !gotSomeMD"
						@click="savePage"
					/>
					<UButton
						color="red"
						icon="material-symbols:delete-outline"
						:disabled="!gotSomeMD"
						@click="promptDelete"
					/>
				</UButtonGroup>
			</div>
			<div v-if="gotSomeMD" class="flex max-h-screen flex-wrap">
				<div
					class="flex max-h-screen min-h-96 w-full flex-col overflow-hidden xl:!w-1/2 xl:flex-1"
				>
					<MonacoEditor
						v-model="state.md"
						lang="markdown"
						class="h-full flex-grow"
						:options="{
							theme:
								colorMode.value === 'dark' ? 'vs-dark' : 'vs',
						}"
					/>
				</div>
				<MarkdownFormatter
					class="max-h-screen w-full overflow-auto border border-gray-200 px-4 xl:w-1/2 dark:border-gray-800"
				>
					<MDC v-if="state.md" class="mt-4" :value="state.md" />
				</MarkdownFormatter>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped></style>
