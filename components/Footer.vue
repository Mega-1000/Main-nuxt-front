<script setup>
const zipCode = ref('');
const zipCodeChangeModalShown = ref(false);

onMounted(() => {
  zipCode.value = localStorage.getItem('zipCode');
});
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 z-20 p-2 w-full bg-slate-100 border-t border-gray-200 shadow md:flex md:items-center md:justify-between"
  >
    <span class="text-xs md:text-sm text-gray-500 sm:text-center"
      >EPH - ELEKTRONICZNA PLATFORMA HANDLOWA IWASZKIEWICZA 15A 55-200 OLAWA
      NIP: 9121027907 Wszystkie prawa zastrzeżone.
    </span>
  </footer>

  <div class="fixed bottom-0 z-30 right-20 p-5 rounded-t-xl cursor-pointer bg-blue-500" @click="zipCodeChangeModalShown = true" v-if="zipCode && !zipCodeChangeModalShown">
    Zmień swój kod pocztowy
  </div>

  <AskUserForZipCodeStyrofoarms v-if="zipCodeChangeModalShown" />
</template>
