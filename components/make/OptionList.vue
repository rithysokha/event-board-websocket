<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ label: string, description: string, imgUrl: string, to: string }>
}>();
const postBody = {
  name: "my test board",
  belongsTo: "user2345678q9wetrng",
  cover: "blue-500"
}

const createBoard = async () => {
  try {
    const response = await fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    });
    console.log("Board created")
    const data = await response.json();
    console.log("ID", data.insertedId)
    navigateTo('/board') //change this to dynamic route ### data.insertedId
  } catch (error) {
    console.error('Error creating board:', error);
  }
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <UCard v-for="item in items" :key="item.to" class="my-3" @click="createBoard" >
        <div class=" hover:cursor-pointer">
          <img class="w-full rounded-2xl my-2" :src="item.imgUrl" alt="img"/>
          <p class="font-bold">{{ item.label }} </p>
          <p class="text-sm">{{ item.description }} </p>
        </div>
      </UCard>
  </div>
</template>