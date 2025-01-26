<script setup lang="ts">
definePageMeta({
  auth: { 
    unauthenticatedOnly: true, 
    navigateAuthenticatedTo: '/dashboard/home' }
})
const { signIn } = useAuth()
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

const loginForm = reactive({ username: '', password: ''})
const signUpForm = reactive({ username: '', password: '', confirmPassword: '' })
const errorMessage = ref('')
const loading = ref(false)

const onSubmit = async (form: any) => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await signIn('credentials', {
      redirect: false, // Prevents automatic redirection
      username: loginForm.username,
      password: loginForm.password,
    });

    if (response.error) {
      errorMessage.value = 'Invalid username or password.';
    } else {
      window.location.href = '/dashboard/home';
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
};
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
          <UFormGroup label="Username" name="username">
            <UInput v-model="loginForm
          .username" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="loginForm
          .password" type="password"/>
          </UFormGroup>
        </div>
        <div v-else-if="item.key === 'signup'" class="space-y-3">
          <UFormGroup label="Username" name="username" required>
            <UInput v-model="signUpForm
          .username" type="text" required />
          </UFormGroup>
          <UFormGroup label="Password" name="password" required>
            <UInput v-model="signUpForm
          .password" type="password" required />
          </UFormGroup>
          <UFormGroup label="Confirm Password" name="conPassword" required>
            <UInput v-model="signUpForm
          .confirmPassword" type="password" required />
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
        <UButton block @click="signIn('google')">
          <img :src="googleIcon" class="w-5" alt="google logo, webboard"/>
          <p>Continue with google</p>
        </UButton>
      </div>
    </template>
  </UTabs>
</div>
</template>

