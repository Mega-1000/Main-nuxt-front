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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: window.location.pathname,
      page_title: 'Important Page',
      event_category: 'Important',
      event_label: 'User entered an important page',
    });
  }

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

const products = [
  {
    id: 88674,
    name: 'izoterm fasada EPS70 038 ',
    gross_selling_price_calculated_unit: 205.41,
    url_for_website: '/storage/products/izoterm_fasada_EPS70_038_1.jpg',
  },
  {
    id: 88674,
    name: 'izoterm fazada',
    gross_selling_price_calculated_unit: 234.23,
    url_for_website: '/storage/products/izoterm_fasada_EPS70_040_1.jpg',
  },
  {
    id: 88674,
    name: 'izoterm fasada 045',
    gross_selling_price_calculated_unit: 172.23,
    url_for_website: '/storage/products/izoterm_fasada_045_1.jpg',
  },
  {
    id: 88674,
    name: 'izoterm fasada 032',
    gross_selling_price_calculated_unit: 222.23,
    url_for_website: '/storage/products/izoterm_fasada_032_1.jpg',
  }
]
</script>
<template>
  <AskUserForZipCodeStyrofoams v-if="showZipCodeModal" />

  <div>
    <main>
      <section class="hero py-4 md:py-1 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div class="container mx-auto text-center">
          <h5 class="text-lg md:text-6xl font-extrabold mb-1 mt-6 md:mb-6">Płać wygodnie przy odbiorze!</h5>
        </div>
      </section>

      <div class="mx-auto w-[70%] my-6">
        <span class="font-extrabold text-2xl">
          Najpopularniejsze produkty w najlepszych cenach cenach 🔥
        </span>
        <div class="flex justify-between mt-4">
          <nuxt-link :href="`/singleProduct/${product.id}`" v-for="product in products" :key="product.id" class="flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden">
            <img :src="`https://admin.mega1000.pl${product.url_for_website}`" :alt="product.name" class="h-48 w-full object-cover">
            <div class="px-4 py-3">
              <h3 class="text-lg font-semibold text-gray-900 ">{{ product.name }}🔥</h3>
              <p class="text-red-500 font-extrabold text-2xl">{{ product.gross_selling_price_calculated_unit }}PLN/M3</p>
            </div>
          </nuxt-link>
        </div>
      </div>

      <section class="py-10 px-4 bg-gray-100">
        <div class="container mx-auto relative">
          <h2 class="text-2xl md:text-3xl font-extrabold mb-10 text-center text-emerald-500">
            Wybierz styropian z tabeli, kliknij cenę - dodasz do koszyka.<br>
            <div class="text-lg text-black mt-2">
              Oprócz znalezienia najtańszej hurtowni w Polsce która dostarczy ci ten styropian wraz z gratisowym transportem dokonamy także przetargu dla wszystkich pozostałych 50 producentów dla porównania.
            </div>
          </h2>
          <div class="loader-container" v-if="isLoading">
            <Loader :showLoader="isLoading" />
          </div>
          <iframe
              ref="priceTable"
              title="Tabelka cen styropianów"
              :src="iframeSrc"
              loading="lazy"
              :style="!isLoading ? 'height: 800px' : 'height: 1px'"
              class="w-full border-2 border-gray-200 rounded-lg shadow-lg"
              sandbox="allow-scripts allow-same-origin"
              @load="onIframeLoad"
              @error="onIframeError"
          ></iframe>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-10">
            Odbiór w jednym z 100 punktów
          </h2>
          <h4 class="text-emerald-500 font-bold text-lg">
            Kliknij na punkt aby sprawdzić dostępne w nim produkty
          </h4>
          <MagasinesMap />
        </div>
      </section>

      <section class="py-10 px-4 bg-gray-100" id="instructions">
        <div class="container mx-auto">
          <div v-html="description"></div>
        </div>
      </section>

      <section class="py-10 px-4 bg-gray-100" id="instructions">
        <div class="container mx-auto text-center flex gap-2 md:gap-4 mx-auto w-fit">
          <NuxtLink href="/100styropiany-elewacyjne/101" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany elewacyjne
          </NuxtLink>
          <NuxtLink href="/10styropiany/49" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany posadzkowe
          </NuxtLink>
          <NuxtLink href="/--30termoizolacja-fundamentow/4" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany fundamentowe
          </NuxtLink>
        </div>
      </section>

      <section class="py-20 px-4 bg-emerald-600 text-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Polecaj i oszczędzaj!</h2>
          <p class="text-lg md:text-xl mb-10">
            Zaproś znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! Proste i korzystne.
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-emerald-500 hover:bg-emerald-700 text-white font-medium py-4 px-10 rounded-full inline-block transition-colors duration-300">Sprawdź swój panel poleceń</a>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Skontaktuj się z nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">Zadzwoń</h3>
              <p class="text-gray-600">Telefon: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">Napisz</h3>
              <p class="text-gray-600">E-mail: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Co mówią klienci?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Najwyższa jakość produktów i obsługa na medal! Zakupy tutaj to czysta przyjemność."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Anna K.</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Dzięki profesjonalnemu doradztwu wybrałem idealne rozwiązanie izolacyjne. Jestem bardzo zadowolony."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Piotr W.</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Korzystam wielokrotnie i za każdym razem doświadczam rzetelności i pełnego zaangażowania. Gorąco polecam!"
              </blockquote>
              <cite class="text-gray-600 font-bold">– Tomasz Z.</cite>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<style>
* {
  scroll-behavior: smooth;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 800px; /* Taka sama wysokość jak iframe, aby uniknąć przesunięcia treści */
}
</style>
