<script lang="ts" setup>
const {
    public: { tgbot },
} = useRuntimeConfig();

definePageMeta({
    title: "Авторизация",
    middleware: ["auth"],
    layout: "manage",
});

const {
    query: { redirect },
} = useRoute();
</script>

<template>
    <div class="__auth p-8">
        <UCard>
            <div class="flex flex-col gap-4 items-center">
                <h1 class="text-2xl font-semibold text-center">Авторизация</h1>
                <hr class="opacity-10 w-full max-w-96" />
                <UAlert
                    description="Для доступа к инструментам администратора необходимо авторизоваться"
                    color="primary"
                    variant="subtle"
                />
                <TelegramAuth
                    :bot="tgbot"
                    @login="navigateTo(String(redirect) ?? '/manage')"
                />
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
