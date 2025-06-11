<script lang="ts" setup>
import {
	breakpointsTailwind,
	useBreakpoints,
	useWindowScroll,
} from "@vueuse/core";
import type { Dropdown, Logic } from "~/types/header";
import type { Database } from "~~/supabase/types";

const isServer = import.meta.server;

const breakpoints = useBreakpoints(breakpointsTailwind);

const mobile = breakpoints.smaller("lg");

const searchEnabled = useState("search_palette", () => false);

const state = reactive<{
	active: boolean;
	currentGroup: string | undefined;
	animation: "left" | "right";
	lastEnteredIndex: number;
	mobileDepth: number;
}>({
	active: false,
	currentGroup: undefined,
	animation: "left",
	lastEnteredIndex: 1,
	mobileDepth: 0,
});

const supabase = useSupabaseClient<Database>();

const heights = useState<Record<number, number>>("header_height", () => ({}));

const isToPresent = (obj: Logic): obj is { to: string } => {
	return (obj as { to: string }).to !== undefined;
};

const { data: linkGroups } = await useAsyncData(async () => {
	const { data: groups, error } = await supabase
		.from("header-links")
		.select("*");
	if (error) {
		return [];
	}
	if (!groups) {
		return [];
	}

	const typedGroups = groups as unknown as (Omit<
		(typeof groups)[number],
		"logic"
	> & {
		logic: Logic;
	})[];

	const sortedGroups = typedGroups.toSorted((a, b) => a.index - b.index);

	sortedGroups?.forEach((group, index) => {
		const logic = sortedGroups[index]?.logic;
		if (!logic) return;
		if (!isToPresent(logic)) {
			if (!state.currentGroup) {
				state.currentGroup = group.groupName;
			}
			if (!sortedGroups[index]) return;
			if (logic.length > 1) {
				sortedGroups[index].logic = logic.toSorted(
					(a, b) => a.data.index - b.data.index,
				);
				let totalLinksProcessed = 1;
				for (let i = 0; i < logic.length; i++) {
					sortedGroups[index].logic[i].data.links = sortedGroups[
						index
					].logic[i]?.data.links.map((link) => {
						if (i > 0) link.customIndex = totalLinksProcessed;
						totalLinksProcessed++;
						return link;
					});
				}
			}
		}
		heights.value[index] = group.height;
	});

	return sortedGroups;
});

const openHeader = (groupName: string, index: number) => {
	state.active = true;
	state.currentGroup = groupName;
	state.animation = state.lastEnteredIndex > index ? "left" : "right";
	state.lastEnteredIndex = index;
};

const router = useRouter();

const closeHeader = () => {
	state.active = false;
	state.mobileDepth = 0;
};

router.afterEach((to, from) => {
	if (to.path !== from.path) closeHeader();
});

const { y } = useWindowScroll();

const focusFirstLink = () => {
	const firstLink = document.querySelector(
		".__first-header-link",
	) as HTMLAnchorElement;
	if (firstLink) {
		firstLink.focus();
	}
};

const currentGroup = computed(() =>
	linkGroups.value?.find((group) => group.groupName === state.currentGroup),
);
</script>

<template>
	<div class="__header">
		<h1 class="hidden">Школа 550</h1>
		<div class="bg-blur" :class="{ open: state.active }" />
		<div
			:class="{ hdrwrapper: true, open: state.active }"
			:style="{
				'--section-height': `${heights[state.lastEnteredIndex] ?? 1}px`,
			}"
		>
			<header
				:class="{ scrolled: (y ?? 1) > 100 }"
				@mouseleave="closeHeader"
			>
				<div class="base">
					<AppLogo class="ml-4 lg:ml-0" tabindex="0" />
					<nav class="hidden items-center gap-2 lg:flex">
						<UButton
							v-for="(group, index) in linkGroups"
							:key="`${group.id}_header_link`"
							:label="group.groupName as string"
							variant="link"
							color="white"
							class="font-light"
							:to="
								group.logic &&
								!Array.isArray(group.logic) &&
								Object.hasOwnProperty.call(group.logic, 'to')
									? (group.logic.to as string)
									: undefined
							"
							@mouseenter="
								() => {
									if (
										Array.isArray(group.logic) &&
										!Object.hasOwnProperty.call(
											group.logic,
											'to',
										)
									)
										openHeader(
											group.groupName as string,
											index,
										);
									else closeHeader();
								}
							"
							@focus="
								() => {
									if (
										Array.isArray(group.logic) &&
										!Object.hasOwnProperty.call(
											group.logic,
											'to',
										)
									)
										openHeader(
											group.groupName as string,
											index,
										);
								}
							"
							@click="focusFirstLink"
						/>
					</nav>
					<div class="right flex items-center gap-2">
						<UButton
							aria-label="Поиск"
							color="white"
							variant="link"
							icon="line-md:search-twotone"
							@click="searchEnabled = true"
						/>
						<ColorSwitcher />
						<!-- Mobile menu -->
						<UButton
							v-show="!isServer"
							:key="state.active ? 'closed' : 'opened'"
							aria-label="Меню страниц"
							class="lg:hidden"
							color="white"
							variant="link"
							:icon="
								state.active
									? 'line-md:menu-to-close-alt-transition'
									: 'line-md:close-to-menu-alt-transition'
							"
							@click="
								() => {
									state.active
										? closeHeader()
										: (state.active = true);
								}
							"
						/>
					</div>
				</div>
				<ClientOnly>
					<Transition :name="state.animation" mode="out-in">
						<div
							v-if="mobile"
							:key="`mobile_${state.mobileDepth}`"
							class="mobile flex flex-col gap-2 overflow-auto"
						>
							<template v-if="state.mobileDepth === 0">
								<UButton
									v-for="group in linkGroups"
									:key="group.groupName"
									:label="group.groupName as string"
									color="gray"
									trailing-icon="material-symbols:arrow-right-alt-rounded"
									:to="
										group.logic.hasOwnProperty('to')
											? (group.logic.to as string)
											: undefined
									"
									@click="
										(event) => {
											if (
												!group.logic.hasOwnProperty(
													'to',
												)
											) {
												event.stopPropagation();
												state.animation = 'right';
												state.mobileDepth = 1;
												state.currentGroup =
													group.groupName;
											}
										}
									"
								/>
							</template>
							<template v-else-if="state.currentGroup">
								<UButton
									label="Назад"
									color="gray"
									variant="link"
									:padded="false"
									icon="material-symbols:arrow-left-alt-rounded"
									@click="
										() => {
											state.animation = 'left';
											state.mobileDepth = 0;
										}
									"
								/>
								<template
									v-for="(
										subgroup, index
									) in currentGroup?.logic as Dropdown"
									:key="index"
								>
									<TransitionGroup name="link">
										<p
											v-if="
												state.active && subgroup.column
											"
											class="text-md opacity-60"
										>
											{{ subgroup.column }}
										</p>
										<template
											v-for="(link, link_index) in (
												subgroup as Dropdown[number]
											).data.links"
											:key="`${link.to}_${link.label}_${index}`"
										>
											<UButton
												v-if="state.mobileDepth > 0"
												v-bind="link"
												class="transition-all"
												:style="{
													transitionDelay: `${
														(link.customIndex ??
															link_index) * 0.05
													}s`,
												}"
												:label="link.label"
												color="gray"
											/>
										</template>
									</TransitionGroup>
								</template>
							</template>
						</div>
						<div
							v-else-if="state.currentGroup"
							:key="state.currentGroup"
							class="desktop flex justify-center gap-8"
						>
							<div
								v-for="(
									subgroup, subgroupIndex
								) in currentGroup?.logic"
								:key="subgroupIndex"
								class="flex h-full flex-col flex-wrap gap-2"
							>
								<TransitionGroup name="link">
									<p
										v-if="state.active"
										class="text-sm opacity-60"
									>
										{{ subgroup.column }}
									</p>
									<template
										v-for="(link, link_index) in (
											subgroup as Dropdown[number]
										).data.links"
										:key="`${link.to}_${link.label}_${subgroupIndex}_${link_index}`"
									>
										<NuxtLink
											v-if="state.active"
											:class="{
												'__first-header-link':
													subgroupIndex === 0 &&
													link_index === 0,
											}"
											v-bind="link"
											class="w-fit max-w-96 underline-offset-4 transition-all hover:underline"
											:tabindex="subgroupIndex"
											:style="{
												transitionDelay: `${
													(link.customIndex ??
														link_index) * 0.05
												}s`,
											}"
											>{{ link.label }}
										</NuxtLink>
									</template>
								</TransitionGroup>
							</div>
						</div>
					</Transition>
				</ClientOnly>
			</header>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.__header {
	--header-height: 80px;
	height: var(--header-height);
	.hdrwrapper {
		@apply z-20 flex justify-center;
		@apply duration-300;
		transition-property:
			height, padding,
			max-width,
			border-radius;
		height: var(--header-height);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 0.8rem;
		--section-height: 500px;
		header {
			@apply z-50 h-full w-full px-4;
			@apply rounded-3xl bg-gray-50 bg-opacity-20 backdrop-blur-xl;
			@apply dark:border dark:border-gray-900 dark:border-opacity-0 dark:bg-gray-800 dark:bg-opacity-50;
			@apply overflow-hidden duration-300;
			transition-property: max-width, border-radius, padding;
			max-width: 1200px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
			.mobile {
				height: calc(100% - var(--header-height));
			}
			.base {
				@apply mx-auto mb-4 flex items-center justify-between;
				@apply border-b border-b-gray-900 border-opacity-0 dark:border-b-gray-100 dark:border-opacity-0;
				@apply duration-300;
				transition-property: border-opacity, padding-bottom;
				max-width: 100%;
				height: calc(var(--header-height) - 1.6rem - 2px);
			}
			&.scrolled {
				@apply dark:border-opacity-50;
			}
		}
		&.open {
			@apply h-screen lg:h-[--section-height];
			padding: 0;
			header {
				@apply border-none;
				max-width: 100vw;
				border-radius: 0;
				padding: 1rem;
				.base {
					@apply border-opacity-20 pb-4;
				}
			}
		}
	}
}

.bg-blur {
	@apply pointer-events-none fixed inset-0 z-20 transition-all duration-700;
	will-change: backdrop-filter, background-color, background-opacity;
	&.open {
		@apply bg-gray-50 bg-opacity-20 backdrop-blur-sm;
		@apply dark:bg-gray-800 dark:bg-opacity-50;
	}
}

.left-enter-from,
.right-leave-to {
	opacity: 0;
	translate: -1rem 0;
	filter: blur(2px);
	will-change: opacity, transform, filter;
}

.left-leave-to,
.right-enter-from {
	opacity: 0;
	translate: 1rem 0;
	filter: blur(2px);
	will-change: opacity, transform, filter;
}

.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
	transition: all 0.3s ease;
	will-change: opacity, transform, filter;
}

.link-enter-from {
	opacity: 0;
	translate: -1rem 0;
	filter: blur(2px);
	will-change: opacity, transform, filter;
}
.link-leave-to {
	opacity: 0;
	will-change: opacity;
}

.link-enter-active {
	transition: all 0.3s ease;
	will-change: opacity, transform, filter;
}

.link-leave-active {
	transition: all 0.3s ease;
	will-change: opacity;
}
</style>
