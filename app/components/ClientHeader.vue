<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const isServer = import.meta.server;

const breakpoints = useBreakpoints(breakpointsTailwind);

const mobile = breakpoints.smaller("lg");

const searchEnabled = useState("search_palette", () => false);

const state = reactive<{
    active: boolean;
    currentGroup: keyof typeof links | undefined;
    animation: "left" | "right";
    lastEnteredIndex: number;
    mobileDepth: number;
}>({
    active: false,
    currentGroup: "Сведения об ОУ",
    animation: "left",
    lastEnteredIndex: 1,
    mobileDepth: 0,
});

const links: {
    [key: string]: {
        [key: string]: { label: string; to: string; customIndex?: number }[];
    };
} = {
    "Сведения об ОУ": {
        "Сведения об оброзовательном учреждении": [
            {
                label: "Основные сведения",
                to: "/info/primary",
            },
            {
                label: "Структура и органы управления",
                to: "/info/structure",
            },
            {
                label: "Документы",
                to: "/info/documents",
            },
            {
                label: "Образование",
                to: "/info/education",
            },
            {
                label: "Образовательные стандарты",
                to: "/info/standards",
            },
            {
                label: "Руководство. Педагогический (научно-педагогический) состав",
                to: "/info/teachers",
            },
            {
                label: "Материально-техническое обеспечение и оснащенность образовательного процесса",
                to: "/info/equipment",
            },
        ],
        "": [
            {
                label: "Стипендии и иные виды материальной поддержки",
                to: "/info/scholarship",
                customIndex: 8,
            },
            {
                label: "Платные образовательные услуги",
                to: "/info/paid",
                customIndex: 9,
            },
            {
                label: "Финансово-хозяйственная деятельность",
                to: "/info/finance",
                customIndex: 10,
            },
            {
                label: "Вакантные места для приема (перевода) обучающихся",
                to: "/info/vacancies",
                customIndex: 11,
            },
            {
                label: "Доступная среда",
                to: "/info/accessible-environment",
                customIndex: 12,
            },
            {
                label: "Международное сотрудничество",
                to: "/info/collaboration",
                customIndex: 13,
            },
            {
                label: "Организация питания",
                to: "/info/food",
                customIndex: 14,
            },
            {
                label: "Методические и иные документы",
                to: "/info/materials",
                customIndex: 15,
            },
        ],
    },
    Родителям: {
        "Информация для родителей": [
            {
                label: "Обучение с использованием ДОТ",
                to: "/for-parents/distantedu",
            },
            {
                label: "Информация о ГИА",
                to: "/for-parents/gia",
            },
            {
                label: "О приеме в школу",
                to: "/for-parents/admission",
            },
            {
                label: "О толерантности",
                to: "/for-parents/tolerance",
            },
            {
                label: "ОРКСЭ",
                to: "/for-parents/orkse",
            },
        ],
    },
    Еще: {
        "Прочие разделы": [
            {
                label: "Партнеры",
                to: "/partners",
            },
            {
                label: "Противодействие коррупции",
                to: "/curruption-prevention",
            },
            {
                label: "Безопасная среда",
                to: "/partners",
            },
            {
                label: "Партнеры",
                to: "/partners",
            },
            {
                label: "Функциональная грамотность",
                to: "/funclit",
            },
            {
                label: "Школьный спортивный клуб",
                to: "/sportclub",
            },
        ],
    },
};

const openHeader = (groupName: string, index: number) => {
    state.active = true;
    state.currentGroup = groupName;
    state.animation = state.lastEnteredIndex > index ? "left" : "right";
    state.lastEnteredIndex = index;
};

const heights = [450, 300, 350];

const router = useRouter();

router.afterEach(() => (state.active = false));
</script>

<template>
    <div class="__header">
        <h1 class="hidden">Школа 550</h1>
        <div
            class="wrapper"
            :class="{ active: state.active }"
            :style="{
                '--section-height': `${heights[state.lastEnteredIndex]}px`,
            }"
        >
            <header @mouseleave="state.active = false">
                <div class="base">
                    <UButton
                        color="white"
                        variant="link"
                        icon="line-md:search-twotone"
                        class="lg:hidden"
                        @click="searchEnabled = true"
                    />
                    <NuxtLink to="/" class="left">Logo</NuxtLink>
                    <nav class="hidden lg:flex items-center gap-2">
                        <UButton
                            v-for="(group, groupName, index) in links"
                            :key="groupName"
                            :label="(groupName as string)"
                            variant="link"
                            color="white"
                            @mouseenter="openHeader(groupName as string, index)"
                        />
                    </nav>
                    <div class="right flex items-center gap-2">
                        <UButton
                            color="white"
                            variant="link"
                            icon="line-md:search-twotone"
                            class="hidden lg:block"
                            @click="searchEnabled = true"
                        />
                        <ColorSwitcher />
                        <!-- Mobile menu -->
                        <UButton
                            v-show="!isServer"
                            :key="state.active ? 'closed' : 'opened'"
                            class="lg:hidden"
                            color="white"
                            variant="link"
                            :icon="
                                state.active
                                    ? 'line-md:menu-to-close-alt-transition'
                                    : 'line-md:close-to-menu-alt-transition'
                            "
                            @click="state.active = !state.active"
                        />
                    </div>
                </div>
                <ClientOnly>
                    <Transition :name="state.animation" mode="out-in">
                        <div
                            v-if="mobile"
                            :key="`mobile_${state.mobileDepth}`"
                            class="mobile flex flex-col gap-2 h-full"
                        >
                            <template v-if="state.mobileDepth === 0">
                                <UButton
                                    v-for="(group, groupName) in links"
                                    :key="groupName"
                                    :label="(groupName as string)"
                                    color="gray"
                                    trailing-icon="material-symbols:arrow-right-alt-rounded"
                                    @click="
                                        () => {
                                            state.animation = 'right';
                                            state.mobileDepth = 1;
                                            state.currentGroup = groupName;
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
                                    ) in links[state.currentGroup]"
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
                            class="desktop flex gap-8 justify-center"
                        >
                            <div
                                v-for="(subgroup, subgroupName) in links[
                                    state.currentGroup
                                ]"
                                :key="subgroupName"
                                class="flex flex-col gap-2 h-full flex-wrap"
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
                                            v-bind="link"
                                            class="hover:underline underline-offset-4 transition-all w-fit max-w-96"
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
        @apply flex justify-center z-20;
        @apply transition-all duration-300;
        height: var(--header-height);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 0.8rem;
        --section-height: 500px;
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
            @apply h-screen lg:h-[--section-height];
            padding: 0;
            header {
                @apply border-none;
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
