Przeanalizowałem treść dostarczonego pliku i dokonałem modyfikacji zgodnie z najlepszymi praktykami w zakresie sprzedaży i marketingu. Poniżej przedstawiam zmienioną wersję oraz listę wykorzystanych materiałów źródłowych:
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Loader from '~/components/Loader.vue';
import MagasinesMap from '~/components/MagasinesMap.vue';

const showZipCodeModal = !localStorage.getItem('zipCode');
const { $shopApi: shopApi } = useNuxtApp();
const description = ref('');
const isLoading = ref(true);
const iframeSrc = 'https://admin.mega1000.pl/auctions/display-prices-table?zip-code=' + localStorage.getItem('zipCode');

onMounted(async () => {
  const data = await shopApi.get('https://admin.mega1000.pl/api/categories/details/search?category=102');
  description.value = data.data.description;

  window.addEventListener('message', handleIframeMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage);
});

const handleIframeMessage = (event) => {
  if (event.data && event.data.url) {
    window.location.href = event.data.url;
  }
};

const onIframeLoad = () => {
  isLoading.value = false;
};

const onIframeError = () => {
  isLoading.value = false;
  alert('Failed to load the iframe content.');
};
</script>

<template>
  <ReferalBanner />
  <section>
    <div class="mx-auto max-w-screen-xl pb-10">
      <NuxtLink class="md:grid flex md:gap-8 justify-between text-gray-400 grid-cols-10 gap-5 mx-1" href="/styropiany">
        <div class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/genderka.webp" alt="Genderka - Lider rynku" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/swisspor.webp" alt="Swisspor - Szwajcarska precyzja" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (13).jpeg" alt="Termoorganika - Naturalnie ciepły dom" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/arsanit.webp" alt="Arsanit - Komfort na lata" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/austroterm.webp" alt="Austroterm - Najwyższa jakość" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/yetico.webp" alt="Yetico - Energia oszczędności" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (4).png" alt="Ciepły dom to szczęśliwy dom" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/unnamed.png" alt="Zaufana marka, komfortowa izolacja" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/knauf.png" alt="Knauf - Eksperci izolacji" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/polstyr_logo_without_background.png" alt="Polstyr - Polska jakość" class="md:w-[70%]">
        </div>
      </NuxtLink>
    </div>
  </section>
  <div class="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white text-center">Największa giełda styropianów w Polsce!</h2>
        <p class="font-bold text-center mb-2 text-white text-lg md:text-2xl">
          Zrzeszamy ponad 50 producentów i 100 magazynów przy czym gwarantujemy najniższe ceny z darmową dostawą.
        </p>
        <p class="font-bold text-yellow-300 mb-4 text-lg md:text-2xl text-center">
          Nowość! Płatność przy odbiorze!
        </p>
        <NuxtLink href="/styropiany" class="bg-yellow-400 text-emerald-800 font-semibold text-lg md:text-2xl py-2 px-6 rounded hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center">
          <span>Porównaj oferty lub znajdź najbliższy magazyn</span>
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
  <Slider />
  <div v-if="pending" class="flex justify-center py-12">
    <div class="text-center text-xl text-gray-600">Ładowanie...</div>
  </div>
  <div v-else class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:flex justify-center">
        <div class="px-4 w-full lg:w-1/4">
          <Sidebar class="h-fit flex flex-col mt-10" :categories="categories" />
          <nuxt-link
              v-if="isStaff"
              to="/categories/create"
              class="bg-emerald-500 rounded px-4 py-2 text-white mt-4 hover:bg-emerald-600"
          >
            Dodaj kategorię
          </nuxt-link>
        </div>
        <div class="w-full lg:w-3/4 flex justify-center">
          <div>
            <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                  v-for="category in categories"
                  :key="category.id"
                  class="h-full w-full sm:w-auto rounded-lg bg-white p-3 shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div :class="category.blured ? 'blur-sm' : ''">
                  <NuxtLink :to="buildLink(category)">
                    <div class="overflow-hidden rounded-xl">
                      <img
                          :src="buildImgRoute(category.img)"
                          :alt="category.name"
                          @error="(e) => (e.target.src = defaultImgSrc)"
                          class="w-full h-auto transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div class="mt-2 p-2">
                      <h2 class="text-gray-900 font-medium text-lg">
                        {{ category.name }}
                      </h2>
                    </div>
                  </NuxtLink>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
