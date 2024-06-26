<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Loader from '~/components/Loader.vue';
import MagasinesMap from '~/components/MagasinesMap.vue';
import OpinionStars from "~/components/OpinionStars.vue";

const showZipCodeModal = !localStorage.getItem('zipCode');
const { $shopApi: shopApi } = useNuxtApp();
const description = ref('');
const isLoading = ref(true);
const iframeSrc = 'https://admin.mega1000.pl/auctions/display-prices-table?zip-code=' + localStorage.getItem('zipCode');
const tutorialVideo = ref(null);
const productCarousel = ref(null)
let carouselInterval = null

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
  window.addEventListener('navbar-tutorial-ended', playTutorialVideo);

  if (productCarousel.value && window.innerWidth < 768) {
    let switchCount = 0;
    const maxSwitches = 2;
    const scrollDistance = 300;

    carouselInterval = setInterval(() => {
      if (switchCount < maxSwitches) {
        productCarousel.value.scrollBy({
          left: scrollDistance,
          behavior: 'smooth',
        });
        switchCount++;
      } else {
        productCarousel.value.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
        switchCount = 0;
      }
    }, 6000);
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage);
  window.removeEventListener('navbar-tutorial-ended', playTutorialVideo);
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});

const handleIframeMessage = (event) => {
  if (event.data && event.data.url) {
    window.location.href = event.data.url;
  }
};

const onIframeLoad = () => {
  isLoading.value = false;
};

const playTutorialVideo = () => {
  if (tutorialVideo.value) {
    tutorialVideo.value.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }
};

const onIframeError = () => {
  isLoading.value = false;
  alert('Failed to load the iframe content.');
};

const products = [
  {
    id: 99546,
    name: 'Neotherm fasada 033',
    gross_selling_price_calculated_unit: 194,
    url_for_website: '/storage/products/neotherm_fasada_033_1.jpg',
    purchases: 5
  },
  {
    id: 112915,
    name: 'Justyr fasada 038',
    gross_selling_price_calculated_unit: 186,
    url_for_website: '/images/products/1My1BsmA51',
    purchases: 7
  },
  {
    id: 109074,
    name: 'Neotherm EPS 100 036',
    gross_selling_price_calculated_unit: 231.24,
    url_for_website: '/storage/products/neotherm_fasada_033_1.jpg',
    purchases: 3
  },
]

const playVideo  = () => {
  const video = document.getElementById('tutorialVideo');
  const src = video.src;
  video.src = src.includes('?') ? `${src}&autoplay=1` : `${src}?autoplay=1`;
}
</script>

<template>
  <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
  <div>
    <main>
      <section class="hero py-4 md:py-8 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div class="container mx-auto text-center">
          <h5 class="text-2xl md:text-5xl font-extrabold mb-4 mt-4 md:mb-8 pointer didact-gothic-regular" @click="playVideo">
            Przez ostatnie 12 miesięcy <pm>2968</pm> użytkowników stworzyło <em class="p-0">przetarg</em> i oszczędziło na styropianie!
            <br>
            To do niczego nie zobowiązuje!
          </h5>
          <p class="text-xl md:text-2xl mb-6">
            Dołącz do zadowolonych klientów i skorzystaj z <em>DARMOWEJ DOSTAWY</em> na wszystkie zamówienia!
          </p>

          <NuxtLink
              href="/przetargi-styropianow"
              class="create-auction-btn block w-fit mx-auto my-6 bg-white text-emerald-800 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-emerald-800 hover:text-white hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Stwórz przetarg teraz!
          </NuxtLink>

          <p class="text-sm md:text-base mt-4 text-emerald-200">
            Już ponad 5000 klientów zaoszczędziło dzięki naszym przetargom!
          </p>
        </div>

        <OpinionStars />
      </section>

      <section class="my-6 bg-gray-100 py-8">
        <div class="w-[100%] md:w-[70%] mx-auto">
          <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8">
            <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4"><em> Skorzystaj z pomocy specjalisty </em></h3>
            <p class="text-gray-600">Telefon: <span class="font-bold"><pm>+48 576 205 389</pm></span></p>
            <p class="text-gray-600">Godziny pracy: <span class="font-bold">6:30 - 22:00</span></p>
            <p class="text-emerald-600 font-semibold mt-4">Już ponad 5000 klientów skorzystało z naszego doradztwa!</p>
          </div>
        </div>
      </section>

      <div class="mx-auto w-full md:w-[70%] my-8">
        <div class="font-extrabold text-xl md:text-2xl my-4 md:my-8">
          Najpopularniejsze produkty w <em> najlepszych </em> cenach 🔥
        </div>
        <div class="flex overflow-auto scrolling-wrapper md:justify-between mt-4" ref="productCarousel">
          <nuxt-link
              v-for="product in products"
              :key="product.id"
              :href="`/singleProduct/${product.id}`"
              class="flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden mb-4 md:mb-0 w-fit md:w-auto mx-2"
          >
            <img
                :src="`https://admin.mega1000.pl${product.url_for_website}`"
                :alt="product.name"
                class="h-48 object-cover"
            />
            <div class="px-4 py-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
              <p class="text-red-500 font-extrabold text-xl md:text-2xl" style="text-shadow: -0.5px 0 black, 0 1px black, 1px 0 black, 0 -0.5px black;">
                {{ product.gross_selling_price_calculated_unit }}PLN/M3
              </p>
              <span class="font-extrabold">
                {{ product.purchases }} zamówień dzisiaj!
              </span>
            </div>
          </nuxt-link>
        </div>

        <a class="text-center mt-8 text-lg md:text-xl w-fit mx-auto flex gap-2 align-center" href="#price-table">
          <div>
            Zobacz tabelę cen
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" style="font-weight: bolder; float: right" width="20" height="20" md:width="26" md:height="26" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </div>
        </a>
      </div>

      <div class="hero py-2 px-2 md:py-4 md:px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <styro-helper />
      </div>

      <section class="py-6 px-2 md:py-10 md:px-4 bg-gray-100" id="price-table">
        <div class="container mx-auto relative">
          <h2 class="text-xl md:text-3xl font-extrabold mb-6 md:mb-10 text-center text-emerald-500">
            <a href="#price-table" style="cursor: default;">Wybierz styropian z tabeli, kliknij cenę - dodasz do koszyka.</a><br>
            <div class="text-sm md:text-lg text-black mt-2">
              Oprócz znalezienia najtańszej hurtowni w Polsce która dostarczy ci ten styropian wraz z gratisowym transportem dokonamy także przetargu dla wszystkich pozostałych 50 producentów dla porównania.
            </div>
            <p class="text-emerald-700 font-bold mt-4">
              98% naszych klientów zaoszczędziło na zakupie styropianu przez przetarg!
            </p>
            <NuxtLink href="/przetargi-styropianow" class="create-auction-btn block w-fit mx-auto my-6 bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-emerald-700 hover:scale-105 shadow-lg hover:shadow-xl">
              Stwórz przetarg teraz!
            </NuxtLink>
          </h2>
          <div class="loader-container" v-if="isLoading">
            <Loader :showLoader="isLoading" />
          </div>
          <iframe
              ref="priceTable"
              title="Tabelka cen styropianów"
              :src="iframeSrc"
              loading="lazy"
              :style="!isLoading ? 'height: 600px' : 'height: 1px'"
              class="w-full border-2 border-gray-200 rounded-lg shadow-lg"
              sandbox="allow-scripts allow-same-origin"
              @load="onIframeLoad"
              @error="onIframeError"
          ></iframe>
        </div>
      </section>

      <section>
        <div class="mx-auto max-w-screen-xl py-10">
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

      <section class="py-10 px-2 md:py-20 md:px-4 bg-white">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10">
            Odbiór w jednym z <em>100</em> punktów
          </h2>
          <h4 class="text-emerald-500 font-bold text-sm md:text-lg">
            Kliknij na punkt aby sprawdzić dostępne w nim produkty
          </h4>
          <p class="text-gray-700 mt-4">
            Ponad 10,000 zadowolonych klientów skorzystało z naszej sieci punktów odbioru!
          </p>
          <MagasinesMap />
        </div>
      </section>

      <section class="py-10 px-2 md:py-20 md:px-4 bg-emerald-600 text-white">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10">Polecaj i oszczędzaj!</h2>
          <p class="text-sm md:text-lg mb-4 md:mb-10">
            Zaproś znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! Proste i korzystne.
          </p>
          <p class="text-lg md:text-xl font-bold mb-6">
            Już ponad 5000 klientów skorzystało z programu poleceń!
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-white text-emerald-600 font-medium py-3 px-6 rounded-full inline-block transition-all duration-300 hover:bg-emerald-700 hover:text-white hover:scale-105 shadow-lg hover:shadow-xl">
            Sprawdź swój panel poleceń
          </a>
        </div>
      </section>

      <section class="py-10 px-2 md:py-20 md:px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10 text-center">Skontaktuj się z nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8">
              <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">Zadzwoń</h3>
              <p class="text-gray-600">Telefon: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8">
              <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">Napisz</h3>
              <p class="text-gray-600">E-mail: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
* {
  user-select: none;
}

@import url('https://fonts.cdnfonts.com/css/futura-lt');

.didact-gothic-regular {
  text-align: center;
}

@media (max-width: 768px) {
  .didact-gothic-regular {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .didact-gothic-regular {
    font-size: 2rem;
  }
}

@media (max-width: 320px) {
  .didact-gothic-regular {
    font-size: 1.5rem;
  }
}

* {
  scroll-behavior: smooth;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 800px;
}

em {
  background: linear-gradient(-180deg, #c1f99d 15%, #e0f5d3 94%);
  padding: 2px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
}

pm {
  background: linear-gradient(-180deg, #f99d9d 15%, #f5d3d3 94%);
  padding: 2px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
}

.create-auction-btn {
  animation: pulse 2s infinite;
  font-size: 1.25rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
