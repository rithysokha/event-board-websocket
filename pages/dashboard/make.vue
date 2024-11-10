<script lang="ts" setup>
const recipeItems =[{
  label: 'Item one',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
},
{
  label: 'Item two',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
}
,
{
  label: 'Item three',
  imgUrl: 'https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078',
  to: '/dashboard/home'
}

]
</script>
<template>
  <LazyMakeOptionList :items="recipeItems"/>
</template>


