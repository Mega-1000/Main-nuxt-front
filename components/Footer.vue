<script setup>
const zipCode = ref('');
const zipCodeChangeModalShown = ref(false);

onMounted(() => {
  zipCode.value = localStorage.getItem('zipCode');
});
</script>

<template>
  <footer class="z-20 mt-10 p-2 w-full bg-slate-100 border-t border-gray-200 shadow md:flex md:items-center md:justify-between">
    <span class="text-xs md:text-sm text-gray-500 sm:text-center">
      EPH - ELEKTRONICZNA PLATFORMA HANDLOWA POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ SP. z o. o. 15A 55-200 OLAWA NIP: 8971930266 Wszystkie prawa zastrzeżone.
    </span>
    <div @click="zipCodeChangeModalShown = true" v-if="zipCode && !zipCodeChangeModalShown" class="cursor-pointer">
      Zmień swój kod pocztowy, aktualnie: {{ zipCode }}
    </div>
  </footer>

  <AskUserForZipCodeStyrofoarms v-if="zipCodeChangeModalShown" />
</template>
