<script setup lang="ts">
import icon from '../assets/board.svg'
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
    data: `${config.public.baseUrl}/board/?boardId=${props.boardId}`,
    image: icon,
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
  <div class="z-50 flex justify-center"id="qrcode"></div>
</template>