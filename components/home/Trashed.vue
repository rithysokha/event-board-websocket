<script setup lang="ts">
const items = ref()
const itemStore = useItemStoreStore()
const { data: dataAuth } = useAuth()
const { data } = await useFetch(`/api/board/${dataAuth.value?.user.email}?deleted=true`)
items.value = data.value || []
itemStore.setTrash(items.value)
</script>
<template>
    <ClientOnly>
        <LazyItemList :items="itemStore.trash" :place="'trash'" />
    </ClientOnly>
</template>