<script lang="ts" setup>
import imageCompression from 'browser-image-compression';
const props = defineProps<{
  boardId: string
}>();
const isUploadingPhoto = ref(false)
const isSendingData = ref(false)
const emit = defineEmits(['postMessage']);
const postBody = ref({
  title: '',
  description: '',
  boardId: '',
  imgPublicId: ''
})

const handleUploadFile = async (event: any) => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error('No file selected');
    return;
  }

  isUploadingPhoto.value = true;
  const file = files[0];

  if (file.size > 1048576) {
    console.log('File is larger than 1MB, compressing...');

    // Compression options
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log('Compression successful:', compressedFile);

      await uploadFile(compressedFile);
    } catch (error) {
      console.error('Compression Error:', error);
      isUploadingPhoto.value = false;
      return;
    }
  } else {
    await uploadFile(file);
  }
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res: { public_id: string } = await $fetch('/api/image', {
      method: 'POST',
      body: formData,
    });
    postBody.value.imgPublicId = res.public_id;
    console.log('File uploaded successfully:', res.public_id);
  } catch (error) {
    console.error('Upload Error:', error);
  } finally {
    isUploadingPhoto.value = false;
  }
};

const savePostToDB = async () => {
  try {
    postBody.value.boardId = props.boardId
    await fetch('api/board/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody.value)
    });
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const sendData = async () => {
  isSendingData.value=true
  if (isUploadingPhoto.value) {
    console.log('Waiting for file upload to finish...');
    while (isUploadingPhoto.value) {
      await new Promise((resolve) => setTimeout(resolve, 100)); 
    }
  }
  const message = {
    title: postBody.value.title,
    imgPublicId: postBody.value.imgPublicId,
    description: postBody.value.description,
    isOpenPost:false
  };
  emit('postMessage', message);
  savePostToDB();
  isSendingData.value=false
  postBody.value.title = '';
  postBody.value.imgPublicId = '';
  postBody.value.description = '';
}
</script>
<template>
  <div class="p-4 flex flex-col gap-2">
    <UButton class="w-20 relative" :loading="isUploadingPhoto||isSendingData" type="submit" @click="sendData">Submit</UButton>
    <UInput v-model="postBody.title" />
    <div class=" w-20 h-20">
      <input type="file" @change="handleUploadFile" />
    </div>
    <UInput v-model="postBody.description" />
  </div>
</template>
