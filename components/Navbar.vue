<script setup lang="ts">
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

  useSeoMeta({
    title: 'EPH polska - styropiany, systemy elewacyjne, ocieplenia',
    ogTitle: 'EPH polska - styropiany, systemy elewacyjne, ocieplenia',
    description: 'systemy ociepleniowe z gwarancją najniższej ceny hurtownia styropianu ephpolska',
  })

onMounted(async () => {
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

const buildCustomLink = (pageId: number) => `/custom/${pageId}`;

const logOut = () => {
  removeCookie();
  userToken.value = getToken();

  window.dispatchEvent(new CustomEvent('token-refreshed'));
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
}

const searchProduct = async () => {
  searchResults.value = (await shopApi.get(`/api/searchProduct/${searchQuery.value}`)).data;
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
            <NuxtLink v-if="!isVisibilityLimited" href="/" class="nav-link">Sklep</NuxtLink>
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
          <div class="relative md:mr-4">
            <input type="search" v-model="searchQuery" @input="searchProduct()" class="search-input" placeholder="Wyszukaj produkt" />
          </div>
          <NuxtLink href="/koszyk.html" class="relative inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out">
            <Icon name="clarity:shopping-cart-solid" size="40" class="text-cyan-500" />
            <span v-if="productsCart.products.length > 0" class="cart-count">
              {{ productsCart.products.length > 9 ? '9+' : productsCart.products.length }}
            </span>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="md:hidden flex items-center">
          <button @click="showMenu = !showMenu" class="mobile-menu-toggle">
            <svg :class="{ 'hidden': showMenu, 'inline-flex': !showMenu }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
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
              </div>

              <input type="search" v-model="searchQuery" @input="searchProduct()" >

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

    <div class="ml-4 flex-shrink-0">
      <NavbarShipmentCostTable />
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
</style>
