<script lang="ts" setup>
const boardItems =[{
  label: 'Blank Board',
  description: 'Wall, grid, Stream',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
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
  <MakeOptionList :items="boardItems"/>
  <LazyMakeRecipeList :items="recipeItems" class="mt-5"/>
</template>


