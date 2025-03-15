<script lang="ts" setup>
import lottie from 'lottie-web'
import facebook from "../assets/facebook .svg";
import x from "../assets/twitter.svg";
import youtube from "../assets/youtube.svg";
import instagram from "../assets/instagram.svg";
import globe from "../assets/global.json"

const animationContainer = ref<HTMLElement | null>(null)
const languages = [
  {
    name:'English',
    value:'en'
  },
  {
    name:'Khmer',
    value:'km'
  }
]

const language = ref(languages[0])

const socials = [
  {
    id: 1,
    name: 'Facebook',
    icon: facebook,
    value: 'tel:+855 968 325 154',
    placeHolder: 'Facebook'
  },
  {
    id: 2,
    name: 'Youtube',
    icon: youtube,
    value: 'tel:+855 968 325 154',
    placeHolder: 'Youtube'
  },
  {
    id: 3,
    name: 'X',
    icon: x,
    value: 'tel:+855 968 325 154',
    placeHolder: 'X(Twitter)'
  },
  {
    id: 4,
    name: 'Instagarm',
    icon: instagram,
    value: 'tel:+855 968 325 154',
    placeHolder: 'Instagram'
  },
]
onMounted(() => {
  if (animationContainer.value) {
    lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: globe
    })
  }
})

</script>
<template>
  <div class="w-screen h-52 flex flex-col items-center my-10">
    <div class="flex items-center gap-2">
      <p class="text-2xl font-bold ">Webboard</p>
      <img src="../assets/board.png" alt="Web board" class="w-8" />
    </div>
    <p class="text-center">Oh wow, you're beautiful. <br> Just saying...</p>
    <div class=" w-2/3 ">
      <div class="grid grid-cols-4  my-5 w-full lg:w-[70vw] justify-items-center">
        <div v-for="social in socials" :key="social.id" class="relative group">
          <a :href="social.value">
            <img class="w-7 text-2xl sm:text-3xl hover:scale-125 transition-all duration-300" :src="social.icon" :alt="social.placeHolder" />
          </a>
          <div
            class="whitespace-nowrap absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-200 text-black text-xs rounded-md p-1">
            {{ social.placeHolder }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="h-8 w-8" ref="animationContainer"></div>
      <USelect variant="none" v-model="language" :options="languages" option-attribute="name" />
    </div>
  </div>
</template>