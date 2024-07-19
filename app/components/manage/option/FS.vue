<script lang="ts" setup>
import type { File } from "~/types/file";

const {
    public: { file_server_url },
} = useRuntimeConfig();

const sectionActive = useCookie("admin_section_fs");

const explorerState = reactive<{
    pathFragments: string[];
    selectedFiles: Set<string>;
}>({
    pathFragments: [],
    selectedFiles: new Set(),
});

const currentPath = computed(() => `/${explorerState.pathFragments.join("/")}`);

const { data: currentPathFiles, refresh: refreshCurrentPathFiles } =
    await useAsyncData(
        `${currentPath.value}_list`,
        () => useFS(`/list${currentPath.value}`, {}) as Promise<File[]>,
        {
            server: false,
            watch: [currentPath],
        }
    );

const operationState = reactive<{
    active: boolean;
    opeartion: string | null;
    files?: FileList;
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
					:key="file.name"
                    class="flex items-center justify-between"
                >
                    <div class="flex items-center gap-2">
                        <UIcon name="svg-spinners:ring-resize" />
                        <p class="text-truncate">{{ file.name }}</p>
                    </div>
                    <p>{{ useFormattedFileSize(file.size) }}</p>
                </div>
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
                    :files="currentPathFiles"
                    selectable
                    @file-action="handleFileAction"
                    @file-upload="uploadFiles"
                />
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
