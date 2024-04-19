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
  <nav class="bg-cyan-100 border-gray-500">
    <div
        class="md:flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5"
    >
        <NuxtLink :href="isVisibilityLimited ? '/' : '/sklep'" class=" flex items-center text-2xl font-semibold">
          EPH POLSKA
        </NuxtLink>

        <input type="search" class="w-[80%] md:w-[20%] p-2" v-model="searchQuery" @input="searchProduct()" placeholder="Wyszukaj produkt">

        <div v-if="searchResults.length > 0">
          <ul>
            <li v-for="result in searchResults" :key="result.id">
              {{ result.name }}
            </li>
          </ul>
        </div>


      <div class="w-[60%] text-red-600 font-bold">
        <div v-if="!isVisibilityLimited">
          Pomoc techniczna 507925963 7-23
        </div>
      </div>
      <div class="flex items-center">
        <NuxtLink href="/koszyk.html">
          <div class="flex mr-[30px]" v-if="!isVisibilityLimited">
            <Icon
                id="icon"
                name="clarity:shopping-cart-solid"
                size="60"
                class="ml-50 text-cyan-500"
            />
            <label
                for="icon"
                class="cursor-pointer font-bold text-teal-200 text-3xl ml-[-1.45em] mt-[.35em] align-center"
            >
              {{
                productsCart.products.length > 0
                    ? productsCart.products.length > 9
                        ? "9+"
                        : productsCart.products.length
                    : ``
              }}
            </label>
          </div>
        </NuxtLink>

        <div>
          <NavbarShipmentCostTable />
        </div>
      </div>
    </div>
  </nav>
  <nav class="bg-cyan-50 grid sm:flex items-center">
    <div
        class="max-w-full sm:max-w-screen-xl px-4 py-1 sm:py-3 md:px-6 mx-auto"
    >
      <div class="flex items-center mx-auto">
        <ul
            class="flex-row mt-0 mr-6 space-x-5 sm:space-x-8 text-sm md:text-md font-medium space-y-1 hidden sm:flex items-center"
        >
          <li>
            <NuxtLink v-if="!isVisibilityLimited" href="/info" class="text-gray-900 hover:underline"
            >Kontakt</NuxtLink
            >
          </li>
          <li v-for="page in customPages" v-if="!isVisibilityLimited">
            <NuxtLink
                :href="buildCustomLink(page.id)"
                class="text-gray-900 hover:underline"
            >{{ page.title }}</NuxtLink
            >
          </li>
          <li v-if="userToken">
            <NuxtLink href="/account" v-if="!isVisibilityLimited" class="text-gray-900 hover:underline"
            >Konto</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="/Complaint" class="text-gray-900 hover:underline"
            >Zgłoś reklamację</NuxtLink>
          </li>
          <li v-if="userToken" @click="logOut">
            <NuxtLink v-if="!isVisibilityLimited" href="/" class="text-gray-900 hover:underline"
            >Wyloguj</NuxtLink
            >
          </li>
          <li v-else>
            <NuxtLink href="/login" class="text-gray-900 hover:underline"
            >Zaloguj</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="/faq" class="text-gray-900 hover:underline">FAQ</NuxtLink>
          </li>
        </ul>
        <div class="mx-auto grid sm:hidden cursor-pointer" @click="toggleMenu">
          <div v-if="!showMenu">
            <Icon name="ic:outline-arrow-drop-down" size="20" />
            Rozwiń menu
          </div>

          <Icon v-else name="ic:outline-arrow-drop-up" size="20" />

          <ul class="text-sm md:text-md font-medium space-y-1" v-if="showMenu">
            <li>
              <NuxtLink href="/info" class="text-gray-900 hover:underline"
              >Kontakt</NuxtLink
              >
            </li>
            <li v-for="page in customPages">
              <NuxtLink
                  :href="buildCustomLink(page.id)"
                  class="text-gray-900 hover:underline"
              >{{ page.title }}</NuxtLink
              >
            </li>
            <li v-if="userToken">
              <NuxtLink href="/account" class="text-gray-900 hover:underline"
              >Konto</NuxtLink
              >
            </li>
            <li v-if="userToken" @click="logOut">
              <NuxtLink href="/" class="text-gray-900 hover:underline"
              >Wyloguj</NuxtLink
              >
            </li>
            <li v-else>
              <NuxtLink href="/login" class="text-gray-900 hover:underline"
              >Zaloguj</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
