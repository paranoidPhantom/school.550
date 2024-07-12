<script lang="ts" setup>
import { useMouse } from "@vueuse/core";
const isServer = import.meta.server;

const suffix = "|";
const suffixActive = ref(true);

onMounted(() => {
    setInterval(() => {
        suffixActive.value = !suffixActive.value;
    }, 500);
});

const { x, y } = useMouse();

const feedbackForm = useState("feedback_form_enabled", () => false);
</script>

<template>
    <div class="__home">
        <section class="hero flex items-center justify-center select-none">
            <img
                src="/images/gradient.png"
                alt="Фон"
                class="absolute top-0 left-0 w-full h-screen object-cover blur-md -z-20"
            />
            <img
                src="/images/noise.png"
                class="static-noise absolute top-0 left-0 w-full object-cover opacity-30 -z-10"
                style="height: calc(100vh + 5px)"
            />
            <img
                src="/images/noise.png"
                class="dynamic-noise absolute top-0 left-0 w-full object-cover opacity-50 z-10 pointer-events-none"
                style="height: calc(100vh + 5px)"
                :style="{ '--x': x + 'px', '--y': y + 'px' }"
            />
            <!-- Hero -->
            <div class="flex flex-col items-center gap-2" v-show="!isServer">
                <!-- Line 1 -->
                <div
                    class="flex gap-5 flex-wrap max-w-full"
                    data-aos="fade-right"
                >
                    <h1
                        class="gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                        style="animation-delay: 1.84s"
                    >
                        Школа
                    </h1>
                    <img
                        src="/images/school_compact.png"
                        alt="Школа"
                        class="rounded-full hidden sm:block sm:h-12 md:h-14 lg:h-[4.6rem]"
                    />
                </div>
                <!-- Line 2 -->
                <div class="flex gap-5 flex-wrap" data-aos="fade-left">
                    <h1
                        class="gradient text-md sm:text-2xl md:text-3xl lg:text-4xl"
                        style="animation-delay: 2.74s"
                    >
                        Информационных технологий<span
                            class="ml-1"
                            :style="{ opacity: suffixActive ? 1 : 0 }"
                        >
                            {{ suffix }}</span
                        >
                    </h1>
                </div>
                <!-- Line 3 -->
                <div class="flex gap-5 flex-wrap" data-aos="fade-right">
                    <div
                        class="sm:flex sm:h-12 md:h-14 lg:h-20 items-center justify-center bg-white py-2 px-4 rounded-full hidden"
                    >
                        <img class="h-2/3" src="/images/ort.png" alt="ORT" />
                    </div>
                    <h1
                        class="gradient text-6xl md:text-7xl lg:text-8xl"
                        style="animation-delay: 0.67s"
                    >
                        550
                    </h1>
                </div>
            </div>
        </section>
        <section class="max-w-[1200px] w-full mx-auto" id="content">
            <div class="feedback-prompt overflow-hidden relative rounded-2xl">
                <img
                    src="/images/banner-graphic.svg"
                    alt="Баннер"
                    class="w-full min-h-64 object-[80%] object-cover rounded-3xl opacity-50 sm:opacity-90"
                />
                <div
                    class="content absolute inset-0 p-8 flex flex-col justify-center gap-4 w-2/3 max-w-[400px] bg-gradient-to-r from-gray-100 dark:from-gray-900"
                >
                    <p class="w-3/4 text-sm">
                        Есть предложения по организации учебного процесса или
                        знаете, как сделать школу лучше?
                    </p>
                    <UButton @click="feedbackForm = true" class="w-fit"
                        >Сообщить о проблеме</UButton
                    >
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
@keyframes scale {
    0% {
        scale: 1 1;
    }
    50% {
        scale: 0.95 1;
    }
    100% {
        scale: 1 1;
    }
}

.__home {
    .hero {
        @apply w-full;
        padding-bottom: calc(80px + 1.8rem);
        height: calc(100vh - 80px + 3rem);
        .gradient {
            font-family: Akony, sans-serif;
            text-transform: uppercase;
            background: linear-gradient(to right, #ffffff 16%, #b8d4ff);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            text-align: center;
            animation: scale 3s infinite ease-in-out;
        }
        .static-noise {
            --image: linear-gradient(to bottom, black, black 90%, transparent);
            mask-image: var(--image);
        }
        .dynamic-noise {
            --image: radial-gradient(
                    circle 200px at var(--x) var(--y),
                    black 0,
                    transparent 100%
                ),
                linear-gradient(to bottom, black, black 90%, transparent);
            @supports not (mask-composite: intersect) {
                --image: radial-gradient(
                    circle 200px at var(--x) var(--y),
                    black 0,
                    transparent 100%
                );
            }
            -webkit-mask-image: var(--image);
            mask-image: var(--image);
            -webkit-mask-composite: intersect;
            mask-composite: intersect;
        }
    }
}
</style>
