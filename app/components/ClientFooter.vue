<script lang="ts" setup>
import type { ExtractPropTypes, GlobalComponents } from "vue";

const sections: {
	[key: string]: (ExtractPropTypes<GlobalComponents["UButton"]> & {
		popover_key?: string;
	})[];
} = {
	"Помочь разработке": [
		{
			label: "Сообщить о баге/недоработке",
			onClick: () => useFeedbackRequest(),
		},
		{
			label: "Исходный код проекта",
			to: "https://github.com/paranoidPhantom/school.550",
			external: true,
		},
		{
			label: "Сообщить о проблеме в GitHub",
			to: "https://github.com/paranoidPhantom/school.550/issues/new",
			external: true,
		},
	],
	"Над проектом работали": [
		{
			label: "Худалла Андрей",
			popover_key: "dev_andrei",
		},
		{
			label: "Филиппов Кирилл",
			popover_key: "dev_kirill",
		},
		{
			label: "Каменик Леонид",
			popover_key: "dev_leonid",
		},
	],
};
</script>

<template>
	<footer class="mt-4 w-full">
		<UDivider class="w-full" />

		<section
			class="mx-auto flex w-full justify-center gap-[5%] p-8 max-[790px]:flex-col"
		>
			<template
				v-for="(links, section, index) in sections"
				:key="section"
			>
				<div>
					<p class="mb-6 font-bold text-gray-400">{{ section }}</p>
					<div class="flex flex-col space-y-2">
						<template v-for="link in links" :key="link.label">
							<UPopover
								v-if="link.popover_key"
								class="w-fit"
								:popper="{ placement: 'right' }"
							>
								<UButton
									class="pl-0 pr-2"
									variant="link"
									color="white"
									v-bind="link"
								/>
								<template #panel>
									<UCard
										:ui="{
											body: {
												padding: 'p-2 sm:p-3 md:p-4',
											},
										}"
									>
										<template
											v-if="
												link.popover_key ===
												'dev_andrei'
											"
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
												link.popover_key ===
												'dev_kirill'
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
													Сделал подвал сайта,
													занимался переносом контента
													с легаси системы и первичным
													рефакторингом страниц
												</p>
											</div>
										</template>
										<template
											v-else-if="
												link.popover_key ===
												'dev_leonid'
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
								v-bind="link"
							/>
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
				<UBadge size="lg" color="white" class="flex items-center gap-2">
					<p>Мы в соцсетях</p>
					<p class="opacity-30">|</p>
					<UTooltip text="VK">
						<NuxtLink
							aria-label="Группа в ВКонтакте"
							to="https://vk.com/school_550_spb"
							class="flex items-center"
						>
							<UIcon
								name="mdi:vk"
								class="py-4 text-xl"
							/> </NuxtLink
					></UTooltip>
					<UTooltip text="Max">
						<NuxtLink
							aria-label="Канал в Max"
							to="https://max.ru/id7825335561_gosb"
							class="flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 42 42"
								fill="none"
								class="w-4"
							>
								<path
									fill="currentColor"
									fill-rule="evenodd"
									d="M21.47 41.88c-4.11 0-6.02-.6-9.34-3-2.1 2.7-8.75 4.81-9.04 1.2 0-2.71-.6-5-1.28-7.5C1 29.5.08 26.07.08 21.1.08 9.23 9.82.3 21.36.3c11.55 0 20.6 9.37 20.6 20.91a20.6 20.6 0 0 1-20.49 20.67Zm.17-31.32c-5.62-.29-10 3.6-10.97 9.7-.8 5.05.62 11.2 1.83 11.52.58.14 2.04-1.04 2.95-1.95a10.4 10.4 0 0 0 5.08 1.81 10.7 10.7 0 0 0 11.19-9.97 10.7 10.7 0 0 0-10.08-11.1Z"
									clip-rule="evenodd"
								></path>
							</svg> </NuxtLink
					></UTooltip>
				</UBadge>
			</div>
		</UDivider>
		<section
			class="flex h-24 items-center px-4 pb-3 text-gray-400 md:h-16 dark:text-gray-600"
		>
			<p>
				&copy; {{ new Date().getFullYear() }} Школа №550. Все права
				защищены.
			</p>
		</section>
	</footer>
</template>

<style lang="scss" scoped>
footer {
}
</style>
