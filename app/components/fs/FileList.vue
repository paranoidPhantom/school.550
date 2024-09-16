<script lang="ts" setup>
import { useMouse, useWindowScroll } from "@vueuse/core";
import type { File } from "~/app/types/file";
const props = defineProps<{
	files?: File[];
	selectable: boolean;
	downloadable?: boolean;
}>();
const emit = defineEmits<{
	(e: "fileUpload", files: FileList): void;
	(e: "fileAction", file: File): void;
}>();

const selectedFiles = defineModel<Set<string>>("selected");
if (!selectedFiles.value) selectedFiles.value = new Set();

const path = defineModel<string>("path");
watch(
	() => props.files,
	() => {
		if (selectedFiles.value) selectedFiles.value.clear();
	},
);

const onClick = (file: File) => {
	if (!props.selectable || !selectedFiles.value) return;

	if (selectedFiles.value.has(file.name)) {
		selectedFiles.value.delete(file.name);
	} else {
		selectedFiles.value.add(file.name);
	}
};

const handledragAndDrop = (event: Event) => {
	event.stopPropagation();
	event.preventDefault();
};

const uploadOverlay = ref(false);
const enterdragAndDrop = (event: Event) => {
	handledragAndDrop(event);
	uploadOverlay.value = true;
};

const exitdragAndDrop = (event: Event) => {
	handledragAndDrop(event);
	uploadOverlay.value = false;
};

const handleFileUpload = (event: DragEvent) => {
	handledragAndDrop(event);
	uploadOverlay.value = false;
	const files = event.dataTransfer?.files;
	if (files)
		emit(
			"fileUpload",
			files.filter((file) => file.type),
		);
};

const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

const contextMenuState = reactive({
	open: false,
});
const rightClickedFile = defineModel<File>("rightClickedFile");
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

function onContextMenu(file: File) {
	const top = unref(y) - unref(windowY);
	const left = unref(x);

	virtualElement.value.getBoundingClientRect = () => ({
		width: 0,
		height: 0,
		top,
		left,
	});

	rightClickedFile.value = file;
	contextMenuState.open = true;
}
</script>

<template>
	<div
		class="relative flex min-h-40 flex-col divide-y divide-gray-200 overflow-hidden rounded-md dark:divide-gray-800"
		@dragenter="enterdragAndDrop"
		@dragleave="exitdragAndDrop"
		@dragover="enterdragAndDrop"
		@drop="handleFileUpload"
	>
		<UContextMenu
			v-model="contextMenuState.open"
			:virtual-element="virtualElement"
		>
			<slot name="file-options" />
		</UContextMenu>
		<Transition name="dnd-overlay">
			<div
				v-if="uploadOverlay"
				class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50"
			>
				<p>Загрузка файлов</p>
			</div>
		</Transition>
		<template v-if="files">
			<div
				v-if="files.length === 0"
				class="flex flex-col items-center gap-2"
			>
				<UIcon class="text-3xl" name="material-symbols:texture-minus" />
				<p class="text-lg text-gray-500">Папка пуста</p>
			</div>
			<div
				v-for="file in files"
				:key="file.name"
				:class="{
					'bg-gray-200 dark:bg-gray-700':
						selectedFiles && selectedFiles.has(file.name),
				}"
				class="flex cursor-pointer items-center justify-between gap-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
				@contextmenu.prevent="onContextMenu(file)"
				@click="onClick(file)"
				@dblclick="$emit('fileAction', file)"
			>
				<!-- Left -->
				<div class="flex items-center gap-2">
					<UIcon
						v-if="file.isDirectory"
						name="heroicons-outline:folder"
						class="text-gray-400"
					/>
					<UIcon
						v-else
						name="heroicons-outline:document-text"
						class="text-gray-400"
					/>
					<span>{{ file.name }}</span>
				</div>
				<!-- Right -->
				<div class="flex items-center gap-2">
					<UButton
						v-if="downloadable"
						icon="mdi:download"
						color="gray"
						size="xs"
						@click="
							$emit('fileAction', { ...file, download: true })
						"
					/>
					<div v-if="!file.isDirectory" class="text-sm text-gray-500">
						{{ useFormattedFileSize(file.size) }}
					</div>
				</div>
			</div>
		</template>
		<UIcon v-else name="svg-spinners:ring-resize" />
	</div>
</template>

<style lang="scss" scoped>
.dnd-overlay-enter-active,
.dnd-overlay-leave-active {
	transition: all 1s;
}

.dnd-overlay-enter-from,
.dnd-overlay-leave-to {
	opacity: 0;
}
</style>
