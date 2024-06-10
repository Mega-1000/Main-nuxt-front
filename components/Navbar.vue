<script setup>
import { getToken, removeCookie } from "~~/helpers/authenticator";
import Cart from "~~/utils/Cart";
import Cookies from "universal-cookie";

const { $shopApi: shopApi } = useNuxtApp();
const productsCart = useProductsCart();
const router = useRouter();
const isVisibilityLimited = ref(false);
const userToken = ref('');
const showMenu = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const noResultsMessage = ref(''); // To hold the message when no results are found

const navigationLink = ref(null);
const profileLink = ref(null);
const settingsLink = ref(null);

const tutorialActive = ref(false);
const tutorialTitle = ref('');
const tutorialDescription = ref('');
const tutorialHighlightStyle = reactive({});
const tutorialNextButtonText = ref('Next');
const tutorialStep = ref(0);

useSeoMeta({
  title: 'EPH Polska - Hurtownia Styropianu, Systemy Elewacyjne, Ocieplenia | Gwarancja Najniższej Ceny',
  ogTitle: 'EPH Polska - Hurtownia Styropianu, Systemy Elewacyjne, Ocieplenia | Gwarancja Najniższej Ceny',
  description: 'EPH Polska - hurtownia styropianu oferująca systemy ociepleniowe i elewacyjne z gwarancją najniższej ceny. Sprawdź naszą ofertę już dziś!',
})

onMounted(async () => {
  showTutorial();
  const cookies = new Cookies();
  userToken.value = cookies.get("token");

  isVisibilityLimited.value = localStorage.getItem('noAllegroVisibilityLimit') != 'true';

  const cart = new Cart();
  cart.init();
  productsCart.value = cart;

  // Listen to a custom event or a typical window action that implies token change
  window.addEventListener('token-refreshed', checkUserLoggedIn);
});

onUnmounted(() => {
  window.removeEventListener('token-refreshed', checkUserLoggedIn);
});

const checkUserLoggedIn = () => {
  const cookies = new Cookies();
  userToken.value = cookies.get("token"); // Reload the token

  // Assuming you might need to refresh user-specific data
  if (userToken.value) {
    // You could refresh user-specific data here, e.g., user profile or permissions
    console.log("User logged in, token refreshed.");
  } else {
    console.log("User not logged in or session expired.");
  }
}

const buildCustomLink = (pageId) => `/custom/${pageId}`;

const logOut = () => {
  removeCookie();
  userToken.value = getToken();

  window.dispatchEvent(new CustomEvent('token-refreshed'));
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
}

const searchProduct = async () => {
  const response = await shopApi.get(`/api/searchProduct/${searchQuery.value}`);
  searchResults.value = response.data;
  if (searchResults.value.length === 0) {
    noResultsMessage.value = 'Brak wyników dla podanej frazy. Spróbuj użyć innych słów kluczowych.';
  } else {
    noResultsMessage.value = '';
  }
}

const showTutorial = () => {
  if (localStorage.getItem('navbarTutorialEnded')) {
    return;
  }

  tutorialActive.value = true;

  switch (tutorialStep.value) {
    case 0:
      tutorialTitle.value = 'Witamy w EPH Polska!';
      tutorialDescription.value = 'W tym tutorialu pokażemy ci kilka funkcji naszego portalu.';
      tutorialNextButtonText.value = 'Chce dowiedzieć się jak działacie!';
      break;
    case 1:
      tutorialTitle.value = 'Wyszukiwanie';
      tutorialDescription.value = 'Jeśli poszukujesz konktetnego produktu wpisz to tutaj a my pokażemy ci wyniki.';
      const navigationLinkRect = navigationLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = navigationLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = navigationLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = navigationLinkRect.width + 'px';
      tutorialHighlightStyle.height = navigationLinkRect.height + 'px';
      tutorialNextButtonText.value = 'Następny krok';
      break;
    case 2:
      tutorialTitle.value = 'Koszyk';
      tutorialDescription.value = 'W tym miejscu możesz wejść do koszyka i wysłać zapytanie ofertowe.';
      const profileLinkRect = profileLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = profileLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = profileLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = profileLinkRect.width + 'px';
      tutorialHighlightStyle.height = profileLinkRect.height + 'px';
      break;
    case 3:
      tutorialTitle.value = 'Sklep';
      tutorialDescription.value = 'Jeśli chcesz wrócić do sklepu i dodać inne produkty wejdź tutaj!';
      const settingsLinkRect = settingsLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = settingsLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = settingsLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = settingsLinkRect.width + 'px';
      tutorialNextButtonText.value = 'Wszystko jasne przechodzę do strony.';
      break;
    case 4:
      localStorage.setItem('navbarTutorialEnded', true);
      window.dispatchEvent(new Event('navbar-tutorial-ended'))
      tutorialActive.value = false;
  }
};

const nextTutorialStep = () => {
  if (tutorialStep.value === 4) {
    tutorialActive.value = false;
  } else {
    tutorialStep.value++;
    showTutorial();
  }
};

const endTutorial = () => {
  tutorialActive.value = false;
  localStorage.setItem('navbarTutorialEnded', true);
}
</script>

<template>
  <nav class="bg-gray-200 border-b border-gray-200 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <NuxtLink href="/">
              <img src="/logo.webp" alt="" class="w-[45px]">
            </NuxtLink>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <span ref="settingsLink">
              <NuxtLink v-if="!isVisibilityLimited" href="/" class="nav-link">Sklep</NuxtLink>
            </span>
            <NuxtLink v-if="!isVisibilityLimited" href="/info" class="nav-link">Kontakt</NuxtLink>
            <NuxtLink v-if="userToken && !isVisibilityLimited" href="/account" class="nav-link">Konto</NuxtLink>
            <NuxtLink href="/Complaint" v-if="userToken" class="nav-link">Zgłoś reklamację</NuxtLink>
            <NuxtLink v-if="userToken && !isVisibilityLimited" href="/" @click.prevent="logOut" class="nav-link">Wyloguj</NuxtLink>
            <NuxtLink v-else href="/login" class="nav-link">Zaloguj</NuxtLink>
            <NuxtLink href="/faq" class="nav-link">FAQ</NuxtLink>
            <a href="tel:507 925 963" class="nav-link" style="font-weight: bold; color: red">Infolinia 7/24 507 925 963</a>
          </div>
        </div>

        <!-- Search Bar and Cart -->
        <div class="flex items-center">
          <div class="relative md:mr-4" ref="navigationLink">
            <input type="search" v-model="searchQuery" @input="searchProduct()" class="search-input" placeholder="Wyszukaj produkt" />
          </div>

          <div ref="profileLink">
            <NuxtLink href="/koszyk.html" class="relative inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out">
              <Icon name="clarity:shopping-cart-solid" size="40" class="text-cyan-500" />
              <span v-if="productsCart.products.length > 0" class="cart-count">
                {{ productsCart.products.length > 9 ? '9+' : productsCart.products.length }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="md:hidden flex items-center">
          <button @click="showMenu = !showMenu" class="mobile-menu-toggle">
            <svg :class="{ 'hidden': showMenu, 'inline-flex': !showMenu }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="
0 0 24 24">
              <path class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg :class="{ 'hidden': !showMenu, 'inline-flex': showMenu }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div :class="{ 'hidden': !showMenu, 'block': showMenu }" class="md:hidden">
        <div class="pt-2 pb-3">
          <NuxtLink v-if="!isVisibilityLimited" href="/" class="mobile-nav-link">Sklep</NuxtLink>
          <NuxtLink v-if="!isVisibilityLimited" href="/info" class="mobile-nav-link">Kontakt</NuxtLink>
          <template v-for="page in customPages" v-if="!isVisibilityLimited">
            <NuxtLink :href="buildCustomLink(page.id)" class="mobile-nav-link">{{ page.title }}</NuxtLink>
          </template>
          <NuxtLink v-if="userToken && !isVisibilityLimited" href="/account" class="mobile-nav-link">Konto</NuxtLink>
          <NuxtLink href="/Complaint" class="mobile-nav-link">Zgłoś reklamację</NuxtLink>
          <NuxtLink v-if="userToken && !isVisibilityLimited" href="/" @click.prevent="logOut" class="mobile-nav-link">Wyloguj</NuxtLink>
          <NuxtLink v-else href="/login" class="mobile-nav-link">Zaloguj</NuxtLink>
          <NuxtLink href="/faq" class="mobile-nav-link">FAQ</NuxtLink>
          <a href="tel:507 925 963" class="mobile-nav-link" style="font-weight: bold; color: red">Infolinia 7/24 507 925 963</a>
        </div>
      </div>
    </div>

    <!-- Search Results Modal -->
    <div v-if="searchResults.length > 0" class="search-results-modal" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="relative w-screen max-w-md">
            <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              <div class="px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Wyniki wyszukiwania</h2>
                  <div class="ml-3 h-7 flex items-center">
                    <button @click="searchResults = []" class="close-button">
                      <span class="sr-only">Zamknij</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <input type="search" class="search-input" v-model="searchQuery" @input="searchProduct()" />
              </div>

              <div class="mt-6 relative flex-1 px-4 sm:px-6">
                <ul>
                  <li v-for="result in searchResults" :key="result.id" class="py-4 border-b border-gray-200">
                    <NuxtLink class="flex items-center" :href="`/singleProduct/${result.id}`" @click="searchResults = []">
                      <img :src="`https://admin.mega1000.pl${result.url_for_website}`" class="h-16 w-16 object-cover rounded-full mr-4" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ result.name }}</p>
                        <p class="text-sm text-gray-500">{{ result.price.gross_price_of_packing }} PLN</p>
                        <div class="star-rating">
                          <span v-for="i in 5" :key="i" class="star" :class="{ 'star-active': i <= result.meanOpinion ?? 0 }">★</span>
                          <p>Ocena: {{ result.meanOpinion?.toFixed(1) ?? 0 }} / 5</p>
                        </div>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="noResultsMessage" class="no-results-message">
      <p>{{ noResultsMessage }}</p>
    </div>

    <div class="ml-4 flex-shrink-0">
      <NavbarShipmentCostTable />
    </div>

    <div class="tutorial-highlight" style="position: fixed; z-index:  888" v-if="tutorialActive">
      <slot name="tutorial-highlight"></slot>
    </div>
    <div v-if="tutorialActive" class="tutorial-overlay">
      <div class="tutorial-modal">
        <div class="tutorial-content">
          <h3 class="text-2xl font-bold">{{ tutorialTitle }}</h3>
          <p>{{ tutorialDescription }}</p>
          <SubmitButton @click="nextTutorialStep()" class="mt-4">{{ tutorialNextButtonText }}</SubmitButton>
          <button v-if="tutorialStep === 0" @click="endTutorial()" class="text-white bg-red-700 hover:bg-red-800 mt-2 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">
            Dzięki, ogarnę portal sam
          </button>
          <button v-if="tutorialStep === 3" @click="tutorialStep = 0; nextTutorialStep()" class="text-white bg-red-700 hover:bg-red-800 mt-2 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">
            Chce zobaczyć poradnik jeszcze raz
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

    <style scoped>
/* Navigation Links */
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out;
}

/* Search Input */
.search-input {
  @apply block md:pl-4 md:pr-12 sm:text-sm sm:leading-5 border-gray-300 rounded-md p-2 w-full;
}

/* Cart Count */
.cart-count {
  @apply ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  @apply inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out;
}

/* Mobile Navigation Links */
.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out;
}

/* Search Results Modal */
.search-results-modal {
  @apply fixed inset-0 overflow-hidden;
  z-index: 10000;
}

/* Close Button */
.close-button {
  @apply bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500;
}

/* Star Rating */
.star {
  @apply text-gray-300;
  font-size: 1.25rem;
  line-height: 1;
}

.star-active {
  @apply text-yellow-400;
}
 .user-dashboard {
   display: flex;
 }

.sidebar {
  width: 200px;
  background-color: #f1f1f1;
  padding: 20px;
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

.main-content {
  flex: 1;
  padding: 20px;
}

/* Styles for the tutorial modals */
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 887;
}

.tutorial-modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  text-align: center;
  position: relative;
  z-index: 900; /* Add a higher z-index value */
}

.tutorial-modal-container {
  position: relative;
}

.tutorial-highlight {
  position: absolute;
  background-color: rgba(255, 255, 0, 0.2);
  border-radius: 4px;
}

.tutorial-highlight::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #ff0;
  border-radius: 6px;
  animation: highlight 1s infinite;
}

@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255,255, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 0, 0.5);
  }
}
</style>
