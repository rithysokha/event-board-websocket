<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ label: string, imgUrl: string, to: string }>
}>();
const {data} = useAuth()
const isLoading = ref(true)
const postBody = {
  name: "My board",
  belongsTo: data.value?.user.email,
  background: "blue-400"
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
    const data = await response.json();
    await navigateTo(`/board?boardId=${data.insertedId}`)
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const onImageLoad = () => {
  if (isLoading.value === true) {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in items" @click="createBoard">
      <img :src="item.imgUrl" class="rounded-lg" alt="img" @load="onImageLoad"/>
      <p> {{ item.label }} </p>
    </UCard>
</div>
</template>