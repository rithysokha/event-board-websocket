<script lang="ts" setup>
const props = defineProps<{
  boardId: string
}>();
const emit = defineEmits(['update']);
const background = [
  "red-400",
  "teal-400",
  "blue-500",
  "red-400",
  "teal-400",
  "blue-500"
]
const bgColor = ref('')

const saveColor = async () => {
  try {
    await fetch(`/api/board/${props.boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ background: bgColor.value })
    });
  } catch (error) {
    console.error('Error creating board:', error);
  }
}

const changeColor= (color:string) =>{
  bgColor.value=color
  saveColor()
  emit('update',color);
}

</script>
<template>
  <div class="grid grid-cols-3 gap-1 mx-1">
    <div class="h-20 w-full rounded-md cursor-pointer" v-for="color in background" :class="'bg-'+color" @click="changeColor(color)">
    </div>
  </div>


</template>
