<script setup lang="ts">
import logoSrc from "~~/assets/logo-no-bg.png";
import { getToken, removeCookie } from "~~/helpers/authenticator";
import { getPages } from "~~/helpers/customPages";
import Cart from "~~/utils/Cart";

const { $shopApi: shopApi } = useNuxtApp();

const productsCart = useProductsCart();

const userToken = useUserToken();
userToken.value = getToken();
const { data: newMessagesNumber } = useAsyncData(async () => {
  if (userToken.value) {
    const res = await shopApi.get("/api/chat/getHistory");
    return res.data.reduce(
      (prev: number, current: any) => (current.new_message ? prev + 1 : prev),
      0
    );
  }

  return null;
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
};

onMounted(() => {
  const cart = new Cart();
  cart.init();
  productsCart.value = cart;
});
</script>

<template>
  <nav class="bg-cyan-100 border-gray-500">
    <div
      class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5"
    >
      <NuxtLink href="/" class="flex items-center">
        <img :src="logoSrc" class="h-30 mr-3 sm:h-25" alt="Logo" />
      </NuxtLink>
      <div class="flex items-center">
        <NuxtLink href="/cart">
          <div class="flex mr-5">
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
      </div>
    </div>
  </nav>
  <nav class="bg-cyan-50">
    <div class="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
      <div class="flex items-center">
        <ul
          class="flex flex-row mt-0 mr-6 space-x-8 text-sm md:text-md font-medium"
        >
          <li>
            <NuxtLink href="/" class="text-gray-900 hover:underline"
              >Strona Główna</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="/info" class="text-gray-900 hover:underline"
              >Informacje</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="/contact" class="text-gray-900 hover:underline"
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
            <NuxtLink href="/chat" class="text-gray-900 hover:underline"
              >Chat
              <span v-if="newMessagesNumber > 0"
                >({{ newMessagesNumber }})</span
              ></NuxtLink
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
  </nav>
</template>
