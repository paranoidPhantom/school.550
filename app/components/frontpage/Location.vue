<script lang="ts" setup>
const activated = ref(false);
</script>

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
		<div
			class="relative overflow-hidden rounded-2xl"
			:class="{
				'pointer-events-none': !activated,
			}"
		>
			<UButton
				v-if="!activated"
				class="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
				color="gray"
				@click="activated = true"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 1a9.002 9.002 0 0 0-6.366 15.362c1.63 1.63 5.466 3.988 5.693 6.465.034.37.303.673.673.673.37 0 .64-.303.673-.673.227-2.477 4.06-4.831 5.689-6.46A9.002 9.002 0 0 0 12 1z"
						fill="#F43"
					></path>
					<path
						d="M12 13.079a3.079 3.079 0 1 1 0-6.158 3.079 3.079 0 0 1 0 6.158z"
						fill="#fff"
					></path>
				</svg>
				Посмотреть на карте
			</UButton>
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
			<div
				class="transition-all duration-300 ease-in-out"
				:class="{
					'opacity-50': !activated,
					'scale-150': !activated,
					'blur-lg': !activated,
				}"
			>
				<iframe
					src="https://yandex.com/map-widget/v1/?ll=30.332925%2C59.929026&mode=poi&poi%5Bpoint%5D=30.332778%2C59.928912&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1319139635&z=15&lang=ru"
					class="h-96 w-full rounded-2xl"
					frameborder="1"
					data-aos="fade-left"
					allowfullscreen="true"
					style="position: relative"
					loading="lazy"
					title="Школа на карте"
				/>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
