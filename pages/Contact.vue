<script setup>
const phone = usePhone();
</script>

<template>
  <div class="flex pt-20 xl:pt-40">
    <div class="m-auto">
      <ContactForm v-if="phone !== null" />
      <ContactPhoneContactForm v-else />
    </div>
  </div>
</template>
