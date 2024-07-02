<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
    layout: "manage",
});

const { user } = useTelegramUser();

const { data: perms } = await useFetch("/api/auth/perms");
</script>

<template>
    <div class="__manage p-4">
        <UCard>
            <template #header>
                <div class="flex items-center gap-4">
                    <UAvatar
                        :src="user.photo_url"
                        icon="line-md:account"
                        size="xl"
                    />
                    <div class="flex flex-col">
                        <h2 class="text-xl">
                            {{ user.first_name }} {{ user.last_name }}
                        </h2>
                        <p class="text-xs opacity-50">@{{ user.username }}</p>
                    </div>
                    <UButton
                        class="ml-auto"
                        icon="line-md:logout"
                        variant="ghost"
                        color="white"
                        size="xl"
                    />
                </div>
            </template>
            <template v-if="perms.length === 0">
                <h3 class="text-center">У вас пока нет доступа</h3>
            </template>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
