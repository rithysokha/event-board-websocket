<script setup lang="ts">
const items = ref()
const { data: authData } = useAuth()
const { data } = await useFetch(`/api/recent/${authData.value?.user.email}`)
items.value = data.value
</script>
<template>
    <ClientOnly>
        <ItemList :items="items" :place="'recent'" />
    </ClientOnly>
</template>