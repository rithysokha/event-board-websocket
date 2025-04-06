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

let initName = props.boardName;
watch(() => props.boardName, (newDesc) => {
  if (newDesc !== undefined && newDesc !== state.name) {
    state.name = newDesc;
    initName = newDesc; 
  }
}, { immediate: true });

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  return errors
}

const isNameChanged = computed(() => state.name !== initName);
const renameBoard = async () => {
    emit('update', state.name);
    initName = state.name as string;
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
