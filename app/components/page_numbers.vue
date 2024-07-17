<template>
<div class="w-[40px] h-[40px] border border-slate-600 text-slate-600 hover:text-slate-900 hover:border-slate-900 rounded flex max-[600px]:w-[20px] h-[20px]">
    <p class="text-xl mx-auto my-auto">{{ num.num }}</p>
</div>
</template>

<script setup>
defineProps({
        num: Object
    })
</script>

<style>

</style>