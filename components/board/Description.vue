<script setup lang="ts">
const props = defineProps<{
  boardDesc: string
  boardId: string
}>();
const emit = defineEmits(['update']);
const state = reactive({
  description : props.boardDesc as string | undefined
})
let initDesc = props.boardDesc;
watch(() => props.boardDesc, (newDesc) => {
  if (newDesc !== undefined && newDesc !== state.description) {
    state.description = newDesc;
    initDesc = newDesc; 
  }
}, { immediate: true });
const isDescChanged = computed(() => state.description !== initDesc);

const handleChnageBoardDesc = (description: string) => {
  initDesc = description
  // @ts-expect-error
  emit('update', description.data.description);
}

</script>

<template>
  <UCard>
    <UForm :state="state" class="space-y-4" @submit="handleChnageBoardDesc">
      <UFormGroup label="Description" name="description">
        <UInput v-model="state.description" />
      </UFormGroup>
      <UButton v-show="isDescChanged" type="submit">
        Done
      </UButton>
    </UForm>
  </UCard>

</template>
