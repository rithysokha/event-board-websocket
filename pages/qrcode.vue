<template>
  <div id="qrcode"></div>
</template>

<script>
import QRCodeStyling from 'qr-code-styling';

export default {
  name: "QrCode",
  mounted() {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: "https://youtu.be/qReulBcm3Og?si=XIMICHNHU3wIsbG9",
      // image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.m.wikipedia.org%2Fwiki%2FFile%3ANpm-logo.svg&psig=AOvVaw3U9kn4Z7kjWJjsWOaX2v0-&ust=1733841491423000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPimqIX1mooDFQAAAAAdAAAAABAE",
      dotsOptions: {
        color: "#4267b2",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#e9ebee",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
      }
    });

    qrCode.append(document.getElementById("qrcode"));
  }
};
</script>

<style scoped>
#qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>