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
        <section
            class="hero flex items-center justify-center select-none overflow-hidden"
        >
            <img
                src="/images/gradient.png"
                alt="Фон"
                sizes="100vw"
                class="absolute top-0 left-0 w-full h-screen object-cover blur-md -z-20"
            >
            <img
                src="/images/noise.png"
                class="static-noise absolute top-0 left-0 w-full object-cover opacity-30 -z-10"
                sizes="100vw"
                style="height: calc(100vh + 5px)"
            >
            <img
                src="/images/noise.png"
                class="dynamic-noise absolute top-0 left-0 w-full object-cover opacity-50 z-10 pointer-events-none"
                sizes="100vw"
                style="height: calc(100vh + 5px)"
                :style="{ '--x': x + 'px', '--y': y + 'px' }"
            >
            <!-- Hero -->
            <div v-show="!isServer" class="flex flex-col items-center gap-2">
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
                    >
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
                        <img class="h-2/3" src="/images/ort.png" alt="ORT" >
                    </div>
                    <h1
                        class="gradient text-6xl md:text-7xl lg:text-8xl"
                        style="animation-delay: 0.67s"
                    >
                        550
                    </h1>
                </div>
            </div>
            <div v-show="isServer" class="flex items-center justify-center">
                <UIcon
                    name="svg-spinners:blocks-wave"
                    class="text-4xl text-white opacity-70 blur-[1px]"
                />
            </div>
            <div
                class="hero-links absolute max-w-[1200px] w-full bottom-0 flex justify-between p-4 sm:p-6 md:p-8 pb-8"
            >
                <div class="flex flex-wrap gap-y-2 gap-x-4">
                    <UButton variant="solid" color="gray" to="#location"
                        >Торговый переулок, 2А</UButton
                    >
                    <UButton
                        variant="solid"
                        color="gray"
                        to="tel:+7 (812) 315-50-60"
                        >+7 (812) 315-50-60</UButton
                    >
                </div>
                <div class="flex flex-wrap gap-y-2 gap-x-4 ml-8 justify-end">
                    <UButton
                        variant="solid"
                        color="gray"
                        to="https://t.me/school550_spb"
                    >
                        <UIcon name="icon-park-outline:telegram" />
                    </UButton>
                    <UButton
                        variant="solid"
                        color="gray"
                        to="https://vk.com/school_550_spb"
                    >
                        <UIcon name="entypo-social:vk" />
                    </UButton>
                </div>
            </div>
        </section>
        <div class="space-y-16">
            <section
                id="content"
                class="max-w-[1200px] w-full mx-auto space-y-4"
            >
                <h3 class="text-2xl font-semibold">Сообщить о проблеме</h3>
                <div
                    class="feedback-prompt overflow-hidden relative rounded-2xl"
                    data-aos="fade-right"
                >
                    <img
                        src="/images/banner-graphic.svg"
                        alt="Баннер"
                        class="w-full min-h-64 object-[80%] object-cover rounded-3xl opacity-50 sm:opacity-90"
                    >
                    <div
                        class="content absolute inset-0 p-8 flex flex-col justify-center gap-4 w-2/3 max-w-[400px] bg-gradient-to-r from-gray-100 dark:from-gray-900"
                    >
                        <img
                            src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
                            class="opacity-80 dark:brightness-150 dark:contrast-125"
                            width="200px"
                        >
                        <p class="sm:w-3/4 text-sm">
                            Есть предложения по организации учебного процесса
                            или знаете, как сделать школу лучше?
                        </p>
                        <UButton class="w-fit" @click="feedbackForm = true"
                            >Сообщить о проблеме</UButton
                        >
                    </div>
                </div>
            </section>
            <section
                id="location"
                class="max-w-[1200px] w-full mx-auto space-y-4"
            >
                <h3 class="text-2xl font-semibold">Где находится</h3>
                <p>
                    Школа расположена в Центральном районе, в историческом
                    центре города. Рядом со школой — площадь Ломоносова, улица
                    Зодчего Росси, Большой драматическим театр имени Г. А.
                    Товстоногова. Ближайшие станции метро:
                    <UBadge color="green" variant="subtle">Гостиный Двор</UBadge
                    >,
                    <UBadge color="red" variant="subtle">Владимирская</UBadge>,
                    <UBadge color="orange" variant="subtle">Достоевская</UBadge
                    >.
                    <br >
                    <NuxtLink to="">
                        (Посмотреть схему безопасного подхода к школе)
                    </NuxtLink>
                </p>
                <div class="relative rounded-2xl overflow-hidden">
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
                    <iframe
                        src="https://yandex.com/map-widget/v1/?ll=30.332925%2C59.929026&mode=poi&poi%5Bpoint%5D=30.332778%2C59.928912&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1319139635&z=15&lang=ru"
                        class="w-full h-96 rounded-2xl"
                        frameborder="1"
                        data-aos="fade-left"
                        allowfullscreen="true"
                        style="position: relative"
                    />
                </div>
            </section>
        </div>
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
            -webkit-mask-image: var(--image);
            mask-image: var(--image);
            -webkit-mask-composite: intersect;
            mask-composite: intersect;

            @supports not (mask-composite: intersect) {
                --image: radial-gradient(
                    circle 200px at var(--x) var(--y),
                    black 0,
                    transparent 100%
                );
            }
        }
    }
}
</style>
