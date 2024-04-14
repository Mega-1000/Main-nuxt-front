<script setup lang="ts">
  import { getToken, removeCookie } from "~~/helpers/authenticator";
  import { getPages } from "~~/helpers/customPages";
  import Cart from "~~/utils/Cart";

  const { $shopApi: shopApi } = useNuxtApp();
  const productsCart = useProductsCart();
  const router = useRouter();
  const isVisibilityLimited = ref(false);
  const userToken = useUserToken();
  const isUserLoggedIn = ref(false);

  onMounted(() => {
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
</script>
<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto flex justify-between items-center py-4 px-6">
      <nuxt-link href="/" class="text-2xl font-bold text-cyan-500">EPH POLSKA SP Z O.O.</nuxt-link>
      <div v-if="!isVisibilityLimited" class="flex items-center">
        <div class="text-red-600 font-bold mr-6 hidden md:block">
          Pomoc techniczna 507925963 7-23
        </div>
        <nuxt-link href="/koszyk.html" class="flex items-center mr-6">
          <icon-cart :count="productsCart.products.length" />
        </nuxt-link>
        <nav-shipment-cost-table />
      </div>
    </nav>
  </header>

  <nav class="bg-cyan-50 py-2">
    <div class="container mx-auto flex justify-center items-center">
      <ul class="flex space-x-6 sm:space-x-8 text-sm sm:text-base font-medium">
        <li v-if="!isVisibilityLimited">
          <nuxt-link to="/info" class="hover:text-cyan-500">Kontakt</nuxt-link>
        </li>
        <li v-for="page in customPages" v-if="!isVisibilityLimited">
          <nuxt-link :to="buildCustomLink(page.id)" class="hover:text-cyan-500">{{ page.title }}</nuxt-link>
        </li>
        <li v-if="userToken">
          <nuxt-link to="/account" v-if="!isVisibilityLimited" class="hover:text-cyan-500">Konto</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/Complaint" v-if="isVisibilityLimited" class="hover:text-cyan-500">Zgłoś reklamację</nuxt-link>
        </li>
        <li v-if="userToken" @click="logOut">
          <nuxt-link to="/" v-if="!isVisibilityLimited" class="hover:text-cyan-500">Wyloguj</nuxt-link>
        </li>
        <li v-else>
          <nuxt-link to="/login" class="hover:text-cyan-500">Zaloguj</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/faq" v-if="isVisibilityLimited" class="hover:text-cyan-500">FAQ</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/faq" v-if="isVisibilityLimited" class="hover:text-cyan-500">Koszyk</nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
