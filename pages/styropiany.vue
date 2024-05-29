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
  const data = await shopApi.get(`https://admin.mega1000.pl/api/categories/details/search?category=102`);
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
  <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
  <div>
    <main>
      <section class="hero py-4 md:py-1 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div class="container mx-auto text-center">
          <h5 class="text-lg md:text-6xl font-extrabold mb-1 mt-6 md:mb-6">Teraz zapłacisz również przy odbiorze!</h5>
        </div>
      </section>

      <section class="py-10 px-4 bg-gray-100">
        <div class="container mx-auto relative">
          <h2 class="text-2xl md:text-3xl font-extrabold mb-10 text-center text-blue-500">
            Wybierz rodzaj styropianu z tabeli dla wybranego producenta i kliknij cenę aby dodać koszyka. <br>
            <div class="text-lg text-black mt-2">
              Oprócz znalezienia najtańszej hurtowni w Polsce  która dostarczy ci ten styropian wraz z gratisowym transportem dokonamy także przetargu dla wszystkich pozostałych 50 producentów dla porównania.
            </div>
          </h2>
          <Loader :showLoader="isLoading" />
          <iframe
              ref="priceTable"
              title="Tabelka cen styropianów"
              :src="iframeSrc"
              loading="lazy"
              style="height: 800px"
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
            Odbierz swoje zamówienie w jednym z 100 punktów odbioru
          </h2>
          <h4 class="text-blue-500">
            Kliknij na punkt aby wyślwietlić dostępne w nim styropiany
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
          <NuxtLink href="/100styropiany-elewacyjne/101" class="bg-blue-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany elewacyjne
          </NuxtLink>
          <NuxtLink href="/10styropiany/49" class="bg-blue-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany posadzkowe
          </NuxtLink>
          <NuxtLink href="/--30termoizolacja-fundamentow/4" class="bg-blue-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany fundamentowe
          </NuxtLink>
        </div>
      </section>

      <section class="py-20 px-4 bg-blue-600 text-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Zarabiaj przez polecanie!</h2>
          <p class="text-lg md:text-xl mb-10">
            Zaprosić znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! To proste i przyjemne.
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-4 px-10 rounded-full inline-block transition-colors duration-300">Zobacz swój panel polecania</a>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Skontaktuj się z Nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">Kontakt Telefoniczny</h3>
              <p class="text-gray-600">Zadzwoń: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">E-mail</h3>
              <p class="text-gray-600">Napisz na: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Opinie Klientów</h2>
          <div class="grid grid-cols-1md:grid-cols-3 gap-8">
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Firma oferuje produkty wysokiej jakości, a obsługa klienta jest wspaniała. Zakupy tutaj to czysta przyjemność!"
              </blockquote>
              <cite class="text-gray-600 font-bold">– Anna Kamińska</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Dzięki fachowej pomocy zespołu, wybrałem idealne rozwiązanie izolacyjne dla mojego domu. Jestem bardzo zadowolony z rezultatu."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Piotr Wiśniewski</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Korzystałem z ich usług kilkukrotnie i za każdym razem byłem pod wrażeniem rzetelności i zaangażowania. Polecam z całego serca!"
              </blockquote>
              <cite class="text-gray-600 font-bold">– Tomasz Zieliński</cite>
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
</style>
