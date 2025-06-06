<script setup>
const { data } = await useFetch("/api/user")
const toast = useToast()
const columns = [
  { key: 'avatar', label: 'Profile' },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username/Email' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Action', class: 'w-24' }
]

const items = row => [
  [{
    label: 'Change role to ' + (row.role === 'admin' ? 'user' : 'admin'),
    icon: 'i-heroicons-pencil-square',
    class: 'transition-colors duration-200',
    click: () => handleChangeRole(row._id, row.role)
  }]
]
const handleChangeRole = async(id, role) =>{
  try{
    let newRole = role==='admin'?'user':'admin';
    await $fetch(`/api/user/${id}`, {
      //@ts-expect-error
      method: 'PUT',
      body: JSON.stringify({role:newRole})
    })
    const index = data.value.findIndex(user => user._id === id)
  if (index !== -1) {
    (data.value[index]).role = newRole
  }
  }catch(error){
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.log(error)
  }
}
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
