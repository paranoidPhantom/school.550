<script lang="ts" setup></script>

<template>
    <main class="__manage">
        <header
            class="fixed top-0 left-1/2 -translate-x-1/2 z-10 m-2 px-6 py-1 backdrop-blur-lg rounded-3xl border border-gray-200 dark:border-gray-800 flex items-center gap-4"
        >
            <UButton variant="soft" to="/manage">Редактор</UButton>
            <UButton variant="soft" to="/manage/learn"
                >Ресурсы для редакторов</UButton
            >
            <ColorSwitcher />
        </header>
        <slot />
    </main>
</template>

<style lang="scss" scoped></style>
