<script lang="ts" setup>
import {
	breakpointsTailwind,
	useBreakpoints,
	useWindowScroll,
} from "@vueuse/core";
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

type NormalLink = {
	label: string;
	to: string;
	customIndex?: number;
};

const supabase = useSupabaseClient<Database>();

const heights = useState("header_height", () => ({}));

const { data: linkGroups } = await useAsyncData<{
	[key: string]:
		| {
				[key: string]: NormalLink[];
		  }
		| {
				to: string;
		  };
}>(async () => {
	const { data: groups } = await supabase.from("header-links").select("*");

	groups?.forEach((group, index) => {
		if (!group.logic.hasOwnProperty("to")) {
			if (!state.currentGroup) state.currentGroup = group.groupName;
			const subgroups = Object.keys(group.logic);
			if (subgroups.length > 1) {
				groups[index].logic = Object.fromEntries(
					subgroups
						.sort(
							(a, b) =>
								group.logic[a].index - group.logic[b].index,
						)
						.map((key) => {
							return [key, group.logic[key].links];
						}),
				);
				let totalLinksProcessed = 1;
				for (let i = 0; i < subgroups.length; i++) {
					groups[index].logic[subgroups[i]] = groups[index]?.logic[
						subgroups[i]
					].map((link) => {
						link.customIndex = totalLinksProcessed;
						totalLinksProcessed++;
						return link;
					});
				}
			} else {
				groups[index].logic = Object.fromEntries(
					subgroups.map((key) => {
						return [key, group.logic[key].links];
					}),
				);
			}
		}
		heights.value[index] = group.height;
	});

	return Object.fromEntries(
		groups?.map((group) => [group.groupName, group.logic]),
	);
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
	const firstLink = document.querySelector(".__first-header-link");
	if (firstLink) firstLink.focus();
};
</script>

<template>
	<div class="__header">
		<h1 class="hidden">Школа 550</h1>
		<div class="bg-blur" :class="{ active: state.active }" />
		<div
			class="wrapper"
			:class="{ active: state.active }"
			:style="{
				'--section-height': `${heights[state.lastEnteredIndex] ?? 0}px`,
			}"
		>
			<header :class="{ scrolled: y > 100 }" @mouseleave="closeHeader">
				<div class="base">
					<AppLogo class="ml-4 lg:ml-0" tabindex="0" />
					<nav class="hidden items-center gap-2 lg:flex">
						<UButton
							v-for="(group, groupName, index) in linkGroups"
							:key="groupName"
							:label="groupName as string"
							variant="link"
							color="white"
							class="font-light"
							:to="
								group.hasOwnProperty('to')
									? (group.to as string)
									: undefined
							"
							@mouseenter="
								() => {
									if (!group.hasOwnProperty('to'))
										openHeader(groupName as string, index);
								}
							"
							@focus="
								() => {
									if (!group.hasOwnProperty('to'))
										openHeader(groupName as string, index);
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
								state.active
									? closeHeader()
									: (state.active = true)
							"
						/>
					</div>
				</div>
				<ClientOnly>
					<Transition :name="state.animation" mode="out-in">
						<div
							v-if="mobile"
							:key="`mobile_${state.mobileDepth}`"
							class="mobile flex h-full flex-col gap-2"
						>
							<template v-if="state.mobileDepth === 0">
								<UButton
									v-for="(group, groupName) in linkGroups"
									:key="groupName"
									:label="groupName as string"
									color="gray"
									trailing-icon="material-symbols:arrow-right-alt-rounded"
									:to="
										group.hasOwnProperty('to')
											? (group.to as string)
											: undefined
									"
									@click="
										(event) => {
											if (!group.hasOwnProperty('to')) {
												state.animation = 'right';
												state.mobileDepth = 1;
												state.currentGroup = groupName;
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
										subgroup, subgroupName, index
									) in linkGroups[state.currentGroup]"
									:key="index"
								>
									<TransitionGroup name="link">
										<p
											v-if="state.active && subgroupName"
											class="text-md opacity-60"
										>
											{{ subgroupName }}
										</p>
										<template
											v-for="(
												link, link_index
											) in subgroup"
											:key="`${link.to}_${link.label}_${link_index}`"
										>
											<UButton
												v-if="state.mobileDepth > 0"
												v-bind="link"
												class="transition-all"
												:style="{
													transitionDelay: `${
														(link.customIndex ??
															index) * 0.05
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
									subgroup, subgroupName, subgroupIndex
								) in linkGroups[state.currentGroup]"
								:key="subgroupName"
								class="flex h-full flex-col flex-wrap gap-2"
							>
								<TransitionGroup name="link">
									<p
										v-if="state.active"
										class="text-sm opacity-60"
									>
										{{ subgroupName }}
									</p>
									<template
										v-for="(link, index) in subgroup"
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
														index) * 0.05
												}s`,
											}"
											>{{ link.label }}</NuxtLink
										>
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
		&.active {
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
	&.active {
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
