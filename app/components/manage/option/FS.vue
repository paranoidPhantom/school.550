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
        />
        <UInput type="file" multiple @change="uploadFiles" />
        <pre>{{ currentPathFiles }}</pre>
    </div>
</template>

<style lang="scss" scoped></style>
