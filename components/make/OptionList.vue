<script lang="ts" setup>
const { data } = useAuth()
const backgroundList =[
  "blue-400",
  "teal-300",
  "fuchsia-400"
]
const randomIndex = Math.floor(Math.random()*backgroundList.length)
const boardBody = {
  name: "Untitled board",
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
      body: JSON.stringify(boardBody)
    });
    await navigateTo(`/board?boardId=${response.insertedId}`)
  } catch (error) {
    console.error('Error creating board:', error);
  }
};
const imageLoading = ref(true)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <UCard class="my-3" @click="createBoard">
      <div class=" hover:cursor-pointer">
        <USkeleton class="w-full rounded-md" :class="{ 'hidden': imageLoading }" :style="{
          paddingBottom: `${56.25}%`
        }" />
        <img class="w-full rounded-2xl my-2" src="https://res.cloudinary.com/dbiso7uht/image/upload/q_auto/f_auto/v1743947750/Screenshot_2025-04-06_205327_dnod8z.png" @load="imageLoading = false"  alt="webboard.live" />
        <p class="font-bold">Blank Board </p>
        <p class="text-sm">Wall, Stream </p>
      </div>
    </UCard>
  </div>
</template>