<script lang="ts" setup>
const emit = defineEmits(['update']);
const props = defineProps<{
    boardId: string
  }>();
  const url = `http://localhost:3000/board/${props.boardId}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  }
  const openQr= (isOpen:boolean) =>{
  emit('update',isOpen);
}
</script>
  <template>
    <p>
      {{ url }}
      <UButton @click="copyToClipboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
          <path d="M10 1.5v1h1a1 1 0 0 1 1 1v1h-1V3H5v1H4V3a1 1 0 0 1 1-1h1v-1h4zM4.5 0a.5.5 0 0 0-.5.5V2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-.5-.5h-7zM3 4h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
        </svg>
      </UButton>
    </p>
    <QrCode @click="openQr(true)" :width="100" :height="100" :boardId="boardId"/>
  </template>