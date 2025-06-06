<script setup lang="ts">
const items = ref()
const { data: authData } = useAuth()
const itemStore = useItemStoreStore()
const { data } = await useFetch(`/api/recent/${authData.value?.user.email}`)
items.value = data.value || []
itemStore.setRecent(items.value)
</script>
<template>
    <ClientOnly>
        <ItemList :items="items" :place="'recent'" />
    </ClientOnly>
</template>