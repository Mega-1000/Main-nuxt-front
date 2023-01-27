<script setup>
import PhoneContactForm from "~~/components/contact/PhoneContactForm.vue";

const phone = usePhone();
</script>

<template>
  <div class="flex pt-20 xl:pt-40">
    <div class="m-auto">
      <ContactForm v-if="phone !== null" />
      <PhoneContactForm v-else />
    </div>
  </div>
</template>
