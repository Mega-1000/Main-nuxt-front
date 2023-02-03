<script setup lang="ts">
import logoSrc from "~~/assets/logo-no-bg.png";
import { getToken, removeCookie } from "~~/helpers/authenticator";
import { getPages } from "~~/helpers/customPages";

const { $shopApi: shopApi } = useNuxtApp();

const token = ref(getToken());
const { data: newMessagesNumber } = useAsyncData(async () => {
  if (token.value) {
    const res = await shopApi.get("/api/chat/getHistory");
    return res.data.reduce(
      (prev: number, current: any) => (current.new_message ? prev + 1 : prev),
      0
    );
  }

  return null;
});

const { data: customPages } = useAsyncData(
  async () => (await getPages(shopApi)).customPages[0].content,
  { server: false }
);

const buildCustomLink = (pageId: number) => `/custom/${pageId}`;

const logOut = () => {
  removeCookie();
  token.value = getToken();
};
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
        <Icon
          name="clarity:shopping-cart-solid"
          size="60"
          class="ml-50 text-cyan-500"
        />
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
          <li v-if="token">
            <NuxtLink href="/chat" class="text-gray-900 hover:underline"
              >Chat
              <span v-if="newMessagesNumber > 0"
                >({{ newMessagesNumber }})</span
              ></NuxtLink
            >
          </li>
          <li v-if="token">
            <NuxtLink href="/account" class="text-gray-900 hover:underline"
              >Konto</NuxtLink
            >
          </li>
          <li v-if="token" @click="logOut">
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
