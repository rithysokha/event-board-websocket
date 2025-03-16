<script lang="ts" setup>
const isOpen = ref(false)

const fetchAvatar = async ()=>{
const data = await fetch(`/api/avatar`)
console.log(data.json)
}

onMounted(()=>{
  fetchAvatar();
})

</script>
<template>
  <div class="w-full bg-slate-50 shadow-md flex flex-row-reverse">
    <UButton  @click="isOpen=true" class="w-20 flex justify-center mr-10" size="md" icon="i-heroicons-plus"/>
  </div>
  <UModal v-model="isOpen">
    <div class="p-4">
      <Placeholder class="h-48" />
    </div>
  </UModal>
</template>