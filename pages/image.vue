<script lang="ts" setup>
const props = defineProps<{
  boardId: string
}>();
const isUploadingPhoto = ref(false);
const emit = defineEmits(['postMessage']);
const postBody = ref({
  title: '',
  description: '',
  boardId: '',
  imgPublicId: ''
});

const handleUploadFile = async (event: any) => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error('No file selected');
    return;
  }
  isUploadingPhoto.value = true; // Mark as uploading
  const file = files[0];
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res: { public_id: string } = await $fetch('/api/image', {
      method: 'POST',
      body: formData,
    });
    postBody.value.imgPublicId = res.public_id;
  } catch (error) {
    console.error('Upload Error:', error);
  } finally {
    isUploadingPhoto.value = false; // Upload process finished
  }
};

const savePostToDB = async () => {
  try {
    postBody.value.boardId = props.boardId;
    await fetch('api/board/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody.value),
    });
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const sendData = async () => {
  if (isUploadingPhoto.value) {
    console.log('Waiting for file upload to finish...');
    while (isUploadingPhoto.value) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Polling interval
    }
  }
  const message = {
    title: postBody.value.title,
    imgPublicId: postBody.value.imgPublicId,
    description: postBody.value.description,
  };
  emit('postMessage', message);
  await savePostToDB();
  postBody.value.title = '';
  postBody.value.imgPublicId = '';
  postBody.value.description = '';
};
</script>
