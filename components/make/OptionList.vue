<script lang="ts" setup>

const props = defineProps<{
  items: Array<{ label: string, description: string, imgUrl: string, to: string }>
}>();
const { data } = useAuth()
const backgroundList =[
  "blue-400",
  "teal-300",
  "fuchsia-400"
]
const randomIndex = Math.floor(Math.random()*backgroundList.length)
const postBody = {
  name: "My board",
  belongsTo: data.value?.user.email,
  background: backgroundList[randomIndex]
}

const createBoard = async () => {
  try {
    const response = await $fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    });
    await navigateTo(`/board?boardId=${response.insertedId}`)
  } catch (error) {
    console.error('Error creating board:', error);
  }
};
const isLoading = ref(true)
const onImageLoad = () => {
  if (isLoading.value === true) {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <UCard v-for="item in items" :key="item.to" class="my-3" @click="createBoard">
      <div class=" hover:cursor-pointer">
        <img class="w-full rounded-2xl my-2" :src="item.imgUrl" alt="img" @load="onImageLoad" />
        <p class="font-bold">{{ item.label }} </p>
        <p class="text-sm">{{ item.description }} </p>
      </div>
    </UCard>
  </div>
</template>