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
  {
    id: 109074,
    name: 'Izoterm fasada 045',
    gross_selling_price_calculated_unit: 156.25,
    url_for_website: '/izoterm_fasada_045_1.jpg',
    purchases: 2
  },
]

const playVideo  = () => {
  const video = document.getElementById('tutorialVideo');
  const src = video.src;
  video.src = src.includes('?') ? `${src}&autoplay=1` : `${src}?autoplay=1`;
}
</script>
<template>
  <div class="font-sans">
    <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
    <main>
      <!-- Hero Section -->
      <section class="relative py-24 overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-900">
        <div class="absolute inset-0">
          <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-opacity="0.1" fill="#fff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in-down didact-gothic-regular">
              Przez ostatnie 12 miesięcy <span class="text-yellow-300 animate-pulse"><pm>2968</pm></span> użytkowników stworzyło <em class="not-italic bg-emerald-700 px-2 py-1 rounded animate-bounce">przetarg</em> i oszczędziło na styropianie!
            </h1>
            <p class="text-xl md:text-2xl text-emerald-100 mb-10 animate-fade-in-up animation-delay-300">
              Dołącz do zadowolonych klientów i skorzystaj z <em class="not-italic font-bold underline decoration-yellow-300 decoration-2 underline-offset-2">DARMOWEJ DOSTAWY</em> na wszystkie zamówienia!
            </p>
            <NuxtLink
                href="/przetargi-styropianow"
                class="inline-block bg-white text-emerald-800 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-900 transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse"
            >
              <span class="flex items-center gap-2">
                Stwórz przetarg teraz!
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </NuxtLink>
            <p class="text-sm md:text-base mt-6 text-emerald-200 animate-fade-in-up animation-delay-600">
              Już ponad 5000 klientów zaoszczędziło dzięki naszym przetargom!
            </p>
          </div>
          <OpinionStars class="animate-fade-in-up animation-delay-900 mt-8 text-white" />
        </div>
      </section>

      <!-- Contact Card Section -->
      <section class="my-8 bg-gradient-to-r from-emerald-500 to-teal-600 py-16 animate-fade-in-up">
        <div class="w-full md:w-3/4 lg:w-2/3 mx-auto">
          <div class="contact-card bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <h3 class="text-3xl md:text-4xl font-bold mb-6 text-center">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">Skorzystaj z pomocy specjalisty</span>
            </h3>
            <div class="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <p class="text-gray-700 text-xl mb-2">Telefon: <span class="font-bold text-emerald-700">+48 576 205 389</span></p>
                <p class="text-gray-700 text-xl">Godziny pracy: <span class="font-bold">6:30 - 22:00</span></p>
              </div>
              <p class="text-emerald-600 font-semibold mt-4 md:mt-0 text-2xl text-center md:text-right">Już ponad 5000 zadowolonych klientów!</p>
            </div>
            <form class="mt-8">
              <div class="mb-6">
                <label for="phone" class="block text-gray-700 text-lg font-semibold mb-2">Twój numer telefonu:</label>
                <input type="tel" id="phone" name="phone" placeholder="Np. 123 456 789" required
                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all duration-300"
                >
              </div>
              <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                Zamów kontakt
              </button>
            </form>
          </div>
        </div>
      </section>


      <!-- Popular Products Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
        <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-12 text-center">
          Najpopularniejsze produkty w <span class="text-emerald-600">najlepszych</span> cenach 🔥
        </h2>

        <div class="relative">
          <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-6" ref="productCarousel">
            <div v-for="product in products" :key="product.id" class="snap-start flex-shrink-0 w-64 md:w-72">
              <a :href="`/singleProduct/${product.id}`" class="block bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div class="relative">
                  <img :src="`https://admin.mega1000.pl${product.url_for_website}`" :alt="product.name" class="w-full h-48 object-cover rounded-t-xl" />
                  <div class="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-3 py-1 m-2 rounded-full animate-pulse">
                    HOT
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>
                  <p class="text-emerald-600 font-extrabold text-2xl mb-2">
                    {{ product.gross_selling_price_calculated_unit }} PLN/M<sup>3</sup>
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-500">{{ product.purchases }} zamówień dzisiaj!</span>
                    <svg class="w-6 h-6 text-emerald-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div class="absolute top-1/2 -left-4 -translate-y-1/2">
            <button class="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300" @click="scrollCarousel('left')">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
          </div>
          <div class="absolute top-1/2 -right-4 -translate-y-1/2">
            <button class="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300" @click="scrollCarousel('right')">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <div class="mt-16 text-center">
          <a href="#price-table" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 transform hover:scale-105">
            Zobacz tabelę cen
            <svg class="ml-2 -mr-1 w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </a>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="hero py-16 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div class="container mx-auto text-center relative z-10">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-8 animate-fade-in-up didact-gothic-regular">
            Płatność przy odbiorze! Bez ryzyka!
          </h1>
          <p class="text-xl md:text-2xl mb-12 animate-fade-in-up animation-delay-300">
            Zamówienia realizowane są również z opcją płatności przy odbiorze, lub bezpośrednio od fabryki <br> Nie musisz obawiać się o swoje pieniądze!
          </p>

          <NuxtLink href="/przetargi-styropianow" class="create-auction-btn inline-block bg-white text-emerald-700 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse">
            <span class="flex items-center gap-3">
              Stwórz przetarg i kup bezpośrednio od producenta!
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Price Table Section -->
      <section class="py-24 md:px-4 bg-gradient-to-b from-emerald-100 to-white" id="price-table">
        <div class="container mx-auto relative max-w-6xl">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-12 text-center text-emerald-700 animate-fade-in-up">
            Wybierz styropian z tabeli, kliknij cenę - dodasz do koszyka
          </h2>
          <div class="bg-white rounded-3xl shadow-2xl p-4 md:p-8 md:p-12 animate-fade-in-up animation-delay-300 transform hover:scale-105 transition-transform duration-500">
            <p class="text-xl md:text-2xl mb-10 text-gray-700 leading-relaxed">
              Oprócz znalezienia najtańszej hurtowni w Polsce która dostarczy ci ten styropian wraz z gratisowym transportem dokonamy także przetargu dla wszystkich pozostałych 50 producentów dla porównania.
            </p>
            <div class="bg-emerald-100 rounded-2xl p-6 mb-10 transform hover:scale-105 transition-transform duration-300">
              <p class="text-emerald-800 font-bold text-2xl text-center">
                98% naszych klientów zaoszczędziło na zakupie styropianu przez przetarg!
              </p>
            </div>
            <NuxtLink
                to="/przetargi-styropianow"
                class="create-auction-btn block w-full md:w-fit mx-auto my-10 bg-emerald-600 text-white font-bold py-5 px-10 rounded-full transition-all duration-300 hover:bg-emerald-700 hover:scale-105 shadow-lg hover:shadow-xl text-center text-lg"
            >
              <span class="flex gap-3 items-center justify-center">
                <span>Stwórz przetarg - do niczego nie zobowiązuje!</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </NuxtLink>
            <div v-if="isLoading" class="flex justify-center items-center h-40 mt-10">
              <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
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
            <div class="mt-8 text-center">
              <span class="text-gray-700">Nie wiesz jak korzystać z tabeli cen?</span>
              <NuxtLink class="text-emerald-600 hover:text-emerald-700 ml-2 font-semibold underline" to="/tabela-cen-instrukcje">Kliknij tutaj</NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 px-4 animate-fade-in-up bg-gray-50">
        <div class="mx-auto max-w-screen-xl">
          <LogosSection />
        </div>
      </section>

      <FastShipping />

      <!-- Testimonials Section -->
      <section class="py-24 px-4 bg-emerald-50 animate-fade-in-up">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-emerald-800">
            Co mówią nasi klienci
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div v-for="(testimonial, index) in testimonials" :key="index"
                 class="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div class="flex items-center mb-6">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="w-16 h-16 rounded-full mr-4 border-4 border-emerald-300">
                <div>
                  <h3 class="font-bold text-xl text-emerald-700">{{ testimonial.name }}</h3>
                  <p class="text-emerald-600">{{ testimonial.location }}</p>
                </div>
              </div>
              <p class="text-gray-700 italic mb-6 text-lg">"{{ testimonial.quote }}"</p>
              <div class="flex items-center">
                <span v-for="i in 5" :key="i" class="text-yellow-400 mr-1">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </span>
                <span class="font-bold text-emerald-700 ml-2">{{ testimonial.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StyroTree />

      <!-- Pickup Points Section -->
      <section class="py-24 px-4 bg-gray-100 animate-fade-in-up">
        <div class="container mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-bold mb-8 text-emerald-800">
            Odbiór w jednym z <em class="text-emerald-600">100</em> punktów
          </h2>
          <h4 class="text-emerald-500 font-bold text-lg md:text-xl mb-4">
            Kliknij na punkt aby sprawdzić dostępne w nim produkty
          </h4>
          <p class="text-gray-700 mb-12 text-lg">
            Ponad 10,000 zadowolonych klientów skorzystało z naszej sieci punktów odbioru!
          </p>
          <MagasinesMap class="shadow-2xl rounded-lg overflow-hidden" />
        </div>
      </section>

      <!-- Referral Section -->
      <section class="py-24 px-4 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white animate-fade-in-up">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-8">Polecaj i oszczędzaj!</h2>
          <p class="text-xl mb-12 max-w-3xl mx-auto">
            Zaproś znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! Proste i korzystne.
          </p>
          <p class="text-2xl font-bold mb-12 animate-pulse">
            Już ponad 5000 klientów skorzystało z programu poleceń!
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-white text-emerald-700 font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 hover:scale-105 shadow-lg hover:shadow-xl text-lg">
            Sprawdź swój panel poleceń
          </a>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="py-24 px-4 bg-gray-100 animate-fade-in-up">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-emerald-800">Skontaktuj się z nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="contact-card bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <h3 class="text-2xl md:text-3xl font-bold mb-6 text-emerald-700">Zadzwoń</h3>
              <p class="text-gray-700 text-xl">Telefon: <span class="font-bold text-emerald-600">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <h3 class="text-2xl md:text-3xl font-bold mb-6 text-emerald-700">Napisz</h3>
              <p class="text-gray-700 text-xl">E-mail: <span class="font-bold text-emerald-600">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <section class="py-24 px-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white overflow-hidden relative animate-fade-in-up">
    <div class="container mx-auto relative z-10">
      <h2 class="text-4xl md:text-6xl font-bold mb-16 text-center">
        Gwarancja najniższej ceny
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-6xl mb-6">💰</div>
          <h3 class="text-2xl font-semibold mb-4">Oszczędzasz pieniądze</h3>
          <p class="text-lg">Gwarantujemy, że znajdziesz u nas najniższe ceny na rynku. Jeśli znajdziesz taniej, wyrównamy cenę!</p>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-6xl mb-6">🛡️</div>
          <h3 class="text-2xl font-semibold mb-4">Pewność zakupu</h3>
          <p class="text-lg">Nasza gwarancja daje Ci pewność, że dokonujesz najlepszego wyboru cenowego na rynku.</p>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div class="text-6xl mb-6">🤝</div>
          <h3 class="text-2xl font-semibold mb-4">Uczciwe warunki</h3>
          <p class="text-lg">Bez ukrytych kosztów czy haczyków. Nasza gwarancja jest prosta i przejrzysta.</p>
        </div>
      </div>
      <div class="mt-16 text-center">
        <NuxtLink
            to="/gwarancja-najnizszej-ceny"
            class="bg-white text-emerald-700 font-bold py-4 px-10 rounded-full inline-block transition-all duration-300 hover:bg-yellow-300 hover:text-emerald-800 hover:scale-105 shadow-lg hover:shadow-xl text-xl"
        >
          Dowiedz się więcej
        </NuxtLink>
      </div>
    </div>
    <div class="absolute inset-0 bg-emerald-600 opacity-20 animate-wave"></div>
  </section>
</template>

<style>
body {
  scroll-behavior: smooth;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-wave {
  animation: wave 10s linear infinite;
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
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

pm {
  background: linear-gradient(-180deg, #f99d9d 15%, #f5d3d3 94%);
  padding: 2px 6px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  transform: skew(-5deg);
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}
</style>
