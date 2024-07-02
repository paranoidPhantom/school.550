<script lang="ts" setup>
const {
    public: { tgbot },
} = useRuntimeConfig();
</script>

<template>
    <div class="__auth">
        <TelegramAuth :bot="tgbot" />
    </div>
</template>

<style lang="scss" scoped></style>
