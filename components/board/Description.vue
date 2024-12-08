<script setup lang="ts">
const props = defineProps<{
  boardDesc: string
  boardId: string
}>();
const emit = defineEmits(['update']);
const state = reactive({
  description : props.boardDesc as string | undefined
})

const initDesc = props.boardDesc;

const isDescChanged = computed(() => state.description !== initDesc);

const renameBoard = async () => {
  try {
    await fetch(`/api/board?boardId=${props.boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    emit('update', state.description);
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

</script>

<template>
  <UCard>
    <template #header>
      <p>Heading</p>
    </template>
    <UForm :state="state" class="space-y-4" @submit="renameBoard">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.description" />
      </UFormGroup>
      <UButton v-show="isDescChanged" type="submit">
        Done
      </UButton>
    </UForm>
  </UCard>

</template>
