<script lang="ts" setup>
const toast = useToast();

// ROLES
const { data: roles } = await useFetch("/api/roles");

const newRoleState = reactive({ key: "", description: "" });

const createRole = async (key: string, description: string) => {
    try {
        if (!key || !description) return;
        await $fetch("/api/roles", {
            method: "POST",
            body: { key, description },
        });
        if (roles.value) {
            roles.value.push({ key, description });
            newRoleState.key = "";
            newRoleState.description = "";
            toast.add({
                title: "Успешно",
                description: "Роль успешно создана",
                color: "green",
            });
        }
    } catch (error) {
        toast.add({
            title: "Ошибка",
            description: (error as Error).message,
            color: "red",
        });
    }
};

// USERS
const { data: users } = await useFetch("/api/users");
</script>

<template>
    <UAlert
        title="Корневой пользователь"
        color="green"
        variant="subtle"
        icon="ph:identification-badge-duotone"
    />
    <div class="flex gap-2">
        <UPopover v-if="roles">
            <UButton color="gray" label="Роли" />
            <template #panel>
                <UCard>
                    <div class="flex flex-col gap-2">
                        <div
                            class="role flex gap-2 w-80"
                            v-for="role in roles"
                            :key="role.key"
                        >
                            <UBadge
                                variant="soft"
                                :color="useKeyToColor(role.key)"
                                >{{ role.key }}</UBadge
                            >
                            -
                            <p
                                class="overflow-hidden truncate opacity-80"
                                :title="role.description"
                            >
                                {{ role.description }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <UButtonGroup>
                                <UInput
                                    v-model="newRoleState.key"
                                    placeholder="Роль"
                                    size="xs"
                                />
                                <UInput
                                    v-model="newRoleState.description"
                                    placeholder="Описание"
                                    size="xs"
                                />
                                <UButton
                                    icon="mdi:plus"
                                    size="xs"
                                    @click="
                                        createRole(
                                            newRoleState.key,
                                            newRoleState.description
                                        )
                                    "
                                    color="gray"
                                />
                            </UButtonGroup>
                        </div>
                    </div>
                </UCard>
            </template>
        </UPopover>
        <UPopover v-if="users">
            <UButton color="gray" label="Пользователи" />
            <template #panel>
                <UCard>
                    <div class="flex flex-col gap-2"></div>
                </UCard>
            </template>
        </UPopover>
    </div>
</template>

<style lang="scss" scoped></style>
