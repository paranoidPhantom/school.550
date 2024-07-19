<script lang="ts" setup>
import type { File } from "~/types/file";
const props = defineProps<{
    files?: File[];
    selectable: boolean;
}>();

const emit = defineEmits<{
    (e: "fileUpload", files: FileList): void;
    (e: "fileAction", file: File): void;
}>();

const selectedFiles = defineModel<Set<string>>("selected");
if (!selectedFiles.value) selectedFiles.value = new Set();

watch(() => props.files, () => {
    if (selectedFiles.value) selectedFiles.value.clear();
});

const onClick = (file: File) => {
    if (file.isDirectory || !props.selectable || !selectedFiles.value) return;

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
    if (files) emit("fileUpload", files);
};
</script>

<template>
    <div
        class="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 rounded-md overflow-hidden relative"
        @dragenter="enterdragAndDrop"
        @dragleave="exitdragAndDrop"
        @dragover="enterdragAndDrop"
        @drop="handleFileUpload"
    >
        <Transition name="dnd-overlay">
            <div
				v-if="uploadOverlay"
                class="absolute inset-0 pointer-events-none bg-opacity-50 bg-white dark:bg-opacity-50 dark:bg-black flex items-center flex-col gap-2 rounded-md p-4"
            >
                <UIcon class="text-3xl" name="line-md:uploading-loop" />
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
                class="flex items-center gap-4 justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
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
                <div class="text-sm text-gray-500">
                    {{ useFormattedFileSize(file.size) }}
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
