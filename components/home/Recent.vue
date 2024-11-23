<script setup lang="ts">
const items = ref()
const { data } = await useFetch('/api/board/user2345678q9wetrng')
console.log("data: ",data.value)
items.value =data.value
console.log("items: ", items.value)

</script>
<template>
<LazyItemList :items="items"/>
</template>