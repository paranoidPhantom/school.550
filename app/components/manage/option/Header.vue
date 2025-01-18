<script lang="ts" setup>
const sectionActive = useCookie("admin_section_header");
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Меню сайта"
			:color="useKeyToColor('site-menu')"
			variant="soft"
			icon="fluent:panel-left-header-add-24-filled"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive"> </template>
	</div>
</template>

<style lang="scss" scoped></style>
