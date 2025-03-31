<script setup lang="ts">
import type { FormError} from '#ui/types'
const props = defineProps<{
  boardName: string
  boardId: string
}>();
const emit = defineEmits(['update']);
const state = reactive({
  name : props.boardName as string | undefined
})

const initName = props.boardName;
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  return errors
}

const isNameChanged = computed(() => state.name !== initName);
const renameBoard = async () => {
  try {
    await fetch(`/api/board/${props.boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    emit('update', state.name);
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

</script>

<template>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="renameBoard">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UButton v-show="isNameChanged" type="submit">
        Done
      </UButton>
    </UForm>
</template>
