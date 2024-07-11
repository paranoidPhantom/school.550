<script lang="ts" setup>
const envs = ["development", "preview", "production"];

const state = reactive({
    env: envs[0],
    key: "",
});

const json = ref("");

const { data: fetchedValue, refresh: refreshValue } = await useFetch(
    "/api/devonly/kv",
    {
        query: state,
        transform: (data) => (data === "__undefined__" ? undefined : data),
    }
);

watch(state, refreshValue);

watch(fetchedValue, () => {
    try {
        json.value = JSON.stringify(fetchedValue.value, null, 4);
    } catch (error) {}
});

const write = async () => {
    await $fetch("/api/devonly/kv", {
        method: "PUT",
        body: { ...state, value: json.value },
    });
    refreshValue();
};

const colorMode = useColorMode();
</script>

<template>
    <div class="__kv-editor my-4 flex flex-col gap-4">
        <UAlert
            title="Администрирование KV"
            color="rose"
            variant="soft"
            icon="maki:danger"
        />
        <UCard>
            <div class="flex flex-col">
                <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                    KV Editor

                    <UButton
                        icon="mdi:github"
                        color="gray"
                        size="2xs"
                        to="https://github.com/paranoidPhantom/school.550/tree/dev/server/api"
                        target="_blank"
                    />
                    <UBadge variant="subtle" color="rose" v-if="!fetchedValue"
                        >fetched value is undefined</UBadge
                    >
                </h3>
                <UButtonGroup class="mb-4">
                    <USelect
                        :color="state.env === 'production' ? 'red' : 'gray'"
                        v-model="state.env"
                        :options="envs"
                    />
                    <UInput
                        :color="state.env === 'production' ? 'red' : 'gray'"
                        placeholder="Key"
                        v-model="state.key"
                    ></UInput>

                    <UButton
                        @click="write"
                        icon="mdi:database-alert-outline"
                        :disabled="
                            json === JSON.stringify(fetchedValue, null, 4)
                        "
                        :color="state.env === 'production' ? 'red' : 'gray'"
                    />
                </UButtonGroup>
                <MonacoEditor
                    lang="json"
                    v-model="json"
                    class="h-96"
                    :options="{
                        theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs',
                    }"
                />
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
