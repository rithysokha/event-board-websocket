<script setup lang="ts">
const items = ref()
const {data : dataAuth} = useAuth()
const { data } = await useFetch(`/api/board/${dataAuth.value?.user.email}`)
items.value =data.value  || []

</script>
<template>
<LazyItemList :items="items" :place="'mine'"/>
</template>