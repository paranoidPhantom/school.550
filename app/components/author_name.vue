<template>
  <div class="w-[245px] h-[90px] rounded-xl flex bg-slate-100 space-x-[5px]">
    <img src="/images/author_photo.svg">
    <div class="flex flex-col space-y-[1px] my-auto">
        <p>{{ name.second_name }}</p>
        <p>{{ name.first_name }}</p>
        <p>{{ name.third_name }}</p>
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