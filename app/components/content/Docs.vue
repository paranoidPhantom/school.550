<script lang="ts" setup>
import type { File } from "~/types/file";

const props = defineProps<{
    base: string;
}>();

const state = reactive<{
    modal: boolean;
    pathFragments: string[];
}>({
    modal: false,
    pathFragments: [],
});

const {
    public: { file_server_url },
} = useRuntimeConfig();

const currentPath = computed(
    () => `${props.base}/${state.pathFragments.join("/")}`
);

const { data: currentPathFiles, refresh: refreshFiles } = await useAsyncData(
    `${currentPath.value}_list`,
    () => useFS(`/list${currentPath.value}`, {}) as Promise<File[]>,
    {
        server: false,
        watch: [currentPath],
        transform: (data) => data ?? [],
    }
);

const handleFileAction = (file: File) => {
    if (file.download) {
        const url = `${file_server_url}/download${currentPath.value}${file.name}`;

        window.open(url);
    } else {
        if (file.isDirectory) state.pathFragments.push(file.name);
        else {
            const url = `${file_server_url}${currentPath.value}${file.name}`;

            window.open(url);
        }
    }
};

onMounted(() => refreshFiles());
</script>

<template>
    <div class="__document-preview">
        <UAlert
            title="К этой странице прикреплена папка с документами"
            icon="mdi-file-document-outline"
        >
            <template #description>
                <UButton
                    label="Помотреть"
                    color="gray"
                    @click="state.modal = true"
                    size="xs"
                    class="mt-2"
                />
            </template>
        </UAlert>
        <USlideover v-model="state.modal">
            <div class="p-4">
                <div class="flex gap-4 items-center mb-2">
                    <UButton color="gray" @click="state.pathFragments = []">
                        <UIcon name="codicon:root-folder" />
                    </UButton>
                    <template
                        v-for="(node, index) in state.pathFragments"
                        :key="node"
                    >
                        <UIcon name="codicon:arrow-right" />
                        <UButton
                            class="flex items-center gap-2"
                            color="gray"
                            @click="
                                state.pathFragments =
                                    state.pathFragments.splice(0, index + 1)
                            "
                        >
                            <UIcon name="codicon:folder" />
                            <p>{{ node }}</p>
                        </UButton>
                    </template>

                    <UButton
                        icon="mdi:close"
                        color="gray"
                        class="ml-auto"
                        @click="state.modal = false"
                    />
                </div>
                <LazyFsFileList
                    v-model:path="currentPath"
                    :files="currentPathFiles"
                    :selectable="false"
                    downloadable
                    @file-action="handleFileAction"
                />
            </div>
        </USlideover>
        <hr class="my-4" />
    </div>
</template>

<style lang="scss" scoped></style>
