<script lang="ts" setup>
const props = defineProps<{
  boardId: string,
  currentColor?: string
}>();
const emit = defineEmits(['update']);
const bgColor = ref(props.currentColor || '');
watch(() => props.currentColor, (newColor) => {
  if (newColor && newColor !== bgColor.value) {
    bgColor.value = newColor;
  }
}, { immediate: true });
const colorCategories = [
  {
    label: 'Background Color',
    slot: 'color',
    defaultOpen: true,
    colors: [
      'gray-50', 'gray-100', 'gray-200',
      'red-50', 'red-100', 'red-400', 'red-600', 'red-900',
      'green-400', 'green-500',
      'blue-400',
      'yellow-400', 'yellow-500',
      'purple-400', 'purple-500'
    ]
  }
];
const changeColor = (color: string) => {
  bgColor.value = color
  emit('update', color);
}

</script>
<template>
  <div class="p-4">
    <UAccordion :items="colorCategories" default-open>
      <template v-for="category in colorCategories" #[category.slot]="{ item, open }">
        <div class="grid grid-cols-5 gap-2 p-2">
          <div v-for="color in item.colors" :key="color"
            :class="`bg-${color} w-12 h-12 rounded-md cursor-pointer hover:ring-2 hover:ring-offset-2 
            hover:ring-${color.split('-')[0]}-500 ${bgColor === color ? 'ring-2 ring-offset-2 ring-' + color.split('-')[0] + '-500' : ''}`"
            @click="changeColor(color)"></div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
