<script lang="ts" setup>
defineProps<{
	resource: string;
	server?: string;
	icon?: string;
}>();

const {
	public: { file_server_url },
} = useRuntimeConfig();
</script>

<template>
	<UButton
		:to="`${server ?? file_server_url}/${resource}`"
		target="_blank"
		color="gray"
		:icon="icon ?? 'vscode-icons:file-type-pdf2'"
	>
		<ContentSlot />
	</UButton>
</template>

<style lang="scss" scoped></style>
