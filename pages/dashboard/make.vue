<script lang="ts" setup>
definePageMeta({
  middleware:'sidebase-auth'
})
const boardItems =[{
  label: 'Blank Board',
  description: 'Wall, grid, Stream',
  imgUrl: 'https://cdn.prod.website-files.com/63a02e61e7ffb565c30bcfc7/65ea99845e53084280471b71_most%20beautiful%20landscapes%20in%20the%20world.webp',
  to: '/dashboard/home'
}
]

const recipeItems = [
  {
  label: 'recipe 1',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
  },
  {
  label: 'recipe 1',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
  },
  {
  label: 'recipe 1',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
  },
  {
  label: 'recipe 1',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
  }
]
</script>
<template>
  <div class="w-screen flex flex-col items-center" :class="!$device.isMobile && 'mt-10'">
    <div class="w-[96%]">
      <MakeOptionList :items="boardItems"/>
      <MakeRecipeList :items="recipeItems" class="mt-5"/>
    </div>
  </div>
</template>


