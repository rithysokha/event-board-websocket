<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ background: string, name: string, _id: string, boardId: string }>,
  place: string
}>();
import deleteArt from "@/assets/delete.json"
import restoreArt from "@/assets/success.json"
import lottie from 'lottie-web'
const boardIdToDelete = ref("")
const boardIdToRestore = ref("")
const isOpenDeleteBoard = ref(false)
const isOpenRestoreBoard = ref(false)
const itemStore = useItemStoreStore()
const trashAnimationContainer = ref<HTMLElement | null>(null)
const toast = useToast()
const navigateBoard = (boardId: string) => {
  navigateTo(`/board?boardId=${boardId}`)
}
const isProcessing = ref(false)

const getDeleteUrl = (place: string) => {
  if (place == 'mine')
    return 'board'
  else if (place == 'recent')
    return 'recent'
  else return 'board/permanent'
}
const initAnimation = (art:any) => {
  if (trashAnimationContainer.value) {
    lottie.loadAnimation({
      container: trashAnimationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: art
    })
  }
}
const handleDeleteBoard = async () => {
  try {
    isProcessing.value = true
    nextTick(() => {
      initAnimation(deleteArt)
    })
    const res = await $fetch(`/api/${getDeleteUrl(props.place)}/${boardIdToDelete.value}`, {
      method: 'delete'
    })
    // @ts-expect-error
    if (res?.statusCode == 200) {
      const index = props.items.findIndex(item => item._id === boardIdToDelete.value)
      if (props.place === 'mine') {
        itemStore.addTrash(props.items[index].background, props.items[index].name, props.items[index]._id, props.items[index].boardId)
        itemStore.removeRecent(boardIdToDelete.value)
      }
      if (index !== -1) {
        props.items.splice(index, 1)
      }
    }
    toast.add({ title: 'Board deleted', icon: 'i-heroicons-trash' })
    await new Promise((resolve) => setTimeout(resolve, 800));
    isOpenDeleteBoard.value = false
    await new Promise((resolve) => setTimeout(resolve, 500));
    isProcessing.value = false
  } catch (e) {
    console.log(e)
    isProcessing.value = false
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
  }
}

const hanldeRestoreBoard = async () => {
  try {
    isProcessing.value = true
    nextTick(() => {
      initAnimation(restoreArt)
    })
    const res = await $fetch(`/api/board/restore/${boardIdToRestore.value}`, {
      method: 'put'
    })
    if (res?.statusCode == 200) {
      const index = props.items.findIndex(item => item._id === boardIdToRestore.value)
      itemStore.addMine(props.items[index].background, props.items[index].name, props.items[index]._id, props.items[index].boardId)
      if (index !== -1) {
        props.items.splice(index, 1)
      }
    }
    toast.add({ title: 'Board deleted', icon: 'i-heroicons-check-circle' })
    await new Promise((resolve) => setTimeout(resolve, 800));
    isOpenRestoreBoard.value = false
    await new Promise((resolve) => setTimeout(resolve, 500));
    isProcessing.value = false
  } catch (e) {
    console.log(e)
    isProcessing.value = false
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
  }
}
const handleDisplayDeletePrompt = (boardId: string) => {
  boardIdToDelete.value = boardId;
  isOpenDeleteBoard.value = true
}
const handleDisplayRestoringPrompt = (boardId: string) => {
  boardIdToRestore.value = boardId;
  isOpenRestoreBoard.value = true
}
</script>
<template>
  <ClientOnly>
    <UModal v-model="isOpenDeleteBoard">
      <div v-if="!isProcessing" class="p-4 m-4 text-center">
        <p class="text-red-500 font-bold mb-6">
          Are you sure to delete this item?
        </p>
        <div class="flex justify-center gap-4">
          <UButton class="w-1/4 flex justify-center" label="No" @click="isOpenDeleteBoard = false" />
          <UButton :loading="isProcessing" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash"
            label="Yes sure!" @click="handleDeleteBoard" />
        </div>
      </div>
      <div v-else class="w-full flex items-center justify-center">
      <div class="w-36 h-36" ref="trashAnimationContainer"></div>
    </div>
    </UModal>
    <UModal v-model="isOpenRestoreBoard">
      <div v-if="!isProcessing" class="p-4 m-4 text-center">
        <p class="text-red-500 font-bold mb-6">
          Are you sure to restore this item?
        </p>
        <div class="flex justify-center gap-4">
          <UButton class="w-1/4 flex justify-center" label="No" @click="isOpenRestoreBoard = false" />
          <UButton :loading="isProcessing" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash"
            label="Yes sure!" @click="hanldeRestoreBoard" />
        </div>
      </div>
      <div v-else class="w-full flex items-center justify-center">
      <div class="w-36 h-36" ref="trashAnimationContainer"></div>
    </div>
    </UModal>
    <UContainer>
      <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <UCard v-for="item in items" :key="item.name" class="w-full">
          <div class="flex justify-between w-full sm:items-end sm:pl-2">
          <div class="flex justify-between items-center w-5/6 sm:w-full sm:h-28 md:h-40 sm:flex-col"
            @click="navigateBoard(place == 'mine' ? item._id : item.boardId)">
            <div class="w-4/5 h-12 rounded-md sm:w-full sm:h-full cursor-pointer" :class="'bg-' + item.background">
            </div>
            <div class="flex w-full justify-between">
              <p class="w-full text-end sm:text-start">{{ item.name }}</p>
            </div>
          </div>
          <UDropdown class="sm:w-2" :items="[
              [
                {
                  label: 'Delete',
                  icon: 'i-heroicons-trash-20-solid',
                  click: () => handleDisplayDeletePrompt(item._id)
                },
                // Only show Restore option for trash items
                ...(place === 'trash' ? [{
                  label: 'Restore',
                  icon: 'i-heroicons-backward-20-solid',
                  click: () => handleDisplayRestoringPrompt(item._id)
                }] : [])
              ]
            ]" :ui="{ base: 'outline-none' }" :popper="{ arrow: true }">
              <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost" />
            </UDropdown>
          </div>
        </UCard>
      </div>
    </UContainer>
  </ClientOnly>
</template>