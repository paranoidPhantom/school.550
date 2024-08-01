<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import type { File } from "~/types/file";

const {
    public: { file_server_url },
} = useRuntimeConfig();

const sectionActive = useCookie("admin_section_fs");

const toast = useToast();

const explorerState = reactive<{
    pathFragments: string[];
    selectedFiles: Set<string>;
    rightClickedFile: File | undefined;
}>({
    pathFragments: [],
    selectedFiles: new Set(),
    rightClickedFile: undefined,
});

const currentPath = computed(() => `/${explorerState.pathFragments.join("/")}`);

const { data: currentPathFiles, refresh: refreshCurrentPathFilesNow } =
    await useAsyncData(
        `${currentPath.value}_list`,
        () => useFS(`/list${currentPath.value}`, {}) as Promise<File[]>,
        {
            server: false,
            watch: [currentPath],
            transform: (data) => data ?? [],
        }
    );

const refreshCurrentPathFiles = () =>
    setTimeout(refreshCurrentPathFilesNow, 100);

const operationState = reactive<{
    active: boolean;
    opeartion: string | null;
    files?: FileList | string[];
}>({
    active: false,
    opeartion: null,
    files: undefined,
});

const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file, file.name);
    }
    if (files.length === 0) return;
    try {
        operationState.active = true;
        operationState.opeartion = "Загрузка файлов...";
        operationState.files = files;
        await useFS(`${currentPath.value}`, {
            method: "POST",
            body: formData,
        });
        operationState.active = false;
    } catch (error) {
        operationState.active = false;
    }
    refreshCurrentPathFiles();
};

const handleFileAction = (file: File) => {
    if (file.isDirectory) explorerState.pathFragments.push(file.name);
    else window.open(`${file_server_url}${currentPath.value}/${file.name}`);
};

const deleteFiles = async (fileNames: string[]) => {
    try {
        operationState.active = true;
        operationState.opeartion = "Удаление...";
        operationState.files = fileNames;
        await useFS(`${currentPath.value}`, {
            method: "DELETE",
            body: { files: fileNames },
        });
    } catch (error) {
        toast.add({
            title: "Ошибка удаления",
            description: (error as Error).message,
        });
    }
    operationState.active = false;
    refreshCurrentPathFiles();
};

const renameState = reactive<{
    name: string;
    active: boolean;
    newName: string;
}>({
    name: "",
    active: false,
    newName: "",
});

const renameFile = async () => {
    try {
        operationState.active = true;
        operationState.opeartion = "Переименование...";
        operationState.files = [renameState.name];
        await useFS(`/rename`, {
            method: "PUT",
            body: {
                from: `${explorerState.pathFragments.join("/")}/${
                    renameState.name
                }`,
                to: `${explorerState.pathFragments.join("/")}/${
                    renameState.newName
                }`,
            },
        });
        refreshCurrentPathFiles();
        renameState.newName = "";
    } catch (error) {
        toast.add({
            title: "Ошибка переименования",
            description: (error as Error).message,
        });
    }
    operationState.active = false;
    renameState.active = false;
};

const newFolderState = reactive<{
    name: string;
}>({
    name: "",
});

const createFolder = async () => {
    try {
        operationState.opeartion = "Создание папки...";
        operationState.files = [newFolderState.name];
        await useFS(`/directory${currentPath.value}/${newFolderState.name}`, {
            method: "POST",
        });
        refreshCurrentPathFiles();
        newFolderState.name = "";
    } catch (error) {
        toast.add({
            title: "Ошибка создания папки",
            description: (error as Error).message,
        });
    }
    operationState.active = false;
};
</script>

<template>
    <div class="flex flex-col gap-4">
        <UAlert
            title="Редактор файловой системы "
            :color="useKeyToColor('fs')"
            variant="soft"
            icon="line-md:cloud-upload-outline-loop"
            :class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
            @click="sectionActive = sectionActive ? '' : 'true'"
        />
        <UModal v-model="operationState.active" prevent-close>
            <UCard>
                <template #header>
                    <h3 class="text-xl font-semibold">
                        {{ operationState.opeartion }}
                    </h3>
                </template>
                <div
                    v-for="file in operationState.files"
                    :key="typeof file === 'string' ? file : file.name"
                    class="flex items-center justify-between"
                >
                    <div class="flex items-center gap-2">
                        <UIcon name="svg-spinners:ring-resize" />
                        <p class="text-truncate">
                            {{ typeof file === "string" ? file : file.name }}
                        </p>
                    </div>
                    <p v-if="typeof file !== 'string' && !file.isDirectory">
                        {{ useFormattedFileSize(file.size) }}
                    </p>
                </div>
            </UCard>
        </UModal>
        <UModal v-model="renameState.active">
            <UCard>
                <template #header>
                    <h3 class="text-xl font-semibold">
                        Переименовать файл - {{ renameState.name }}
                    </h3>
                </template>
                <UInput
                    v-model="renameState.newName"
                    placeholder="Новое название"
                    class="mb-4"
                />
                <UButton
                    label="Переименовать"
                    color="gray"
                    :disabled="!renameState.newName"
                    @click="renameFile"
                />
            </UCard>
        </UModal>
        <template v-if="sectionActive">
            <UCard>
                <template #header>
                    <div class="flex gap-4 items-center">
                        <UButton
                            color="gray"
                            @click="explorerState.pathFragments = []"
                        >
                            <UIcon name="codicon:root-folder" />
                        </UButton>
                        <template
                            v-for="(node, index) in explorerState.pathFragments"
                            :key="node"
                        >
                            <UIcon name="codicon:arrow-right" />
                            <UButton
                                class="flex items-center gap-2"
                                color="gray"
                                @click="
                                    explorerState.pathFragments =
                                        explorerState.pathFragments.splice(
                                            0,
                                            index + 1
                                        )
                                "
                            >
                                <UIcon name="codicon:folder" />
                                <p>{{ node }}</p>
                            </UButton>
                        </template>
                    </div>
                </template>
                <FsFileList
                    v-model:selected="explorerState.selectedFiles"
                    v-model:right-clicked-file="explorerState.rightClickedFile"
                    :files="currentPathFiles"
                    selectable
                    @file-action="handleFileAction"
                    @file-upload="uploadFiles"
                >
                    <template #file-options>
                        <UButtonGroup orientation="vertical">
                            <UButton
                                v-if="
                                    !explorerState.rightClickedFile.isDirectory
                                "
                                label="Переименовать"
                                color="gray"
                                @click="
                                    () => {
                                        if (explorerState.rightClickedFile) {
                                            renameState.active = true;
                                            renameState.name =
                                                explorerState.rightClickedFile?.name;
                                            renameState.newName =
                                                explorerState.rightClickedFile?.name;
                                        }
                                    }
                                "
                            />
                            <UButton
                                v-if="state.rightClickedFile.isDirectory"
                                label="Копировать компонент Markdown"
                                color="gray"
                                @click="
                                    useClipboard({
                                        source: `:docs{base='${currentPath}${state.rightClickedFile.name}'}`,
                                    }).copy()
                                "
                            />
                            <UButton
                                label="Удалить"
                                color="gray"
                                @click="
                                    () => {
                                        if (explorerState.rightClickedFile)
                                            deleteFiles([
                                                explorerState.rightClickedFile
                                                    .name,
                                            ]);
                                    }
                                "
                            />
                            <UButton
                                v-if="
                                    explorerState.selectedFiles &&
                                    explorerState.selectedFiles.size > 1
                                "
                                :label="`Удалить выбранные - ${explorerState.selectedFiles.size}`"
                                color="gray"
                                @click="
                                    deleteFiles(
                                        Array.from(explorerState.selectedFiles)
                                    )
                                "
                            />
                        </UButtonGroup>
                    </template>
                </FsFileList>
                <template #footer>
                    <div class="flex items-center gap-4">
                        <UTooltip text="Загрузить файлы в выбранную папку">
                            <UInput
                                type="file"
                                size="xs"
                                icon="line-md:cloud-upload-outline-loop"
                                class="w-fit"
                                multiple
                                @change="uploadFiles"
                            />
                        </UTooltip>
                        <UTooltip text="Создать папку">
                            <UButtonGroup>
                                <UInput
                                    v-model="newFolderState.name"
                                    placeholder="Название папки"
                                    size="xs"
                                    class="w-fit"
                                />
                                <UButton
                                    size="xs"
                                    icon="mdi:plus"
                                    color="gray"
                                    @click="createFolder"
                                />
                            </UButtonGroup>
                        </UTooltip>
                        <p v-show="explorerState.selectedFiles.size > 0">
                            Выбран(о)
                            {{ explorerState.selectedFiles.size }} файл(а)
                        </p>
                    </div>
                </template>
            </UCard>
        </template>
    </div>
</template>

<style lang="scss" scoped></style>
