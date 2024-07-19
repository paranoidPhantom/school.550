<script lang="ts" setup>
import { useFileSystemAccess } from "@vueuse/core";

const sectionActive = useCookie("admin_section_kv");

const envs = ["development", "production"];

const toast = useToast();

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

watch(state, () => refreshValue());

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

const { data, open } = useFileSystemAccess({
    dataType: "Text",
    types: [
        {
            description: "550",
            accept: {
                "application/json": [".json"],
            },
        },
    ],
});

const backedUp = ref(false);
const loadConfirmation = ref(false);
const confirmationPhrase = "I am sure I want to replace the database.";
const confirmationPhraseInput = ref("");
const loadDB = async () => {
    if (backedUp.value) {
        await open();
        const newDB = await data.value;
        loadConfirmation.value = true;
    } else {
        toast.add({
            title: "To replace database you first need to download a backup",
            color: "red",
            icon: "mdi:alert",
        });
    }
};

const loadDBConfirmation = async () => {
    if (confirmationPhraseInput.value === confirmationPhrase) {
        await $fetch("/api/devonly/snapshot", {
            method: "PUT",
            body: data.value,
        });
        window.location.reload();
    }
};
</script>

<template>
    <div class="__kv-editor my-4 flex flex-col gap-4">
        <UAlert
            title="Администрирование KV"
            color="rose"
            variant="soft"
            icon="maki:danger"
            :class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
            @click="sectionActive = sectionActive ? '' : 'true'"
        />
        <template v-if="sectionActive">
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
                        <UBadge
                            variant="subtle"
                            color="rose"
                            v-if="!fetchedValue"
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
                        class="h-96 mb-4"
                        :options="{
                            theme:
                                colorMode.value === 'dark' ? 'vs-dark' : 'vs',
                        }"
                    />
                    <hr class="opacity-20 mb-4" />
                    <UAlert
                        color="red"
                        variant="soft"
                        icon="mdi:alert"
                        title="Danger zone"
                    >
                        <template #description>
                            <div class="flex items-center gap-4 py-2">
                                <UButton
                                    color="gray"
                                    icon="mdi:database-export"
                                    @click="backedUp = true"
                                >
                                    <a
                                        :download="`backup-${new Date().toISOString()}.json`"
                                        href="/api/devonly/snapshot"
                                        >Download DB</a
                                    >
                                </UButton>
                                <UButton
                                    icon="mdi:database-import"
                                    color="red"
                                    variant="outline"
                                    @click="loadDB"
                                    label="Replace DB"
                                />
                            </div>
                        </template>
                    </UAlert>
                    <!-- Confirmation -->
                    <UModal v-model="loadConfirmation">
                        <UCard
                            :ui="{
                                base: 'overflow-hidden',
                                body: {
                                    base: 'h-[680px]',
                                    padding: '!p-0',
                                },
                            }"
                        >
                            <div class="flex flex-col gap-2 h-full">
                                <MonacoEditor
                                    lang="json"
                                    v-model="data"
                                    class="h-[600px]"
                                    :options="{
                                        theme:
                                            colorMode.value === 'dark'
                                                ? 'vs-dark'
                                                : 'vs',
                                    }"
                                />
                                <div class="p-2 flex flex-col gap-4">
                                    <UInput
                                        color="red"
                                        :placeholder="confirmationPhrase"
                                        v-model="confirmationPhraseInput"
                                    />
                                    <UButton
                                        color="red"
                                        :disabled="
                                            confirmationPhrase !==
                                            confirmationPhraseInput
                                        "
                                        @click="loadDBConfirmation"
                                        >Confirm</UButton
                                    >
                                </div>
                            </div>
                        </UCard>
                    </UModal>
                </div>
            </UCard></template
        >
    </div>
</template>

<style lang="scss" scoped></style>
