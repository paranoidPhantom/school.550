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
                class="absolute top-0 left-0 w-full object-cover opacity-30 -z-10"
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
        <UButton @click="feedbackForm = true"
            >Открыть форму госуслуг (вместо кнопки будет банер)</UButton
        >
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
        .dynamic-noise {
            -webkit-mask-image: radial-gradient(
                circle 200px at var(--x) var(--y),
                black 0,
                transparent 100%
            );
            mask-image: radial-gradient(
                circle 200px at var(--x) var(--y),
                black 0,
                transparent 100%
            );
        }
    }
}
</style>
