<script lang="ts" setup></script>

<template>
	<div class="__manage-layout">
		<header
			class="fixed left-1/2 top-0 z-10 m-2 flex -translate-x-1/2 items-center gap-4 rounded-3xl border border-gray-200 px-6 py-1 backdrop-blur-lg dark:border-gray-800"
		>
			<!-- <UButton variant="soft" to="/manage">Редактор</UButton>
			<UButton variant="soft" to="/manage/learn"
				>Ресурсы для редакторов</UButton
			> -->
			<ColorSwitcher />
		</header>
		<slot />
	</div>
</template>

<style lang="scss" scoped></style>
