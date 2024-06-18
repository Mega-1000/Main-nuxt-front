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
      <section class="hero py-2 px-2 md:py-4 md:px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div class="container mx-auto text-center">
          <h1 class="text-2xl md:text-6xl font-extrabold mb-1 mt-2 md:mb-6 pointer didact-gothic-regular " @click="playVideo">
            Dowiedz się jak 3000+ klientów oszczędza ponad <pm class="p-0"> 2M zł </pm> co roku na styropianie
            i stwórz <em class="p-0"> przetarg </em>! To do niczego nie zobowiązuje!
          </h1>
          <div class="mb-4 mx-auto w-full md:w-fit">
            <iframe class="w-full md:w-[500px] h-[200px] md:h-[315px]" src="https://www.youtube.com/embed/wWe4qP8W_b0" title="Jak działa nasza platforma" frameborder="0" allow="autoplay" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen id="tutorialVideo" ref="tutorialVideo"></iframe>
          </div>
        </div>

        <OpinionStars />
      </section>

      <section class="my-6">
        <div class="w-[100%]">
          <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8">
            <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4"><em> Skożystaj z pomocy specjalisty </em></h3>
            <p class="text-gray-600">Telefon: <span class="font-bold"><pm>+48 576 205 389</pm></span></p>
            <p class="text-gray-600">Godziny pracy: <span class="font-bold">6:30 - 22:00</span></p>
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
              <p class="text-red-500 font-extrabold text-xl md:text-2xl" style=" text-shadow: -0.5px 0 black, 0 1px black, 1px 0 black, 0 -0.5px black;">
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

      <section class="py-10 px-2 md:py-20 md:px-4 bg-white">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10">
            Odbiór w jednym z <em> 100 </em> punktów
          </h2>
          <h4 class="text-emerald-500 font-bold text-sm md:text-lg">
            Kliknij na punkt aby sprawdzić dostępne w nim produkty
          </h4>
          <MagasinesMap />
        </div>
      </section>

      <section class="py-6 px-2 md:py-10 md:px-4 bg-gray-100" id="videos">
        <div class="container w-full md:w-[70%] mx-auto">
          <span class="text-xl w-fit font-bold">
            Obejżyj filmy poradnikowe przygotowane dla ciebie 📽
          </span>
          <div class="flex flex-wrap justify-center gap-4 md:gap-10 mt-4">
            <iframe class="w-full md:w-[500px] h-[200px] md:h-[315px]" src="https://www.youtube.com/embed/SEtNw6AJ9jg?si=UeQ9mJtyiZ3NiR1h" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <iframe class="w-full md:w-[500px] h-[200px] md:h-[315px]" src="https://www.youtube.com/embed/nbdtJYp19p4?si=7t_T5hD-JRyiQOWM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <iframe class="w-full md:w-[500px] h-[200px] md:h-[315px]" src="https://www.youtube.com/embed/6wgnCDapJIg?si=KlRt4yVkaCdIeN2E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div v-html="description"></div>
        </div>
      </section>

      <section class="py-6 px-2 md:py-10 md:px-4 bg-gray-100" id="instructions">
        <div class="container mx-auto text-center flex flex-wrap justify-center gap-2 md:gap-4">
          <NuxtLink href="/100styropiany-elewacyjne/102" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany elewacyjne
          </NuxtLink>
          <NuxtLink href="/10styropiany/50" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany posadzkowe
          </NuxtLink>
          <NuxtLink href="/--30termoizolacja-fundamentow/4" class="bg-emerald-500 rounded px-2 md:px-4 py-2 text-white font-semibold">
            Styropiany fundamentowe
          </NuxtLink>
        </div>
      </section>

      <section class="py-10 px-2 md:py-20 md:px-4 bg-emerald-600 text-white">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10">Polecaj i oszczędzaj!</h2>
          <p class="text-sm md:text-lg mb-4 md:mb-10">
            Zaproś znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! Proste i korzystne.
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-emerald-500 hover:bg-emerald-700 text-white font-medium py-2 md:py-4 px-4 md:px-10 rounded-full inline-block transition-colors duration-300">Sprawdź swój panel poleceń</a>
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

      <section class="py-10 px-2 md:py-20 md:px-4 bg-white">
        <div class="container mx-auto">
          <h2 class="text-2xl md:text-4xl md:text-5xl font-bold mb-4 md:mb-10 text-center">Co mówią klienci?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-4 md:p-8">
              <blockquote class="text-gray-700 italic mb-2 md:mb-4">
                "Najwyższa jakość produktów i obsługa na medal! Zakupy tutaj to czysta przyjemność."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Anna K.</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-4 md:p-8">
              <blockquote class="text-gray-700 italic mb-2 md:mb-4">
                "Dzięki profesjonalnemu doradztwu wybrałem idealne rozwiązanie izolacyjne. Jestem bardzo zadowolony."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Piotr W.</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-4 md:p-8">
              <blockquote class="text-gray-700 italic mb-2 md:mb-4">
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
  user-select: none;
}

@import url('https://fonts.cdnfonts.com/css/futura-lt');

.didact-gothic-regular {
  text-align: center; /* Center the text horizontally */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .didact-gothic-regular {
    font-size: 2.5rem; /* Smaller font size for tablets */
  }
}

@media (max-width: 480px) {
  .didact-gothic-regular {
    font-size: 2rem; /* Even smaller font size for mobile phones */
  }
}

@media (max-width: 320px) {
  .didact-gothic-regular {
    font-size: 1.5rem; /* Smallest font size for very small screens */
  }
}


* {
  scroll-behavior: smooth;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 800px; /* Taka sama wysokość jak iframe, aby uniknąć przesunięcia treści */
}
em {
  background: -webkit-gradient(linear, left top, left bottom, color-stop(15%, #c1f99d), color-stop(94%, #e0f5d3));
  background: linear-gradient(-180deg, #c1f99d 15%, #e0f5d3 94%);
  padding: 2px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
}

pm {
  background: -webkit-gradient(linear, left top, left bottom, color-stop(15%, #f99d9d), color-stop(94%, #f5d3d3));
  background: linear-gradient(-180deg, #f99d9d 15%, #f5d3d3 94%);
  padding: 2px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
}
</style>
