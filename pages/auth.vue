<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard/home'
  }
})
import lottie from 'lottie-web'
import art from "../assets/user_research.json"
const isLoading = ref(true)
const credentials = { username: 'jsmith', password: 'hunter2' }
const animationContainer = ref<HTMLElement | null>(null)
onMounted(() => {
  if (animationContainer.value) {
    const animation = lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: art
    })
    animation.addEventListener('DOMLoaded', () => {
      isLoading.value = false
    })
  }
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

const loginForm = reactive({ username: '', password: '' })
const signUpForm = reactive({ username: '', password: '', confirmPassword: '' })
const errorMessage = ref('')
const loading = ref(false)

const onSubmit = async (form: any) => {
  errorMessage.value = '';
  loading.value = true;
  try {
   await signIn('credentials', {
      redirect: false,
      username: loginForm.username,
      password: loginForm.password,
    });
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-2 md:grid md:grid-cols-2 md:h-screen">
    <div class="hidden md:flex md:justify-center md:items-center" >
    <USkeleton class="h-2/5 w-4/6 lg:h-3/5 lg:w-5/6 rounded-md" v-show="isLoading"/>
    <div v-show="!isLoading" class=" h-3/4 w-4/5 lg:h-full lg:w-full " ref="animationContainer"></div>
    </div>
    <div class="flex md:justify-end md:items-center sm:mr-12 md:mr-24 ">
    <UTabs :items="items" class="w-full md:max-w-96">
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
                .password" type="password" />
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
            <img :src="googleIcon" class="w-5" alt="google logo, webboard" />
            <p>Continue with google</p>
          </UButton>
        </div>
      </template>
    </UTabs>
  </div>
  </div>
</template>
