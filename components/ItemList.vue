<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ background: string, name: string, _id:string }>
}>();
console.log(props.items)
const navigateBoard =(boardId:string)=>{
  navigateTo(`/board?boardId=${boardId}`)
}
</script>
<template>
  <UContainer>
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <UCard v-for="item in items" :key="item.name" @click="navigateBoard(item._id)" class="w-full cursor-pointer">
        <div class="flex justify-between  sm:w-full sm:h-28 lg:h-30 sm:flex-col sm:items-center">
          <div class="w-10 rounded-md sm:w-full sm:h-full" :class="'bg-'+item.background"></div>
          <p class="w-full text-end sm:text-center">{{item.name}}</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>