<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard/home'
  },
  middleware: 'transition',
  pageTransition: {}
})
import googleIcon from "../assets/google.svg";
import lottie from 'lottie-web'
import art from "../assets/user_research.json"
import Joi from "joi";

const isLoadingBtn = ref(false)
const isLoadingBtnGoogle = ref(false)
const isLoading = ref(true)
const animationContainer = ref<HTMLElement | null>(null)

const { signIn } = useAuth()
const items = [{
  key: 'login',
  label: 'Log In',
  description: 'Input your email and password or continue with Google.'
}, {
  key: 'signup',
  label: 'Sign Up',
  description: 'Recommend continue with google for easy access,'
}]

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'Username is not allowed to be empty',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  })
});

const signUpSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'Username is not allowed to be empty',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().min(8).required()
    .valid(Joi.ref('password'))
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
});

const loginForm = reactive({ isLogin: true, email: undefined, password: undefined })
const signUpForm = reactive({ isLogin: false, email: undefined, password: undefined, confirmPassword: undefined })
const errorMessage = ref('')

const onSubmit = async (form: any) => {
  errorMessage.value = '';
  isLoadingBtn.value = true
  try {
    if (form.isLogin) {
      await signIn('credentials', {
        email: loginForm.email,
        password: loginForm.password,
      });
    } else {
      const result = await $fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpForm)
      });
      if (result) {
        await signIn('credentials', {
          email: signUpForm.email,
          password: signUpForm.password,
        });
      }
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred.';
  } finally {
    isLoadingBtn.value = false
  }
};

const hadleGoogleSignIn = () => {
  isLoadingBtnGoogle.value = true
  signIn('google')
}
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
</script>

<template>
  <div class="p-2 md:grid md:grid-cols-2 md:h-screen">
    <div class="hidden md:flex md:justify-center md:items-center">
      <USkeleton class="h-2/5 w-4/6 lg:h-3/5 lg:w-5/6 rounded-md" v-show="isLoading" />
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
              <ClientOnly>
                <UForm :schema="loginSchema" :state="loginForm">
                  <UFormGroup label="Username" name="email">
                    <UInput v-model="loginForm
                      .email" />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password">
                    <UInput v-model="loginForm
                      .password" type="password" />
                  </UFormGroup>
                </UForm>
              </ClientOnly>
            </div>
            <div v-else-if="item.key === 'signup'" class="space-y-3">
              <ClientOnly>
                <UForm :schema="signUpSchema" :state="signUpForm">
                  <UFormGroup label="Username" name="email" required>
                    <UInput v-model="signUpForm
                      .email" type="text" required />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password" required>
                    <UInput v-model="signUpForm
                      .password" type="password" required />
                  </UFormGroup>
                  <UFormGroup label="Confirm Password" name="confirmPassword" required>
                    <UInput v-model="signUpForm
                      .confirmPassword" type="password" required />
                  </UFormGroup>
                </UForm>
              </ClientOnly>
            </div>
            <template #footer>
              <div class="flex justify-center">
                <UButton type="submit" :loading="isLoadingBtn">
                  {{ item.key === 'login' ? 'login' : 'signup' }}
                </UButton>
              </div>
            </template>
          </UCard>
          <div class="pt-10">
            <UButton block @click="hadleGoogleSignIn" :loading="isLoadingBtnGoogle">
              <img :src="googleIcon" class="w-5" alt="google logo, webboard" />
              <p>Continue with google</p>
            </UButton>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
