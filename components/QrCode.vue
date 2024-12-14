<script setup lang="ts">
const config = useRuntimeConfig()
const props = defineProps<{
  boardId: string
  width: number
  height: number
}>();

import { onMounted } from 'vue';
import QRCodeStyling from 'qr-code-styling';

onMounted(() => {
  const qrCode = new QRCodeStyling({
    width: props.width,
    height: props.height,
    data: `${config.public.baseUrl}/board/${props.boardId}`,
    // image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.  m.wikipedia.org%2Fwiki%2FFile%3ANpm-logo.svg&psig=AOvVaw3U9kn4Z7kjWJjsWOaX2v0-&ust=1733841491423000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPimqIX1mooDFQAAAAAdAAAAABAE",
    dotsOptions: {
      color: "#4267b2",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#e9ebef",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20
    }
  });

  const qrCodeElement = document.getElementById("qrcode");
  if (qrCodeElement) {
    qrCode.append(qrCodeElement);
  }
});
</script>
<template>
  <div class="z-50"id="qrcode"></div>
</template>

<style scoped>
#qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>