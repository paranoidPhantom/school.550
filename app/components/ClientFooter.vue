<script lang="ts" setup>
const isServer = ref(true);

onMounted(() => {
    isServer.value = false;
});


const SolutionsLinks = [ 
    {
        name: "Explainable AI",
        link: "/solutions/ExplainableAI"
    },
    {
        name: "ML Monitoring",
        link: "/solutions/MLMonitoring"
    }
]

const Use_CasesLinks = [
    {
        name: "Fraud",
        link: "/Use_Cases/Fraud"
    },
    {
        name: "Churn detection",
        link: "/Use_Cases/Churn_detection"
    },
    {
        name: "Underwriting",
        link: "/Use_Cases/Underwriting"
    }
]

const ResourcesLinks = [
    {
        name: "Resource Hub",
        link: "/Resources/Resource_Hub"
    },
    {
        name: "Blog",
        link: "/Resources/Blog"
    },
    {
        name: "Learn More",
        link: "/Resources/Learn_More"
    },

]

const CompanyLinks = [
    {
        name: "About Us",
        link: "/company/About_Us"
    },
    {
        name: "Carrers",
        link: "/company/Carrers"
    },
    {
        name: "Events",
        link: "/company/Events"
    },
    {
        name: "Contact Us",
        link: "/company/Contact_Us"
    },
    {
        name: "Privacy Policy",
        link: "/company/Privacy_Policy"
    }

]

</script>

<template>
    <footer class="w-full mt-4">
        <UDivider class="w-full" />

        <section class="flex w-full mx-auto justify-center gap-[5%] pr-[10%] mt-[5%] max-[790px]:flex max-[790px]:flex-col max-[790px]:ml-4">

            <Logo class="mr-[5%]" />

            <UDivider orientation="horizontal" class="hidden max-[790px]:block my-4"/>

            <div>
                <p class="mb-6 font-bold text-gray-400">SOLUTIONS</p>
                <div class="flex flex-col space-y-2">
                    <UButton
                        class="px-0"
                        variant="link"
                        v-for="name in SolutionsLinks"
                        :key = "name"
                        color="white"
                        :to = name.link> 
                    <p>{{ name.name }}</p>
                    </UButton>
                </div>
            </div>

            <UDivider orientation="vertical" />
            <UDivider orientation="horizontal" class="hidden max-[790px]:block my-4"/>

            <div>
                <p class="mb-6 font-bold text-gray-400">USE CASES</p>
                <div class="flex flex-col space-y-2">
                    <UButton 
                        class="px-0"
                        variant="link"
                        v-for="name in Use_CasesLinks"
                        :key = "name"
                        color="white"
                        :to = name.link> 
                    <p>{{ name.name }}</p>
                    </UButton>
                </div>
            </div>

            <UDivider orientation="vertical" />
            <UDivider orientation="horizontal" class="hidden max-[790px]:block my-4"/>

            <div>
                <p class="mb-6 font-bold text-gray-400">RESOURCE</p>
                <div class="flex flex-col space-y-2">
                    <UButton 
                        class="px-0"
                        variant="link"
                        v-for="name in ResourcesLinks"
                        :key = "name"
                        color="white"
                        :to = name.link> 
                    <p>{{ name.name }}</p>
                    </UButton>
                </div>
            </div>

            <UDivider orientation="vertical" />
            <UDivider orientation="horizontal" class="hidden max-[790px]:block my-4"/>


            <div>
                <p class="mb-6 font-bold text-gray-400">COMPANY</p>
                <div class="flex flex-col space-y-2">
                    <UButton 
                        class="px-0"
                        variant="link"
                        v-for="name in CompanyLinks"
                        :key = "name"
                        color="white"
                        :to = name.link> 
                    <p>{{ name.name }}</p>
                    </UButton>
                </div>
            </div>

        </section>
        <section class="h-40 md:h-64" />
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
