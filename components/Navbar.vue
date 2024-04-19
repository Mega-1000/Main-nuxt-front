<script setup lang="ts">
  import { getToken, removeCookie } from "~~/helpers/authenticator";
  import { getPages } from "~~/helpers/customPages";
  import Cart from "~~/utils/Cart";
  import {cursor} from "sisteransi";
  import show = cursor.show;
  import Cookies from "universal-cookie";

  const { $shopApi: shopApi } = useNuxtApp();
  const productsCart = useProductsCart();
  const router = useRouter();
  const isVisibilityLimited = ref(false);
  const userToken = ref('');
  const showMenu = ref(false);
  const searchQuery = ref('');
  const searchResults = ref([]);

  onMounted(() => {
    const cookies = new Cookies();
    userToken.value = cookies.get("token");

    isVisibilityLimited.value = localStorage.getItem('noAllegroVisibilityLimit') != 'true';
  });

  const { data: customPages } = useAsyncData(async () => {
    try {
      return (await getPages(shopApi)).customPages[0].content;
    } catch {}
  });

  const buildCustomLink = (pageId: number) => `/custom/${pageId}`;

  const logOut = () => {
    removeCookie();
    userToken.value = getToken();

    router.go(0);
  };

  onMounted(() => {
    const cart = new Cart();
    cart.init();
    productsCart.value = cart;
  });

  const toggleMenu = () => {
    showMenu.value = !showMenu.value;
  }

  const searchProduct = async () => {
    searchResults.value = (await shopApi.get(`/api/searchProduct/${searchQuery.value}`)).data;
  }
</script>

<template>
  <nav class="bg-cyan-100 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <NuxtLink :href="isVisibilityLimited ? '/' : '/sklep'" class="text-2xl font-semibold text-gray-900">
              EPH POLSKA
            </NuxtLink>
          </div>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <!-- Desktop navigation links -->
            <NuxtLink v-if="!isVisibilityLimited" href="/info" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              Kontakt
            </NuxtLink>
            <template v-for="page in customPages" v-if="!isVisibilityLimited">
              <NuxtLink :href="buildCustomLink(page.id)" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
                {{ page.title }}
              </NuxtLink>
            </template>
            <NuxtLink v-if="userToken && !isVisibilityLimited" href="/account" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              Konto
            </NuxtLink>
            <NuxtLink href="/Complaint" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              Zgłoś reklamację
            </NuxtLink>
            <NuxtLink v-if="userToken && !isVisibilityLimited" href="/" @click.prevent="logOut" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              Wyloguj
            </NuxtLink>
            <NuxtLink v-else href="/login" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              Zaloguj
            </NuxtLink>
            <NuxtLink href="/faq" class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-900 hover:border-gray-300 focus:outline-none focus:border-gray-700 transition duration-150 ease-in-out">
              FAQ
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center">
          <div class="relative mr-4">
            <input type="search" v-model="searchQuery" @input="searchProduct()" class="block w-full pl-4 pr-12 sm:text-sm sm:leading-5 border-gray-300 rounded-md" placeholder="Wyszukaj produkt" />
            <div v-if="searchResults.length > 0" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <ul class="py-1">
                <li v-for="result in searchResults" :key="result.id" class="py-2 px-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 cursor-pointer">
                  <div class="flex items-center">
                    <img :src="`https://admin.mega1000.pl${result.url_for_website}`" class="h-8 w-8 object-cover rounded-full mr-2" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ result.name }}</p>
                      <p class="text-sm text-gray-500">59.99 zł</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <NuxtLink href="/koszyk.html" class="relative inline-flex items-center text-sm font-medium leading-5 text-gray-900 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out">
            <Icon name="clarity:shopping-cart-solid" size="24" class="text-cyan-500" />
            <span v-if="productsCart.products.length > 0" class="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {{ productsCart.products.length > 9 ? '9+' : productsCart.products.length }}
          </span>
          </NuxtLink>
          <div v-if="!isVisibilityLimited" class="hidden sm:block ml-4 flex-shrink-0 text-sm font-medium text-red-600">
            Pomoc techniczna 507925963 7-23
          </div>
        </div>
        <div class="md:hidden flex items-center">
          <button @click="showMenu = !showMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
            <svg :class="{ 'hidden': showMenu, 'inline-flex': !showMenu }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg :class="{ 'hidden': !showMenu, 'inline-flex': showMenu }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div :class="{ 'hidden': !showMenu, 'block': showMenu }" class="md:hidden">
        <div class="pt-2 pb-3">
          <NuxtLink v-if="!isVisibilityLimited" href="/info" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            Kontakt
          </NuxtLink>
          <template v-for="page in customPages" v-if="!isVisibilityLimited">
            <NuxtLink :href="buildCustomLink(page.id)" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
              {{ page.title }}
            </NuxtLink>
          </template>
          <NuxtLink v-if="userToken && !isVisibilityLimited" href="/account" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            Konto
          </NuxtLink>
          <NuxtLink href="/Complaint" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            Zgłoś reklamację
          </NuxtLink>
          <NuxtLink v-if="userToken && !isVisibilityLimited" href="/" @click.prevent="logOut" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            Wyloguj
          </NuxtLink>
          <NuxtLink v-else href="/login" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            Zaloguj
          </NuxtLink>
          <NuxtLink href="/faq" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
            FAQ
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="searchResults.length > 0" class="fixed inset-0 overflow-hidden z-100" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="relative w-screen max-w-md">
            <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              <div class="px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                    Wyniki wyszukiwania
                  </h2>
                  <div class="ml-3 h-7 flex items-center">
                    <button @click="searchResults = []" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <span class="sr-only">Zamknij</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-6 relative flex-1 px-4 sm:px-6">
                <ul>
                  <li v-for="result in searchResults" :key="result.id" class="py-4 border-b border-gray-200">
                    <div class="flex items-center">
                      <img :src="`https://admin.mega1000.pl${result.url_for_website}`" class="h-16 w-16 object-cover rounded-full mr-4" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ result.name }}</p>
                        <p class="text-sm text-gray-500">59.99 zł</p>
                      </div>
                    </div>
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
