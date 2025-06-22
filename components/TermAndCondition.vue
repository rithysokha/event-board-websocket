<script lang="ts" setup>
const termsAndConditions = [
  {
    header: "1. User Accounts",
    points:[
      "You are responsible for maintaining the confidentiality of your account and password.",
      "You agree not to share your login credentials with others.",
      "Your profile picture and username will be visible to public"
    ]
  },
  {
    header: "2. Content and Conduct",
    points:[
      "You are responsible for any content( text, image, link, etc.) of you and your guests post",
      "Do not post hate speech, harashment or threats",
      "Do not post pnographic or violate material",
      "Do not post copyrighted or illegal content",
      "We reserve the right to remove any content that violates these rules without notice."
    ]
  },
  {
    header: "3. Moderation and Suspension",
    points:[
      "We reserve the right to warn, suspend, or permanently ban user who violate the rules or disrupt the community."
    ]
  }
]
</script>
<template>
  <div v-for="terms in termsAndConditions" class="p-2">
     <p class="text-lg font-bold">{{terms.header}}</p>
     <div v-for="term in terms.points">
      <div class="flex items-start gap-1">
        *
        <p>{{ term }} </p>
      </div>
     </div>
  </div>
</template>