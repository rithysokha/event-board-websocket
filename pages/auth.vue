<script setup lang="ts">
import googleIcon from "../assets/google.svg";
const items = [{
  key: 'login',
  label: 'Log In',
  description: 'Input your email and password or continue with Google.'
}, {
  key: 'signup',
  label: 'Sign Up',
  description: 'Change your signup here. After saving, you\'ll be logged out.'
}]

const loginForm = reactive({ email: '', password: ''})
const signUpForm = reactive({ currentPassword: '', newPassword: '' })

function onSubmit(form: any) {
  console.log('Submitted form:', form)
}
</script>

<template>
  <div class="p-2">
  <UTabs :items="items" class="w-full">
    <template #item="{ item }">
      <UCard @submit.prevent="() => onSubmit(item.key === 'login' ? loginForm
       : signUpForm
      )">
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>

        <div v-if="item.key === 'login'" class="space-y-3">
          <UFormGroup label="Email" name="email">
            <UInput v-model="loginForm
          .email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="loginForm
          .password" type="password"/>
          </UFormGroup>
        </div>
        <div v-else-if="item.key === 'signup'" class="space-y-3">
          <UFormGroup label="Current Sign Up" name="current" required>
            <UInput v-model="signUpForm
          .currentPassword" type="signup" required />
          </UFormGroup>
          <UFormGroup label="New Sign Up" name="new" required>
            <UInput v-model="signUpForm
          .newPassword" type="signup" required />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton type="submit">
              {{ item.key === 'login' ? 'login' : 'signup' }}
            </UButton>
          </div>
        </template>
      </UCard>
      <div class="pt-10">
        <UButton block>
          <img :src="googleIcon" class="w-5" alt="google logo, webboard"/>
          <p>Continue with google</p>
        </UButton>
      </div>
    </template>
  </UTabs>
</div>
</template>

