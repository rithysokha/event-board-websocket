<script setup lang="ts">
const items = ref()
const { data } = await useFetch('/api/board/user2345678q9wetrng')
items.value =data.value

</script>
<template>
<LazyItemList :items="items" :place="'trash'"/>
</template>