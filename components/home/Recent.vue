<script setup lang="ts">

const items = [
  {
    "id":1,
    "picture_url":"",
    "title":"My title"
  },
  {
    "id":2,
    "picture_url":"",
    "title":"Title"
  },
  {
    "id":3,
    "picture_url":"",
    "title":"Title"
  }
]

</script>
<template>
<HomeItemList :items="items"/>
</template>

