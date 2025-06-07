<script lang="ts" setup>
const props = defineProps<{
  reaction: boolean
  commentable: boolean,
  boardFormat: string,
  post: boolean,
  boardOwner: string
}>();
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import lottie from 'lottie-web'
import deleteArt from "@/assets/delete.json"
import pointAt from "@/assets/point_at.json"

const isDeleting = ref(false)
const { data: authData, status: authStatus } = useAuth()
const maxCommentLength = 50
const isFetching = ref(true)
const comment = ref<{ [postId: string]: string }>({})
const websocketUrl = ref('')
const history = ref<{ title: string, imgPublicId: string, description: string, imgHeigh: number, imgWidth: number, id: string, postedBy: string, likes: number, commentCount: number, uuid: string, displayPhoto: string }[]>([]);
const comments = ref<{ comment: string, userDisplayName: string, postId: string, id: string, uuid: string, displayPhoto: string }[]>([]);
const route = useRoute();
const isOpenDeletePost = ref(false)
const isOpenDeleteComment = ref(false)
const postIdToDelete = ref("")
const commentIdToDelete = ref("")
const toast = useToast()
const reactionStore = useReactionStore()
const userStore = useUserStore()
const boardState = useBoardStateStore()
const imageLoaded = ref<{ [key: string]: boolean }>({});
const { socket, isConnected, connect, data, sendMessage } = useWebSocket()
const boardId = route.query.boardId as string;
const animationContainer = ref<HTMLElement | null>(null)
const isEmpty =ref(false)
if (typeof window !== 'undefined' && window.location) {
  websocketUrl.value = `/api/websocket?room=${boardId}`
}

const liveUpdatePost = async (postId: string, field: string, value: any) => {

  const index = history.value.findIndex(post => post.id === postId)
  if (index !== -1) {
    (history.value[index] as any)[field] = value
  }
}

watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    if (message.on == 'post') {
      if (message.type == 'post') {
        history.value.push({
          title: message.title,
          imgPublicId: message.imgPublicId,
          description: message.description,
          imgHeigh: message.imgHeigh,
          imgWidth: message.imgWidth,
          id: message.id,
          postedBy: message.postedBy,
          likes: 0,
          uuid: message.uuid,
          displayPhoto: message.displayPhoto,
          commentCount: 0
        });
        scrollToBottom()
      } else if (message.type == 'put') {
        liveUpdatePost(message.postId, message.field, message.value)
      } else {
        removePostFromHistory(message.postId);
      }
    } else if (message.on == 'comment') {
      if (message.type == 'post') {
        appendComment(message.postId, message.comment, message.userDisplayName, "", "", message.displayPhoto);
      } else {
        removeCommentFromHistory(message.id)
      }
    }
  } catch (error) {
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.error('Error parsing WebSocket message:', error);
  }
});
const scrollToBottom = () => {
  if(isEmpty.value){
    isEmpty.value=false
  }
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};
const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const messages = await response.json();
    history.value = messages.map((message: { title: string, imgPublicId: string, description: string, imgHeigh: number, imgWidth: number, _id: string, postedBy: string, likes: number, commentCount: string, uuid: string, displayPhoto: string }) => ({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description,
      imgHeigh: message.imgHeigh,
      imgWidth: message.imgWidth,
      id: message._id,
      postedBy: message.postedBy,
      likes: message.likes,
      uuid: message.uuid,
      displayPhoto: message.displayPhoto,
      commentCount: message.commentCount
    }));
    isFetching.value = false
  } catch (error) {
    isFetching.value = false
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.error('Error fetching message history:', error);
  }finally{
    if(history.value.length==0){
    nextTick(() => {
      isEmpty.value=true
      initAnimation(pointAt)
    })
  }
  }
};


const handleGetImage = (publicId: string, qual: string) => {
  if (publicId && publicId.length > 0) {
    const myImage = new CloudinaryImage(publicId, { cloudName: "dbiso7uht" })
      .resize(scale().width(1000))
      .delivery(quality(qual))
      .delivery(format('auto'));
    return myImage.toURL();
  }
  return '';
}

const removePostFromHistory = (postId: string) => {
  const index = history.value.findIndex(post => post.id === postId)
  if (index !== -1) {
    history.value.splice(index, 1)
  }
}

const removeCommentFromHistory = (commentId: string) => {
  const index = comments.value.findIndex(comment => comment.id === commentId)
  if (index !== -1) {
    comments.value.splice(index, 1)
  }
}

const editPost = async (postId: string, field: string, value: any) => {
  const index = history.value.findIndex(post => post.id === postId)
  sendMessage({ type: 'put', postId, on: 'post', field: field, value: value })
  liveUpdatePost(postId, field, value)
  await $fetch(`/api/board/post/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ [field]: (history.value[index] as any)[field] })
  })
}
const initAnimation = (art:any) => {
  if (animationContainer.value) {
    lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: art
    })
  }
}

const handleDeletePost = async () => {
  try {
    isDeleting.value = true
    nextTick(() => {
      initAnimation(deleteArt)
    })
    const res = await $fetch(`/api/board/post/${postIdToDelete.value}`, {
      method: 'delete'
    })
    if (res?.statusCode == 200) {
      removePostFromHistory(postIdToDelete.value)
    }
    sendMessage({ type: 'delete', on: 'post', postId: postIdToDelete.value })
    await new Promise((resolve) => setTimeout(resolve, 800));
    isOpenDeletePost.value = false
    await new Promise((resolve) => setTimeout(resolve, 500));
    isDeleting.value = false
  } catch (e) {
    console.log(e)
    isDeleting.value = false
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    isOpenDeletePost.value = false
  }
  toast.add({ title: 'Post deleted', icon: 'i-heroicons-trash' })
}

const handleDisplayDeletePrompt = (postId: string, commentId: string) => {
  try {
    postIdToDelete.value = postId
    commentIdToDelete.value = commentId
    if (postId == commentId) {
      isOpenDeletePost.value = true
    } else {
      isOpenDeleteComment.value = true
    }
  } catch (error) {
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.log(error)
  }
}
const handlePost = (message: any) => {
  history.value.push({
    title: message.title,
    imgPublicId: message.imgPublicId,
    description: message.description,
    imgHeigh: message.imageHeigh,
    imgWidth: message.imageWidth,
    id: message.id,
    postedBy: message.postedBy,
    likes: 0,
    uuid: message.uuid,
    displayPhoto: message.displayPhoto,
    commentCount: 0
  })
  boardState.setIsOpenNewPost(message.isOpenPost)
  message.type = 'post'
  message.on = 'post'
  sendMessage(message);
  scrollToBottom()
}
const handleLike = (postId: string, currentLikes: number) => {
  if (reactionStore.hasReacted(postId)) {
    editPost(postId, 'likes', currentLikes - 1)
    reactionStore.removeReaction(postId)
  } else {
    editPost(postId, 'likes', currentLikes + 1)
    reactionStore.addReaction(postId)
  }
}

const handleDeleteComment = async () => {
  try {
    isDeleting.value = true
    nextTick(() => {
      initAnimation(deleteArt)
    })
    await fetch(`/api/comment/${commentIdToDelete.value}`, {
      method: 'delete'
    })
    const index = history.value.findIndex(post => post.id === postIdToDelete.value)
    if (index !== -1) {
      editPost(postIdToDelete.value, 'commentCount', history.value[index].commentCount - 1)
    }
    sendMessage({ type: 'delete', on: 'comment', id: commentIdToDelete.value })
    await new Promise((resolve) => setTimeout(resolve, 800));
    isOpenDeleteComment.value = false
    await new Promise((resolve) => setTimeout(resolve, 500));
    isDeleting.value = false
    toast.add({ title: 'Comment deleted', icon: 'i-heroicons-trash' })

  } catch (error) {
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.log(error)
  }
}

const appendComment = (postId: string, comment: string, displayName: string, id: string, uuid: string, displayPhoto: string) => {
  comments.value.push({
    comment: comment,
    userDisplayName: displayName,
    postId: postId,
    id: id,
    uuid: uuid,
    displayPhoto: displayPhoto
  })
}

const handlePostComment = async (postId: string, currentCommentCount: number) => {
  if (userStore.displayName == '') {
    boardState.setISOpenInputName(true)
    return;
  }
  if (comment.value[postId] != '') {
    const res = await $fetch(`/api/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: comment.value[postId], userDisplayName: userStore.displayName, postId: postId, uuid: userStore.uuid, displayPhoto: userStore.displayPhoto })
    });
    appendComment(postId, comment.value[postId], userStore.displayName, res.insertedId, userStore.uuid, userStore.displayPhoto)
  }

  sendMessage({ type: 'post', on: 'comment', comment: comment.value[postId], userDisplayName: userStore.displayName, postId: postId })
  comment.value[postId] = ''
  editPost(postId, "commentCount", currentCommentCount + 1)
}
const handleOpenComment = async (postId: string) => {
  const response = await fetch(`/api/comment?postId=${postId}`)
  const comment = await response.json();
  comments.value = comment.map((comment: { comment: string, userDisplayName: string, _id: string, uuid: string, displayPhoto: string }) => ({
    comment: comment.comment,
    userDisplayName: comment.userDisplayName,
    postId: postId,
    id: comment._id,
    uuid: comment.uuid,
    displayPhoto: comment.displayPhoto
  }));
}
const handleOpenNewPost = () => {
  if (authData.value?.user && userStore.displayName.length == 0) {
    userStore.setDisplayName(authData.value.user.name)
    userStore.setDisplayPhoto(authData.value.user.image)
    boardState.setIsOpenNewPost(true)
  } else if (userStore.displayName.length != 0) {
    boardState.setIsOpenNewPost(true)
  } else {
    boardState.setISOpenInputName(true)
    boardState.setTryToPost(true)
  }
}
onMounted(() => {
  connect(`/api/websocket?room=${boardId}`)
  fetchMessageHistory();
});
</script>
<template>
  <UButton v-show="post" @click="handleOpenNewPost" size="xl" icon="i-heroicons-plus"
    class="fixed z-50 right-2 rounded-full hover:rotate-90 ease-in-out transition-all duration-300 "
    :class="$device.isMobile && authStatus == 'authenticated' ? 'bottom-12' : 'bottom-2'" />
  <UModal v-model="isOpenDeletePost">
    <div v-if="!isDeleting" class="p-4 m-4 text-center">
      <p class="font-bold mb-6">
        Are you sure to delete this post?
      </p>
      <div class="flex justify-center gap-4">
        <UButton color="white" class="w-1/4 flex justify-center" label="No" @click="isOpenDeletePost = false" />
        <UButton :loading="isDeleting" class="w-fit flex justify-center" icon="i-heroicons-trash"
          label="Yes sure!" @click="handleDeletePost" />
      </div>
    </div>
    <div v-else class="w-full flex items-center justify-center">
      <div class="w-36 h-36" ref="animationContainer"></div>
    </div>
  </UModal>
    <UModal v-model="isOpenDeleteComment">
      <div v-if="!isDeleting" class="p-4 m-4 text-center">
        <p class="font-bold mb-6">
          Are you sure to delete this item?
        </p>
        <div class="flex justify-center gap-4">
          <UButton color="white" class="w-1/4 flex justify-center" label="No" @click="isOpenDeleteComment = false" />
          <UButton :loading="isDeleting" class="flex justify-center w-fit" icon="i-heroicons-trash"
            label="Yes sure!" @click="handleDeleteComment" />
        </div>
      </div>
      <div v-else class="w-full flex items-center justify-center">
      <div class="w-36 h-36" ref="animationContainer"></div>
    </div>
    </UModal>
  <UModal v-model="boardState.isOpenNewPost">
    <BoardPost :board-id="boardId" @post-message="handlePost" />
  </UModal>
  <PostSckeleton v-if="isFetching" :board-format="boardFormat" />
  <div
    :class="boardFormat == 'Wall' ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4 mx-1' : 'columns-1 p-5 sm:p-10'"
    class=" transition-all duration-100 ">
    <div v-for="entry in history" :key="entry.title" class="mb-4 break-inside-avoid-column">
      <UCard class="flex flex-col justify-between">
        <template #header>
          <div class="flex gap-1 h-5 justify-between ">
            <div class="flex gap-1">
              <UAvatar :src="entry.displayPhoto" />
              <p class="font-bold"> {{ entry.postedBy }}</p>
            </div>
            <UDropdown :items="[
              [{
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: () => handleDisplayDeletePrompt(entry.id, entry.id)
              }]
            ]" :ui="{ base: 'outline-none' }" :popper="{ arrow: true }">
              <UButton v-show="entry.uuid == userStore.uuid || boardOwner == authData?.user.email" color="white"
                trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost" />
            </UDropdown>
          </div>
        </template>
        <p :class="entry.imgPublicId === '' ? 'text-3xl' : 'text-md'">
          {{ entry.title }}
        </p>
        <div v-if="entry.imgPublicId !== ''" class="bg-no-repeat bg-center bg-cover w-full">
          <USkeleton class="w-full rounded-md" :class="{ 'hidden': imageLoaded[entry.id] }" :style="{
            paddingBottom: `${(entry.imgHeigh / entry.imgWidth) * 100 || 56.25}%`
          }" />
          <img loading="lazy" class="rounded-md w-full object-contain" :class="{ 'opacity-0': !imageLoaded[entry.id] }"
            :src="handleGetImage(entry.imgPublicId, '80')" :alt="entry.title || 'Webboard.live'"
            @load="imageLoaded[entry.id] = true" />
        </div>
        <p>{{ entry.description }}</p>
        <template #footer>
          <div class="flex justify-between">
            <div class="flex items-center" v-if="reaction">
              <UButton @click="handleLike(entry.id, entry.likes)"
                :icon="reactionStore.hasReacted(entry.id) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                variant="ghost" />
              <p>{{ entry.likes }}</p>
            </div>
            <div v-if="commentable">
              <!-- if have comment -->
              <UChip v-if="entry.commentCount > 0" :text="entry.commentCount" size="2xl">
                <UPopover :popper="{ placement: 'bottom-end' }">
                  <UButton @click="handleOpenComment(entry.id)" icon="i-heroicons-chat-bubble-bottom-center-text"
                    variant="ghost" />
                  <template #panel>
                    <div v-for="comment in comments.filter(comment => comment.postId === entry.id)"
                      class="flex items-center w-64 gap-4">
                      <div class="flex items-center w-64 gap-4">
                        <UAvatar class="ml-1" size="sm" :src="comment.displayPhoto" />
                        <div class="mt-1 text-sm">
                          <p class="font-bold"> {{ comment.userDisplayName }} </p>
                          <p class=""> {{ comment.comment }} </p>
                        </div>
                      </div>
                      <UDropdown :items="[
                        [{
                          label: 'Delete',
                          icon: 'i-heroicons-trash-20-solid',
                          click: () => handleDisplayDeletePrompt(comment.postId, comment.id)
                        }]
                      ]" :ui="{ base: 'outline-none' }" :popper="{ arrow: true }">
                        <UButton v-show="comment.uuid == userStore.uuid || boardOwner == authData?.user.email"
                          color="white" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost" />
                      </UDropdown>
                    </div>
                    <div class="flex w-full border-2 rounded-lg">
                      <UInput v-model="comment[entry.id]" :maxlength="maxCommentLength" placeholder="Write some comment"
                        class="w-full" variant="none">
                        <template #trailing>
                          <span class="text-xs text-gray-500 dark:text-gray-400"> {{ (comment[entry.id] || '').length
                          }}/{{
                              maxCommentLength }}</span>
                        </template>
                      </UInput>
                      <UButton @click="handlePostComment(entry.id, entry.commentCount)" variant="ghost"
                        icon="i-heroicons-arrow-up-circle" />
                    </div>
                  </template>
                </UPopover>
              </UChip>
              <!-- If no comment -->
              <UPopover v-else :popper="{ placement: 'bottom-end' }">
                <UButton @click="handleOpenComment(entry.id)" icon="i-heroicons-chat-bubble-bottom-center-text"
                  variant="ghost" />
                <template #panel>
                  <div class="flex w-full border-2 rounded-lg">
                    <UInput v-model="comment[entry.id]" :maxlength="maxCommentLength" placeholder="Write some comment"
                      class="w-full" variant="none">
                      <template #trailing>
                        <span class="text-xs text-gray-500 dark:text-gray-400"> {{ (comment[entry.id] || '').length
                        }}/{{
                            maxCommentLength }}</span>
                      </template>
                    </UInput>
                    <UButton @click="handlePostComment(entry.id, entry.commentCount)" variant="ghost"
                      icon="i-heroicons-arrow-up-circle" />
                  </div>
                </template>
              </UPopover>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
  <div v-show="isEmpty" class="fixed right-0" :class="$device.isMobile?'bottom-20':'bottom-12'">
      <div class="w-40 h-40 -rotate-12 " ref="animationContainer"></div>
  </div>
</template>