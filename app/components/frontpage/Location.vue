<script lang="ts" setup></script>

<template>
	<section id="location" class="mx-auto w-full max-w-[1200px] space-y-4">
		<h3 class="text-2xl font-semibold">Где находится</h3>
		<p>
			Школа расположена в Центральном районе, в историческом центре
			города. Рядом со школой — площадь Ломоносова, улица Зодчего Росси,
			Большой драматическим театр имени Г. А. Товстоногова. Ближайшие
			станции метро:
			<UBadge color="green" variant="subtle">Гостиный Двор</UBadge>,
			<UBadge color="red" variant="subtle">Владимирская</UBadge>,
			<UBadge color="orange" variant="subtle">Достоевская</UBadge>.
			<br />
			<NuxtLink to="">
				(Посмотреть схему безопасного подхода к школе)
			</NuxtLink>
		</p>
		<div class="relative overflow-hidden rounded-2xl">
			<a
				href="https://yandex.com/maps/org/gbou_secondary_school_550/1319139635/?utm_medium=mapframe&utm_source=maps"
				style="
					color: #eee;
					font-size: 12px;
					position: absolute;
					top: 0px;
				"
				class="opacity-0"
				>Санкт-Петербург</a
			><a
				href="https://yandex.com/maps/2/saint-petersburg/category/school/184106240/?utm_medium=mapframe&utm_source=maps"
				style="
					color: #eee;
					font-size: 12px;
					position: absolute;
					top: 14px;
				"
				class="opacity-0"
				>Торговый переулок, 2А — Yandex Maps</a
			>
			<iframe
				src="https://yandex.com/map-widget/v1/?ll=30.332925%2C59.929026&mode=poi&poi%5Bpoint%5D=30.332778%2C59.928912&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1319139635&z=15&lang=ru"
				class="h-96 w-full rounded-2xl"
				frameborder="1"
				data-aos="fade-left"
				allowfullscreen="true"
				style="position: relative"
			/>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
