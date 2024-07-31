<script lang="ts" setup>
const feedbackForm = useState("feedback_form_enabled", () => false);
</script>

<template>
    <UAlert
        id="content"
        class="max-w-[1200px] w-full mx-auto space-y-4"
        data-aos="fade-right"
        color="blue"
        variant="subtle"
    >
        <template #title>
            <img
                src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
                class="opacity-80 dark:brightness-150 dark:contrast-125 my-4"
                width="150px"
            >
        </template>
        <template #description>
            <div class="flex flex-col gap-4">
                <p class="sm:w-3/4 text-sm">
                    Есть предложения по организации учебного процесса или
                    знаете, как сделать школу лучше?
                </p>
                <UButton
                    class="w-fit"
                    icon="line-md:bell-twotone-alert-loop"
                    @click="feedbackForm = true"
                    >Сообщить о проблеме</UButton
                >
            </div>
        </template>
    </UAlert>
</template>

<style lang="scss" scoped></style>
