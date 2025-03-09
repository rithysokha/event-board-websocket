<script setup lang="ts">
import icon from '../assets/board.svg'
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
    data: `https://webboard.live/board?boardId=${props.boardId}`,
    image: icon,
    dotsOptions: {
      color: "#16b0e2",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#ffffff",
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