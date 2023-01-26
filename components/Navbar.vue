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
            <NuxtLink
              href="/"
              class="text-gray-900 hover:underline"
              aria-current="page"
              >Strona Główna</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="#" class="text-gray-900 hover:underline"
              >Kontakt</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="#" class="text-gray-900 hover:underline"
              >Dokumenty</NuxtLink
            >
          </li>
          <li>
            <NuxtLink href="/login" class="text-gray-900 hover:underline"
              >Zaloguj</NuxtLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import logoSrc from "~~/assets/logo-no-bg.png";
</script>
