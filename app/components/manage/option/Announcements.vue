<script lang="ts" setup>
const sectionActive = useCookie("admin_section_announcements");
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Полезные ссылки"
			:color="useKeyToColor('announcements')"
			variant="soft"
			icon="zondicons:announcement"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive">
			<UCard>
				<template #header>
					<FrontpageRequiredAnnouncements underedit />
				</template>

				<p class="opacity-50">
					Ссылки сортируются по индексу: ссылка с наименьшим индексом
					всегда будет первой. Если у ссылок одинаковый индекс, они
					сортируются по дате создания.
				</p>
			</UCard>
		</template>
	</div>
</template>

<style lang="scss" scoped></style>
