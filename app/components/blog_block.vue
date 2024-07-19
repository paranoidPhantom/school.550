<template>
<div class="w-[378px] max-[1670px]:w-[448px] max-[500px]:w-[300px]">
    <div class="relative"> 
        <img src="/images/hand.svg" class="max-[1670px]:w-[448px]">
        <div class="absolute top-4 left-[50%] -translate-x-1/2 bg-white rounded-3xl p-2 flex space-x-4"> 
            <img src="/images/kalendar_ison.svg">
            <p>05.12.2023</p>
        </div>
        <div class="absolute bottom-2 left-[50%] bg-white rounded-3xl p-2 flex place-items-center -translate-x-1/2"> 
            <img src="/images/author_photo.svg">
            <p>{{ name.second_name }}</p>
        </div>
    </div>
    
    <p class="font-bold text-2xl text-wrap">Заголовок статьи
        может быть и две строки</p>
    <p class=" mt-2">
        Маленькое описание, я считаю, что оно должно занимать
не больше трёх строк, а то как-то много получается не правда ли?
    </p>
    <div class="mt-3 border-2 border-black p-2 rounded-3xl grid place-items-center"> 
        <p class="text-xl font-bold">Читать</p>
    </div>
</div>

</template>
<script setup>
defineProps({
        name: Object
    })
</script>

<style>

</style>