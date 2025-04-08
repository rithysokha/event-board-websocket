<script lang="ts" setup>
defineProps<{
  boardFormat: string
}>();
const history = [
  {
    id: 1,
    image:false,
    height:9
  },
  {
    id: 2,
    image:true,
    height:19
  },
  {
    id: 3,
    image:true,
    height:8
  },
  {
    id: 4,
    image:false,
    height:9
  },
  {
    id: 5,
    image:false,
    height:15
  },
  {
    id: 6,
    image:true,
    height:12
  },
  {
    id: 7,
    image:true,
    height:7
  },
  {
    id: 8,
    image:false,
    height:10
  },
  {
    id: 9,
    image:false,
    height:11
  },
  {
    id: 5,
    image:false,
    height:12
  }
]
</script>
<template>
  <div
    :class="boardFormat == 'Wall' ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4 mx-1' : 'columns-1 p-5 sm:p-10'">
    <div v-for="entry in history" :key="entry.id" class="mb-4 break-inside-avoid-column">
      <UCard class="flex flex-col justify-between">
        <template #header>
          <div class="flex gap-1 h-5 justify-between ">
            <div class="flex gap-1 items-center">
              <USkeleton class="h-9 w-9" :ui="{ rounded: 'rounded-full' }" />
              <USkeleton class="h-4 w-20" />
            </div>
          </div>
        </template>
        <div class="w-full">
          <USkeleton class="h-4 w-48 mb-2" />
          <USkeleton v-if="entry.image" class="rounded-md w-full max-h-[80vh] object-contain" :style="{ minHeight: `${entry.height}rem` }"  />
        </div>
        <USkeleton class="h-4 w-48 mt-2" />
        <template #footer>
          <div class="flex justify-between">
            <div class="flex items-center">
              <UButton disabled icon="i-heroicons-heart" variant="ghost" />
            </div>
            <div>
              <UButton disabled icon="i-heroicons-chat-bubble-bottom-center-text" variant="ghost" />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
