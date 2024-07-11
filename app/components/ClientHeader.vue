<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);

const mobile = breakpoints.smaller("lg");

const searchEnabled = useState("search_palette", () => false);

const state = reactive<{
    active: boolean;
    currentGroup: keyof typeof links | undefined;
    animation: "left" | "right";
    lastEnteredIndex: number;
}>({
    active: false,
    currentGroup: undefined,
    animation: "left",
    lastEnteredIndex: 0,
});

const links: {
    [key: string]: { [key: string]: { label: string; to: string }[] };
} = {
    "Сведения об ОУ": {
        "Сведения об оброзовательном учреждении": [
            {
                label: "Основные сведения",
                to: "/",
            },
            {
                label: "Основные сведения",
                to: "/",
            },
            {
                label: "Основные сведения",
                to: "/",
            },
            {
                label: "Основные сведения",
                to: "/",
            },
            {
                label: "Основные сведения",
                to: "/",
            },
        ],
    },
    "Сведения об ОУ 2": {
        "Сведения об оброзовательном учреждении": [
            {
                label: "Основные сведения",
                to: "/",
            },
        ],
    },
};
</script>

<template>
    <div class="__header">
        <h1 class="hidden">Школа 550</h1>
        <div class="wrapper" :class="{ active: state.active }">
            <header @mouseleave="state.active = false">
                <div class="base">
                    <UButton
                        color="white"
                        variant="link"
                        icon="line-md:search-twotone"
                        @click="searchEnabled = true"
                        class="lg:hidden"
                    />
                    <NuxtLink to="/" class="left">Logo</NuxtLink>
                    <nav class="hidden lg:flex items-center gap-2">
                        <UButton
                            v-for="(group, groupName, index) in links"
                            @mouseenter="
                                () => {
                                    state.currentGroup = groupName;
                                    state.active = true;
                                    state.animation =
                                        state.lastEnteredIndex > index
                                            ? 'left'
                                            : 'right';
                                    state.lastEnteredIndex = index;
                                }
                            "
                            :label="(groupName as string)"
                            variant="link"
                            color="white"
                        />
                    </nav>
                    <div class="right flex items-center gap-2">
                        <UButton
                            color="white"
                            variant="link"
                            icon="line-md:search-twotone"
                            @click="searchEnabled = true"
                            class="hidden lg:block"
                        />
                        <ColorSwitcher />
                    </div>
                </div>
                <Transition :name="state.animation" mode="out-in">
                    <div class="mobile" v-if="mobile"></div>
                    <div
                        class="desktop flex gap-8 justify-center"
                        :key="state.currentGroup"
                        v-else-if="state.currentGroup"
                    >
                        <div
                            v-for="(subgroup, subgroupName) in links[
                                state.currentGroup
                            ]"
                            class="flex flex-col gap-2 h-full flex-wrap"
                        >
                            <TransitionGroup name="link">
                                <p
                                    class="text-sm opacity-60"
                                    v-if="state.active"
                                >
                                    {{ subgroupName }}
                                </p>
                                <NuxtLink
                                    v-for="(link, index) in subgroup"
                                    v-if="state.active"
                                    v-bind="link"
                                    :style="{
                                        transitionDelay: `${index * 0.05}s`,
                                    }"
                                    >{{ link.label }}</NuxtLink
                                >
                            </TransitionGroup>
                        </div>
                    </div>
                </Transition>
            </header>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.__header {
    --header-height: 80px;
    height: var(--header-height);

    .wrapper {
        @apply flex justify-center z-20;
        @apply transition-all duration-300;

        height: var(--header-height);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 0.8rem;
        header {
            @apply px-4 w-full h-full;
            @apply rounded-2xl backdrop-blur-xl bg-opacity-20 bg-gray-50;
            @apply dark:bg-gray-800 dark:border-gray-600 dark:border-2 dark:bg-opacity-50;
            @apply transition-all duration-300 overflow-hidden;
            max-width: 1200px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            .base {
                @apply flex items-center justify-between mx-auto mb-4;
                @apply transition-all duration-300;
                @apply border-b border-b-gray-900 border-opacity-0 dark:border-opacity-0 dark:border-b-gray-100;
                max-width: 100%;
                height: calc(var(--header-height) - 1.6rem - 2px);
            }
        }
        &.active {
            @apply h-screen lg:h-[400px];
            padding: 0;
            header {
                max-width: 100vw;
                border-radius: 0;
                padding: 1rem;
                .base {
                    @apply border-opacity-20;
                }
            }
        }
    }
}

.left-enter-from,
.right-leave-to {
    opacity: 0;
    translate: -1rem 0;
}

.left-leave-to,
.right-enter-from {
    opacity: 0;
    translate: 1rem 0;
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
