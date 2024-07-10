<script setup lang="ts">
const feedbackForm = useState("feedback_form_enabled", () => false);

let msgListener: EventListener | undefined | void = undefined;
onMounted(() => {
    if (msgListener) {
        return;
    }
    msgListener = window.addEventListener(
        "message",
        function (event) {
            if (event.data.close) {
                feedbackForm.value = false;
            }
        },
        false
    );
});
</script>

<template>
    <UModal v-model="feedbackForm">
        <UCard
            :ui="{
                base: 'overflow-hidden',
                body: { base: 'h-[600px]', padding: '!p-0' },
            }"
        >
            <iframe
                class="w-full h-full"
                ref="iframe"
                src="https://pos.gosuslugi.ru/form/?opaId=268828&fz59=false"
                frameborder="0"
            />
        </UCard>
    </UModal>
</template>

<style scoped lang="scss"></style>
