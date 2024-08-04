<script lang="ts" setup>
const isServer = ref(true);

onMounted(() => {
    isServer.value = false;
});

const sections: {
    [key: string]: {
        name: string;
        route: string;
    }[];
} = {
    Solutions: [
        {
            name: "Explainable AI",
            route: "/solutions/ExplainableAI",
        },
        {
            name: "ML Monitoring",
            route: "/solutions/MLMonitoring",
        },
    ],
    "Use cases": [
        {
            name: "Fraud",
            route: "/Use_Cases/Fraud",
        },
        {
            name: "Churn detection",
            route: "/Use_Cases/Churn_detection",
        },
        {
            name: "Underwriting",
            route: "/Use_Cases/Underwriting",
        },
    ],
    Resources: [
        {
            name: "Resource Hub",
            route: "/Resources/Resource_Hub",
        },
        {
            name: "Blog",
            route: "/Resources/Blog",
        },
        {
            name: "Learn More",
            route: "/Resources/Learn_More",
        },
    ],
    Company: [
        {
            name: "About Us",
            route: "/company/About_Us",
        },
        {
            name: "Carrers",
            route: "/company/Carrers",
        },
        {
            name: "Events",
            route: "/company/Events",
        },
        {
            name: "Contact Us",
            route: "/company/Contact_Us",
        },
        {
            name: "Privacy Policy",
            route: "/company/Privacy_Policy",
        },
    ],
};
</script>

<template>
    <footer class="w-full mt-4">
        <UDivider class="w-full" />

        <section
            class="flex w-full mx-auto justify-center gap-[5%] pr-[10%] max-[790px]:flex-col max-[790px]:ml-4 p-8"
        >
            <template
                v-for="(links, section, index) in sections"
                :key="section"
            >
                <div>
                    <p class="mb-6 font-bold text-gray-400">{{ section }}</p>
                    <div class="flex flex-col space-y-2">
                        <UButton
                            v-for="link in links"
                            :key="link.name"
                            class="px-0"
                            variant="link"
                            color="white"
                            :to="link.route"
                        >
                            <p>{{ link.name }}</p>
                        </UButton>
                    </div>
                </div>
                <template v-if="index !== Object.keys(sections).length - 1">
                    <UDivider orientation="vertical" />
                    <UDivider
                        orientation="horizontal"
                        class="hidden max-[790px]:block my-4"
                    />
                </template>
            </template>
        </section>
        <UDivider class="w-full">
            <div class="flex items-center gap-4 justify-center">
                <UBadge size="lg" color="gray" class="flex items-center gap-2">
                    <p>Мы в соцсетях</p>
                    <p class="opacity-30">|</p>
                    <UTooltip text="VK">
                        <NuxtLink to="https://vk.com/school_550_spb">
                            <UIcon name="mdi:vk" class="h-5" /> </NuxtLink
                    ></UTooltip>
                    <UTooltip text="Telegram">
                        <NuxtLink to="https://t.me/school550_spb">
                            <UIcon name="mdi:telegram" class="h-5" /> </NuxtLink
                    ></UTooltip>
                </UBadge>
            </div>
        </UDivider>
        <section
            class="h-24 md:h-16 flex items-center px-4 text-gray-400 dark:text-gray-600 pb-3"
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
