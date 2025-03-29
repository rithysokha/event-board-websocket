<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ background: string, name: string, _id:string, boardId:string }>,
  place:string
}>();
const boardIdToDelete = ref("")
const isOpenDeleteBoard = ref(false)
const navigateBoard =(boardId:string)=>{
  navigateTo(`/board?boardId=${boardId}`)
}
const isDeleting = ref(false)
const handleDeleteBoard = async ()=>{
  try{
    isDeleting.value=true
   const res = await $fetch(`/api/${props.place=='mine'?'board':'recent'}/${boardIdToDelete.value}`, {
      method:'delete'
    })
    // @ts-expect-error
    if(res?.statusCode==200){
      const index = props.items.findIndex(item => item._id === boardIdToDelete.value)
      if (index !== -1) {
        props.items.splice(index, 1)
      }
    }
    isDeleting.value=false
    isOpenDeleteBoard.value=false
  }catch(e){
    console.log(e)
    isDeleting.value=false
  }
}
const handleDisplayDeletePrompt =(boardId:string) =>{
  boardIdToDelete.value = boardId;
  isOpenDeleteBoard.value=true
}

</script>
<template>
  <UModal v-model="isOpenDeleteBoard">
    <div class="p-4 m-4 text-center">
      <p class="text-red-500 font-bold mb-6">
        Are you sure to delete this item?
      </p>
      <div class="flex justify-center gap-4">
        <UButton class="w-1/4 flex justify-center"  label="No" @click="isOpenDeleteBoard=false"/>
        <UButton :loading="isDeleting" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash" label="Yes sure!" @click="handleDeleteBoard"/>
      </div>
    </div>
  </UModal>
  <UContainer>
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
      <UCard v-for="item in items"  :key="item.name"  class="w-full">
        <div class="flex justify-between  sm:w-full sm:h-28 md:h-40 sm:flex-col sm:items-center ">
          <div class="w-10 rounded-md sm:w-full sm:h-full cursor-pointer" @click="navigateBoard(place=='mine'?item._id:item.boardId)" :class="'bg-'+item.background"></div>
          <div class="flex w-full justify-between" >
            <p class="w-full text-end sm:text-start">{{item.name}}</p>
            <UDropdown  :items="[
              [{
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: () => handleDisplayDeletePrompt(item._id)
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