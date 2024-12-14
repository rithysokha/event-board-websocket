<script setup lang="ts">
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const publicId = "j170l8f7vi5bj27mtldv";
const myImage = new CloudinaryImage(publicId, { cloudName: 'dbiso7uht' })
      .resize(scale().width(1000))
      .delivery(quality('auto'))
      .delivery(format('auto'));

    console.log('Cloudinary Image URL:', myImage.toURL());


</script>
<template>

  <div>
    hi
  </div>
</template>
