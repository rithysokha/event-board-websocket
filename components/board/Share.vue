<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update']);
const props = defineProps<{
    boardId: string
  }>();
  const url = `${config.public.baseUrl}/board/${props.boardId}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  }
  const handleOpenQr= () =>{
  emit('update',true);
}
</script>
  <template>
    <p class="ml-1">
      {{ url }}
      <UButton @click="copyToClipboard" icon="i-heroicons-clipboard-document" variant="ghost"/>
    </p>
    <UButton block label="Generate QR code" @click="handleOpenQr"/>
  </template>