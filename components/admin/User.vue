<script setup>
const {data} = await useFetch("/api/user")
const columns = [
    { key: 'avatar', label: 'Profile' },
    { key: 'name', label: 'Name' }, 
    { key: 'username', label: 'Username/Email' }, 
    { key: 'role', label: 'Role' },
    {key: 'actions'}
]

const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    class: 'transition-colors duration-200',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'block',
    icon: 'i-heroicons-no-symbol',
    class: 'transition-colors duration-100'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    class: 'hover:text-white : hover:bg-red-500 transition-colors duration-200'
  }]
]
</script>

<template>
  <UTable :rows="data" :columns="columns"
  :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
    <template #avatar-data="{ row }">
      <UAvatar :src="row.image" :alt="row.name" size="md" />
    </template>
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
  </UTable>
</template>

