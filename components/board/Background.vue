<script lang="ts" setup>
const props = defineProps<{
  boardId: string
}>();
const emit = defineEmits(['update']);
const background = [
  "slate-100",
  "slate-300",
  "red-200",
  "red-400",
  "teal-200",
  "teal-400"
]
const bgColor = ref('')

const saveColor = async () => {
  try {
    await fetch(`/api/board?boardId=${props.boardId}`, {
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
<div class="h-10 w-10" v-for="color in background" :class="'bg-'+color" @click="changeColor(color)">
</div>


</template>
