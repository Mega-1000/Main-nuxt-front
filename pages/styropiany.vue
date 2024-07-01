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
const testimonials = [
  {
    name: "Anna Kowalska",
    location: "Warszawa",
    quote: "Dzięki przetargowi na Mega1000 zaoszczędziłam ponad 20% na styropianie do mojego domu. Polecam!",
    rating: 5,
    avatar: "/11.jpg"
  },
  {
    name: "Piotr Nowak",
    location: "Kraków",
    quote: "Proces był prosty i szybki. Otrzymałem wiele konkurencyjnych ofert w ciągu kilku godzin.",
    rating: 4.5,
    avatar: "/33.jpeg"
  },
  {
    name: "Marta Wiśniewska",
    location: "Wrocław",
    quote: "Świetna obsługa klienta i najlepsze ceny na rynku. Na pewno skorzystam ponownie!",
    rating: 5,
    avatar: "/22.jpeg"
  }
];

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
  <div>
    <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
    <main>
      <!-- Hero Section -->
      <section class="hero py-8 md:py-8 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
        <div class="container mx-auto text-center relative z-10">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 mt-4 animate-fade-in-up didact-gothic-regular">
            Przez ostatnie 12 miesięcy <pm>2968</pm> użytkowników stworzyło <em class="p-0">przetarg</em> i oszczędziło na styropianie!
          </h1>
          <p class="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-300">
            Dołącz do zadowolonych klientów i skorzystaj z <em>DARMOWEJ DOSTAWY</em> na wszystkie zamówienia!
          </p>
          <NuxtLink
              href="/przetargi-styropianow"
              class="create-auction-btn block w-fit mx-auto my-6 bg-white text-emerald-800 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse"
          >
            <div class="flex gap-3">
              <div>
                Stwórz przetarg teraz! - niczego nie zobowiązuje!
              </div>
            </div>
          </NuxtLink>
          <p class="text-sm md:text-base mt-4 text-emerald-200 animate-fade-in-up animation-delay-600">
            Już ponad 5000 klientów zaoszczędziło dzięki naszym przetargom!
          </p>
        </div>
        <OpinionStars class="animate-fade-in-up animation-delay-900 mt-4" />
        <div class="absolute inset-0 bg-emerald-700 opacity-20 animate-wave"></div>
      </section>

      <!-- Contact Card Section -->
      <section class="my-3 bg-gray-100 py-8 animate-fade-in-up">
        <div class="w-[100%] md:w-[70%] mx-auto">
          <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4"><em> Skorzystaj z pomocy specjalisty </em></h3>
            <p class="text-gray-600">Telefon: <span class="font-bold"><pm>+48 576 205 389</pm></span></p>
            <p class="text-gray-600">Godziny pracy: <span class="font-bold">6:30 - 22:00</span></p>
            <p class="text-emerald-600 font-semibold mt-4">Już ponad 5000 klientów skorzystało z naszego doradztwa!</p>
          </div>
        </div>
      </section>

      <!-- Popular Products Section -->
      <div class="mx-auto w-full md:w-[70%] my-8 animate-fade-in-up">
        <div class="font-extrabold text-xl md:text-2xl my-4 md:my-8">
          Najpopularniejsze produkty w <em> najlepszych </em> cenach 🔥
        </div>
        <div class="flex overflow-auto scrolling-wrapper md:justify-between mt-4" ref="productCarousel">
          <nuxt-link
              v-for="product in products"
              :key="product.id"
              :href="`/singleProduct/${product.id}`"
              class="flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden mb-4 md:mb-0 w-fit md:w-auto mx-2 hover:shadow-xl transition-shadow duration-300"
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

        <a class="text-center mt-8 text-lg md:text-xl w-fit mx-auto flex gap-2 align-center animate-bounce" href="#price-table">
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
        <!-- Kupuj z płatnością przy odbiorze! Bez rytzyka -->
        <div class="container mx-auto text-center relative z-10">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 mt-4 animate-fade-in-up didact-gothic-regular">
             Płatność przy odbiorze! Bez ryzyka!
          </h1>
          <p class="text-xl md text-2xl mb-8 animate-fade-in-up animation-delay-300">
            Zamówienia realizowane są również z opcją płatności przy odbiorze, lub bezpośrednio od fabryki <br> Nie musisz obawiać się o swoje pieniądze!
          </p>

          <NuxtLink href="/przetargi-styropianow" class="create-auction-btn block w-fit mx-auto my-6 bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-emerald-700 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse">
            <div class="flex gap-3 items-center">
              <div>
                Stwórz przetarg i kup bezpośrednio od producenta!
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Price Table Section -->
      <section class="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white" id="price-table">
        <div class="container mx-auto relative max-w-5xl">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-12 text-center text-emerald-600 animate-fade-in-up">
            Wybierz styropian z tabeli, kliknij cenę - dodasz do koszyka
          </h2>
          <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up animation-delay-300">
            <p class="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
              Oprócz znalezienia najtańszej hurtowni w Polsce która dostarczy ci ten styropian wraz z gratisowym transportem dokonamy także przetargu dla wszystkich pozostałych 50 producentów dla porównania.
            </p>
            <p class="text-emerald-700 font-bold text-xl mb-8 text-center">
              98% naszych klientów zaoszczędziło na zakupie styropianu przez przetarg!
            </p>
            <NuxtLink
                to="/przetargi-styropianow"
                class="create-auction-btn block w-full md:w-fit mx-auto my-8 bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-lg hover:shadow-xl text-center"
            >
          <span class="flex gap-3 items-center justify-center">
            <span>Stwórz przetarg - do niczego nie zobowiązuje!</span>
          </span>
            </NuxtLink>
            <div v-if="isLoading" class="flex justify-center items-center h-40 mt-20">
              <Loader :show-loader="isLoading" />
            </div>
            <iframe
                ref="priceTable"
                title="Tabelka cen styropianów"
                :src="iframeSrc"
                loading="lazy"
                :class="['w-full border-2 border-gray-200 rounded-lg shadow-lg transition-all duration-500', isLoading ? 'h-0' : 'h-[600px]']"
                sandbox="allow-scripts allow-same-origin"
                @load="onIframeLoad"
                @error="onIframeError"
            ></iframe>
            <div class="mt-6 text-center">
              <span class="text-gray-700">Nie wiesz jak korzystać z tabeli cen?</span>
              <NuxtLink class="text-emerald-600 hover:text-emerald-700 ml-2 font-semibold" to="/tabela-cen-instrukcje">Kliknij tutaj</NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section class="py-10 px-4 animate-fade-in-up">
        <div class="mx-auto max-w-screen-xl">
          <LogosSection />
        </div>
      </section>


      <!-- Styro Helper Section -->
    <FastShipping />

      <section class="py-16 px-4 bg-emerald-50 animate-fade-in-up">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center text-emerald-800">
            Co mówią nasi klienci
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(testimonial, index) in testimonials" :key="index"
                 class="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <h3 class="font-bold text-lg">{{ testimonial.name }}</h3>
                  <p class="text-emerald-600">{{ testimonial.location }}</p>
                </div>
              </div>
              <p class="text-gray-600 italic mb-4">"{{ testimonial.quote }}"</p>
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="font-bold">{{ testimonial.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StyroTree />

      <!-- Pickup Points Section -->
      <section class="py-10 px-4 md:py-20 bg-gray-100 animate-fade-in-up">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-5xl font-bold mb-4 md:mb-10">
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

      <!-- Referral Section -->
      <section class="py-10 px-4 md:py-20 bg-emerald-600 text-white animate-fade-in-up">
        <div class="container mx-auto text-center">
          <h2 class="text-2xl md:text-5xl font-bold mb-4 md:mb-10">Polecaj i oszczędzaj!</h2>
          <p class="text-sm md:text-lg mb-4 md:mb-10">
            Zaproś znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! Proste i korzystne.
          </p>
          <p class="text-lg md:text-xl font-bold mb-6">
            Już ponad 5000 klientów skorzystało z programu poleceń!
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-white text-emerald-600 font-medium py-3 px-6 rounded-full inline-block transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 hover:scale-105 shadow-lg hover:shadow-xl">
            Sprawdź swój panel poleceń
          </a>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="py-10 px-4 md:py-20 bg-gray-100 animate-fade-in-up">
        <div class="container mx-auto">
          <h2 class="text-2xl md:text-5xl font-bold mb-4 md:mb-10 text-center">Skontaktuj się z nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">Zadzwoń</h3>
              <p class="text-gray-600">Telefon: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-4 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">Napisz</h3>
              <p class="text-gray-600">E-mail: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <section class="py-16 px-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white overflow-hidden relative animate-fade-in-up">
    <div class="container mx-auto relative z-10">
      <h2 class="text-4xl md:text-5xl font-bold mb-8 text-center">
        Gwarancja najniższej ceny
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-5xl mb-4">💰</div>
          <h3 class="text-2xl font-semibold mb-4">Oszczędzasz pieniądze</h3>
          <p>Gwarantujemy, że znajdziesz u nas najniższe ceny na rynku. Jeśli znajdziesz taniej, wyrównamy cenę!</p>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-5xl mb-4">🛡️</div>
          <h3 class="text-2xl font-semibold mb-4">Pewność zakupu</h3>
          <p>Nasza gwarancja daje Ci pewność, że dokonujesz najlepszego wyboru cenowego na rynku.</p>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-5xl mb-4">🤝</div>
          <h3 class="text-2xl font-semibold mb-4">Uczciwe warunki</h3>
          <p>Bez ukrytych kosztów czy haczyków. Nasza gwarancja jest prosta i przejrzysta.</p>
        </div>
      </div>
      <div class="mt-12 text-center">
        <NuxtLink
            to="/gwarancja-najnizszej-ceny"
            class="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full inline-block transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Dowiedz się więcej
        </NuxtLink>
      </div>
    </div>
    <div class="absolute inset-0 bg-emerald-600 opacity-20 animate-wave"></div>
  </section>
</template>



<style scoped>
/* ... (poprzednie style) */

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-wave {
  animation: wave 8s linear infinite;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  background-size: 200% 100%;
}

@keyframes wave {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

.create-auction-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
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
