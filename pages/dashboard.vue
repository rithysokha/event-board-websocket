<script setup lang="ts">
import Home from '~/components/tabs/Home.vue';
import Make from '~/components/tabs/Make.vue';

const items = [{
  key: 'home',
  label: 'Home'
}, {
  key: 'make',
  label: 'Make',
},
{
  key: 'profile',
  label: 'Profile',
}]
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #item="{ item }">
      <UCard>
        <template>
        </template>
        <div v-if="item.key === 'home'">
          <Home/>
        </div>
        <div v-else-if="item.key === 'make'">
          <Make/>
        </div>
        <div v-else-if="item.key === 'profile'">
        <Profile/>
        </div>
      </UCard>
    </template>
  </UTabs>
</template>

