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
console.log("[Header] Mobile breakpoint:", mobile.value);

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

console.log("[Header] Initial state:", JSON.stringify(state));

const supabase = useSupabaseClient<Database>();

const heights = useState<Record<number, number>>("header_height", () => ({}));

const isToPresent = (obj: Logic): obj is { to: string } => {
	return (obj as { to: string }).to !== undefined;
};

const { data: linkGroups } = await useAsyncData(async () => {
	console.log("[Header] Fetching link groups from Supabase");
	const { data: groups, error } = await supabase
		.from("header-links")
		.select("*");
	if (error) {
		console.error("[Header] Error fetching groups:", error);
	}
	if (!groups) {
		console.log("[Header] No groups found in Supabase");
		return [];
	}
	console.log("[Header] Fetched groups:", groups.length);
	console.log("[Header] Groups data structure:", JSON.stringify(groups));

	const typedGroups = groups as unknown as (Omit<
		(typeof groups)[number],
		"logic"
	> & {
		logic: Logic;
	})[];

	const sortedGroups = typedGroups.toSorted((a, b) => a.index - b.index);
	console.log(
		"[Header] Groups after sorting by index:",
		sortedGroups.map((g) => g.groupName),
	);

	sortedGroups?.forEach((group, index) => {
		console.log(
			`[Header] Processing group ${group.groupName} at index ${index}`,
		);
		const logic = sortedGroups[index]?.logic;
		if (!logic) {
			console.log(`[Header] No logic found for group ${group.groupName}`);
			return;
		}
		if (!isToPresent(logic)) {
			console.log(
				`[Header] Group ${group.groupName} does not have a direct 'to' property`,
			);
			if (!state.currentGroup) {
				state.currentGroup = group.groupName;
				console.log(
					`[Header] Setting initial currentGroup to ${group.groupName}`,
				);
			}
			if (!sortedGroups[index]) return;
			if (logic.length > 1) {
				console.log(
					`[Header] Group ${group.groupName} has ${logic.length} dropdown items`,
				);
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
				console.log(
					`[Header] Processed ${totalLinksProcessed} links for group ${group.groupName}`,
				);
			}
		} else {
			console.log(
				`[Header] Group ${group.groupName} has direct 'to' property:`,
				logic.to,
			);
		}
		heights.value[index] = group.height;
		console.log(
			`[Header] Set height for index ${index} to ${group.height}`,
		);
	});
	console.log(
		"[Header] Heights after processing:",
		JSON.stringify(heights.value),
	);
	console.log("[Header] Current group after processing:", state.currentGroup);

	return sortedGroups;
});

const openHeader = (groupName: string, index: number) => {
	console.log(
		"[Header] Opening header with group:",
		groupName,
		"index:",
		index,
	);
	state.active = true;
	state.currentGroup = groupName;
	state.animation = state.lastEnteredIndex > index ? "left" : "right";
	state.lastEnteredIndex = index;
	console.log("[Header] State after opening:", JSON.stringify(state));
};

const router = useRouter();

const closeHeader = () => {
	console.log("[Header] Closing header");
	state.active = false;
	state.mobileDepth = 0;
	console.log("[Header] State after closing:", JSON.stringify(state));
};

router.afterEach((to, from) => {
	console.log("[Header] Route changed from", from.path, "to", to.path);
	if (to.path !== from.path) closeHeader();
});

const { y } = useWindowScroll();

const focusFirstLink = () => {
	console.log("[Header] Attempting to focus first link");
	const firstLink = document.querySelector(
		".__first-header-link",
	) as HTMLAnchorElement;
	if (firstLink) {
		console.log("[Header] First link found, foc				using");
		firstLink.focus();
	} else {
		console.log("[Header] No first link found to focus");
	}
};

const currentGroup = computed(() => {
	const group = linkGroups.value?.find(
		(group) => group.groupName === state.currentGroup,
	);
	console.log(
		"[Header] Current group computed:",
		state.currentGroup,
		"Found:",
		!!group,
	);
	return group;
});

// Add a watch to monitor state changes
watch(
	() => state.active,
	(newVal) => {
		console.log("[Header] state.active changed to:", newVal);
	},
);

watch(
	() => state.currentGroup,
	(newVal) => {
		console.log("[Header] state.currentGroup changed to:", newVal);
	},
);

// Log when linkGroups are loaded
watch(
	() => linkGroups.value,
	(newVal) => {
		console.log("[Header] linkGroups updated:", newVal?.length);
	},
	{ immediate: true },
);
</script>

<template>
	<div class="__header">
		<h1 class="hidden">Школа 550</h1>
		<div class="bg-blur" :class="{ open: state.active }" />
		<div
			class="wrapper"
			:class="{ open: state.active }"
			:style="{
				'--section-height': `${heights[state.lastEnteredIndex] ?? 0}px`,
			}"
		>
			<header :class="{ scrolled: y > 100 }" @mouseleave="closeHeader">
				<div class="base">
					<AppLogo class="ml-4 lg:ml-0" tabindex="0" />
					<nav class="hidden items-center gap-2 lg:flex">
						<UButton
							v-for="(group, index) in linkGroups"
							:key="group.id"
							:label="group.groupName as string"
							variant="link"
							color="white"
							class="font-light"
							:to="
								group.logic &&
								Object.hasOwnProperty.call(group.logic, 'to')
									? (group.logic.to as string)
									: undefined
							"
							@mouseenter="
								() => {
									console.log(
										'[Header] Mouse enter on nav button:',
										group.groupName,
										'hasTo:',
										Object.hasOwnProperty.call(
											group.logic,
											'to',
										),
									);
									if (
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
							@focus="
								() => {
									console.log(
										'[Header] Focus on nav button:',
										group.groupName,
										'hasTo:',
										Object.hasOwnProperty.call(
											group.logic,
											'to',
										),
									);
									if (
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
									console.log(
										'[Header] Mobile menu button clicked, current state.active:',
										state.active,
									);
									state.active
										? closeHeader()
										: (state.active = true);
								}
							"
						/>
					</div>
				</div>
				<ClientOnly>
					<Transition
						:name="state.animation"
						mode="out-in"
						@before-enter="
							() =>
								console.log('[Header] Transition before-enter')
						"
						@after-enter="
							() => console.log('[Header] Transition after-enter')
						"
						@before-leave="
							() =>
								console.log('[Header] Transition before-leave')
						"
						@after-leave="
							() => console.log('[Header] Transition after-leave')
						"
					>
						<div
							v-if="mobile"
							:key="`mobile_${state.mobileDepth}`"
							class="mobile flex h-full flex-col gap-2 overflow-auto"
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
									<TransitionGroup
										name="link"
										@before-enter="
											() =>
												console.log(
													'[Header] Link TransitionGroup before-enter',
												)
										"
										@after-enter="
											() =>
												console.log(
													'[Header] Link TransitionGroup after-enter',
												)
										"
									>
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
								<TransitionGroup
									name="link"
									@before-enter="
										() =>
											console.log(
												'[Header] Link TransitionGroup before-enter',
											)
									"
									@after-enter="
										() =>
											console.log(
												'[Header] Link TransitionGroup after-enter',
											)
									"
								>
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
										:key="`${link.to}_${link.label}_${index}`"
									>
										<NuxtLink
											v-if="state.active"
											:class="{
												'__first-header-link':
													subgroupIndex === 0 &&
													index === 0,
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
	.wrapper {
		@apply z-20 flex justify-center;
		@apply transition-all duration-300;
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
			@apply overflow-hidden transition-all duration-300;
			max-width: 1200px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
			.base {
				@apply mx-auto mb-4 flex items-center justify-between;
				@apply transition-all duration-300;
				@apply border-b border-b-gray-900 border-opacity-0 dark:border-b-gray-100 dark:border-opacity-0;
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
}

.left-leave-to,
.right-enter-from {
	opacity: 0;
	translate: 1rem 0;
	filter: blur(2px);
}

.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
	transition: all 0.3s ease;
}

.link-enter-from {
	opacity: 0;
	translate: -1rem 0;
	filter: blur(2px);
}
.link-leave-to {
	opacity: 0;
}

.link-enter-active {
	transition: all 0.3s ease;
}

.link-leave-active {
	transition: all 0.3s ease;
}
</style>
