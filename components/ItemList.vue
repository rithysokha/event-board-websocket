<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ background: string, name: string, _id:string }>
}>();
const navigateBoard =(boardId:string)=>{
  navigateTo(`/board?boardId=${boardId}`)
}
const isDeleting = ref(false)
const handleDeleteBoard = async (boardId: string)=>{
  try{
    isDeleting.value=true
   const res = await $fetch(`/api/board/${boardId}`, {
      method:'delete'
    })
    if(res?.statusCode==200){
      const index = props.items.findIndex(item => item._id === boardId)
      if (index !== -1) {
        props.items.splice(index, 1)
      }
    }
    isDeleting.value=false
  }catch(e){
    console.log(e)
    isDeleting.value=false
  }
}

</script>
<template>
  <UContainer>
    
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
      <UCard v-for="item in items"  :key="item.name"  class="w-full">
  
        <div class="flex justify-between  sm:w-full sm:h-28 md:h-32 sm:flex-col sm:items-center ">
          <div class="w-10 rounded-md sm:w-full sm:h-full cursor-pointer" @click="navigateBoard(item._id)" :class="'bg-'+item.background"></div>
          <div class="flex w-full justify-between" >
            <p class="w-full text-end sm:text-start">{{item.name}}</p>
            <UDropdown  :items="[
              [{
                label: 'Delete',
                click: () => handleDeleteBoard(item._id)
              }]
            ]" :ui="{base:'outline-none'}" :popper="{ arrow:true }">
              <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost"/>
            </UDropdown>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>