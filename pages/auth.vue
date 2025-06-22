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
import art from "../assets/auth.json"
import Joi from "joi";
import CryptoJS from 'crypto-js';

const isLoadingBtn = ref(false)
const isLoadingBtnGoogle = ref(false)
const isLoading = ref(true)
const animationContainer = ref<HTMLElement | null>(null)
const toast = useToast()
const showTermsModal = ref(false)
const isShaking = ref(false)

const { signIn } = useAuth()
const items = [{
  key: 'login',
  label: 'Log In',
  description: 'Input your email and password or continue with Google.'
}, {
  key: 'signup',
  label: 'Sign Up',
  description: 'Continue with google for easy access,'
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
      'any.required': 'Password is required',
       'any.only': 'Passwords must match'
    }),
  termAndCondition: Joi.boolean().valid(true).required()
    .messages({
      'boolean.false': 'Please accept terms and conditions'
    })
});

const loginForm = reactive({ isLogin: true, email: undefined, password: '' })
const signUpForm = reactive({ isLogin: false, email: undefined, password: '', confirmPassword: '', termAndCondition: false })

const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString()
}

const shakeTermsAndConditions = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 600) 
}

const onSubmit = async (form: any) => {
  isLoadingBtn.value = true
  try {
    if (form.isLogin) {
      const hashedPassword = hashPassword(loginForm.password)
      await signIn('credentials', {
        email: loginForm.email,
        password: hashedPassword,
      });
    } else {
      if(!signUpForm.termAndCondition){
        shakeTermsAndConditions()
        toast.add({
          title: 'Please agree to terms and condition before sign up', icon:'i-heroicons-exclamation-circle', color:'red'
        })
        return;
      }
      const hashedPassword = hashPassword(signUpForm.password)
      const hashedCfPassword = hashPassword(signUpForm.confirmPassword)
      const result = await $fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
        { isLogin: false, email: signUpForm.email, password: hashedPassword, confirmPassword: hashedCfPassword, termAndCondition: signUpForm.termAndCondition}
        )
      });
      if (result) {
        await signIn('credentials', {
          email: signUpForm.email,
          password: hashedCfPassword,
        });
      }
    }
  } catch (error) {
    toast.add({ title: 'Username already taken', icon: 'i-heroicons-exclamation-circle', color: 'red' })
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
                <UForm :schema="loginSchema" :state="loginForm" class=" flex flex-col gap-2">
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
                <UForm :schema="signUpSchema" :state="signUpForm" class=" flex flex-col gap-2">
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
                  <UFormGroup ref="shakeTermsRef"
                :class="{ 'shake-animation': isShaking }">
                    <UCheckbox required v-model="signUpForm.termAndCondition">
                      <template #label>
                        <span class="text-sm">
                          I agree to
                          <button type="button" class="text-primary-500 hover:text-primary-600 underline font-medium"
                            @click="showTermsModal = true">
                            terms and conditions
                          </button>
                        </span>
                      </template>
                    </UCheckbox>
                  </UFormGroup>
                </UForm>
              </ClientOnly>
            </div>
            <template #footer>
              <div class="flex justify-center">
                <UButton type="submit" :loading="isLoadingBtn">
                  {{ item.key === 'login' ? 'Login' : 'Signup' }}
                </UButton>
              </div>
            </template>
          </UCard>
          <div class="pt-10">
            <UButton block @click="hadleGoogleSignIn" :loading="isLoadingBtnGoogle">
              <img :src="googleIcon" class="w-5" alt="google logo, webboard" />
              <p>Continue with Google</p>
            </UButton>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
  <UModal v-model="showTermsModal">
    <div class="w-full h-full flex flex-col items-center">
      <TermAndCondition/>
      <UButton label="OK" @click="showTermsModal = false" class="w-fit"/>
    </div>
  </UModal>
</template>
<style>
@keyframes shake {
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
}

.shake-animation {
  animation: shake 0.6s ease-in-out;
}
</style>