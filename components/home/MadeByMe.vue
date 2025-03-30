<script setup lang="ts">
const items = ref()
const {data : dataAuth} = useAuth()
const itemStore = useItemStoreStore()
const { data } = await useFetch(`/api/board/${dataAuth.value?.user.email}?deleted=false`)
items.value =data.value  || []
itemStore.setMine(items.value)
</script>
<template>
<LazyItemList :items="itemStore.mine" :place="'mine'"/>
</template>