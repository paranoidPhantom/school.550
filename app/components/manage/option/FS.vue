<script lang="ts" setup>
const sectionActive = useCookie("admin_section_fs");

const explorerState = reactive<{
    pathFragments: string[];
}>({
    pathFragments: [],
});

const currentPath = computed(() => `/${explorerState.pathFragments.join("/")}`);

const { data: currentPathFiles, refresh: refreshCurrentPathFiles } =
    await useAsyncData(
        `${currentPath}_list`,
        () => useFS(`/list${currentPath.value}`, {}),
        {
            server: false,
            watch: [currentPath],
        }
    );

const operationState = reactive<{
    active: boolean;
    opeartion: string | null;
    files: File[];
}>({
    active: false,
    opeartion: null,
    files: [],
});

const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file, file.name);
    }
    const response = await useFS(`/`, {
        method: "POST",
        body: formData,
    });
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
        <template v-if="sectionActive">
            <div class="path">
                <div class="node" @click="explorerState.pathFragments = []">
                    <UIcon name="codicon:root-folder" />
                </div>
                <template v-for="(node, index) in explorerState.pathFragments">
                    <UIcon name="codicon:arrow-right" />
                    <div
                        class="node"
                        @click="
                            explorerState.pathFragments =
                                explorerState.pathFragments.splice(0, index + 1)
                        "
                    >
                        <UIcon name="codicon:folder" />
                        <p>{{ node }}</p>
                    </div>
                </template>
            </div>
            <UInput type="file" multiple @change="uploadFiles" />
        </template>
    </div>
</template>

<style lang="scss" scoped></style>
