<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
  name: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log(event.data)
}
</script>

<template>
  <UCard>
    <template #header>
      <p>Heading</p>
    </template>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UButton type="submit">
        Done
      </UButton>
    </UForm>
  </UCard>

</template>
