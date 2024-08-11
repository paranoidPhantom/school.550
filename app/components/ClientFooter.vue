<script lang="ts" setup>
const isServer = ref(true);

onMounted(() => {
	isServer.value = false;
});

const sections: {
	[key: string]: (
		| {
				name: string;
				route: string;
		  }
		| {
				name: string;
				popover: string;
		  }
	)[];
} = {
	"Помочь разработке": [
		{
			name: "Исходный код проекта",
			route: "https://github.com/paranoidPhantom/school.550",
		},
		{
			name: "Упомянуть ошибку на GitHub",
			route: "https://github.com/paranoidPhantom/school.550/issues/new",
		},
	],
	"Над проектом работали": [
		{
			name: "Худалла Андрей",
			popover: "dev_andrei",
		},
		{
			name: "Филиппов Кирилл",
			popover: "dev_kirill",
		},
		{
			name: "Каменик Леонид",
			popover: "dev_leonid",
		},
	],
};
</script>

<template>
	<footer class="mt-4 w-full">
		<UDivider class="w-full" />

		<section
			class="mx-auto flex w-full justify-center gap-[5%] p-8 max-[790px]:ml-4 max-[790px]:flex-col"
		>
			<template
				v-for="(links, section, index) in sections"
				:key="section"
			>
				<div>
					<p class="mb-6 font-bold text-gray-400">{{ section }}</p>
					<div class="flex flex-col space-y-2">
						<template v-for="link in links" :key="link.name">
							<UPopover
								v-if="link.popover"
								class="w-fit"
								:popper="{ placement: 'right' }"
							>
								<UButton
									class="pl-0 pr-2"
									variant="link"
									color="white"
									:to="link.route"
								>
									<p>{{ link.name }}</p>
								</UButton>
								<template #panel>
									<UCard
										:ui="{
											body: {
												padding: 'p-2 sm:p-3 md:p-4',
											},
										}"
									>
										<template
											v-if="link.popover === 'dev_andrei'"
										>
											<div class="flex flex-col gap-2">
												<h3
													class="text-md font-semibold"
												>
													{{ link.name }}
												</h3>
												<p class="text-xs opacity-50">
													Тим лид
												</p>
												<p class="max-w-64 text-xs">
													Нёс ответственность за
													полный цикл разработки, от
													базы данных до файлового
													сервера.
												</p>
											</div>
										</template>
										<template
											v-else-if="
												link.popover === 'dev_kirill'
											"
										>
											<div class="flex flex-col gap-2">
												<h3
													class="text-md font-semibold"
												>
													{{ link.name }}
												</h3>
												<p class="text-xs opacity-50">
													Разработчик
												</p>
												<p class="max-w-64 text-xs">
													Сделал подвал сайта, создал
													страницы сайта, которые
													требуются к структуре сайта
													в
													информационно-телекоммуникационной
													сети «Интернет» и формату
													представления информации
												</p>
											</div>
										</template>
										<template
											v-else-if="
												link.popover === 'dev_leonid'
											"
										>
											<div class="flex flex-col gap-2">
												<h3
													class="text-md font-semibold"
												>
													{{ link.name }}
												</h3>
												<p class="text-xs opacity-50">
													UX/UI дизайнер
												</p>
												<p class="max-w-64 text-xs">
													Отвечал за исследование
													продукта и его конкурентов.
													Спроектировал концепт сайта
													и нарисовал все элементы
													дизайна: от кнопок до
													анимаций
												</p>
											</div>
										</template>
									</UCard>
								</template>
							</UPopover>
							<UButton
								v-else
								class="px-0"
								variant="link"
								color="white"
								:to="link.route"
							>
								<p>{{ link.name }}</p>
							</UButton>
						</template>
					</div>
				</div>
				<template v-if="index !== Object.keys(sections).length - 1">
					<UDivider orientation="vertical" />
					<UDivider
						orientation="horizontal"
						class="my-4 hidden max-[790px]:block"
					/>
				</template>
			</template>
		</section>
		<UDivider class="w-full">
			<div class="flex items-center justify-center gap-4">
				<UBadge size="lg" color="gray" class="flex items-center gap-2">
					<p>Мы в соцсетях</p>
					<p class="opacity-30">|</p>
					<UTooltip text="VK">
						<NuxtLink
							to="https://vk.com/school_550_spb"
							class="flex items-center"
						>
							<UIcon name="mdi:vk" class="h-5" /> </NuxtLink
					></UTooltip>
					<UTooltip text="Telegram">
						<NuxtLink
							to="https://t.me/school550_spb"
							class="flex items-center"
						>
							<UIcon name="mdi:telegram" /> </NuxtLink
					></UTooltip>
				</UBadge>
			</div>
		</UDivider>
		<section
			class="flex h-24 items-center px-4 pb-3 text-gray-400 md:h-16 dark:text-gray-600"
		>
			<p>
				&copy; {{ new Date().getFullYear() }} Школа №550. Все права
				защищены. Совпадения не случайны.
			</p>
		</section>
	</footer>
</template>

<style lang="scss" scoped>
footer {
}
</style>
