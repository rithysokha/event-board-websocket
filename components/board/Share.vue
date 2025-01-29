<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update']);
const props = defineProps<{
  boardId: string
}>();
const url = `https://webboard.live/board?boardId=${props.boardId}`;
const copyToClipboard = () => {
  navigator.clipboard.writeText(url);
}
const handleOpenQr = () => {
  emit('update', true);
}
</script>
<template>
  <div class="grid grid-cols-2 grid-flow-row justify-items-center my-5 w-full">
    <div class="relative group">
      <UButton @click="copyToClipboard" size="xl" class="text-2xl sm:text-3xl hover:scale-125 transition-all duration-300"
        icon="i-heroicons-clipboard-document" variant="ghost" />
      <div
        class="whitespace-nowrap absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-200 text-black text-xs rounded-md p-1">
        Copy URL
      </div>
    </div>
    <div class="relative group">
      <UButton @click="handleOpenQr" icon="i-heroicons-qr-code" size="xl" class="text-2xl sm:text-3xl hover:scale-125 transition-all duration-300" variant="ghost" />
      <div
        class="whitespace-nowrap absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-200 text-black text-xs rounded-md p-1">
        Generate QR code
      </div>
    </div>
  </div>
</template>