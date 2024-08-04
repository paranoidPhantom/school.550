<template>
    <div class="__blog">
        <div class="flex place-content-center">
            <div
                class="w-[60%] h-[60%] border-2 rounded-xl p-[2%] flex flex-col space-y-[2%] bg-[#fffff] max-[370px]:w-[95%] max-[520px]:w-[90%] max-[600px]:w-[95%]"
            >
                <p class="text-5xl font-[500]">Блог</p>
                <p class="text-xl">
                    Я предполагаю, что здесь должно находиться маленькое
                    описание
                </p>
                <label class="relative block">
                    <input
                        class="placeholder:text-slate-400 block bg-[#EDEBF0] w-[25%] border border-slate-300 rounded-xl py-2 pl-[1%] pr-3 shadow-sm"
                        placeholder="Поиск"
                        type="text"
                    />
                    <span
                        class="absolute inset-y-0 left-[20%] flex items-center pl-2 max-[1200px]:left-[15%]"
                    >
                        <NuxtImg src="/images/search_icon.svg" />
                    </span>
                </label>
            </div>
        </div>
        <div class="ml-[20%] mt-8 flex space-x-[3%] w-[100%] overflow-hidden">
            <div v-for="name in names" :key="name">
                <author_name :name="name" />
            </div>
        </div>

        <div class="mt-8 flex justify-center">
            <div
                class="w-[62%] flex flex-wrap justify-center gap-4 max-[1880px]:w-[70%]"
            >
                <div v-for="name in names" :key="name">
                    <blog_block :name="name" />
                </div>
            </div>
        </div>

        <div
            class="w-[404px] flex space-x-[10px] mx-auto mt-16 max-[600px]:w-[300px] max-[600px]:space-x-[5px]"
        >
            <div v-for="num in numbers" :key="num">
                <page_numbers :num="num" />
            </div>
        </div>
    </div>
</template>

<script setup>
const { data: names } = await useFetch(
    "https://8b7551eccf282a4d.mokky.dev/names"
);
const { data: numbers } = await useFetch(
    "https://6a1d77422e9b027a.mokky.dev/numbers"
);
</script>
