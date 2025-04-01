<template>
  <div class="px-5 sm:w-3/4 lg:w-1/2">
    <UAccordion
    color="primary"
    variant="soft"
    size="sm"
    :items="[
      { 
        label: '1. What is Webboard?', 
        content: 'Webboard is a platform that let you host a board for people who join your event be able to post picture/status and communicate via comment.' 
      }, 
      { 
        label: '2. Getting Started', 
        content: 'By just click on create new board, login or sign up' 
      }, 
      { 
        label: '3. Is this free?', 
        content: 'Yes absoltely' 
      }, 
      { 
        label: '4. How to sign up?', 
        content: 'You can click sign up and then continue with google or create a new account' 
      }
      ]"
    />
  </div>
</template>