<script setup lang="ts">
const items = ref()
const {data : dataAuth} = useAuth()
const { data } = await useFetch(`/api/board/${dataAuth.value?.user.email}?deleted=true`)
items.value =data.value  || []
console.log(items.value)
</script>
<template>
<LazyItemList :items="items" :place="'trash'"/>
</template>