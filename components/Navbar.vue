<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5"
    >
      <a href="https://flowbite.com" class="flex items-center">
        <img src="{{logoSrc}}" class="h-10 mr-3 sm:h-9" alt="Logo" />
      </a>
      <div class="flex items-center">
        <a
          href="#"
          class="text-md font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >Zaloguj</a
        >
      </div>
    </div>
  </nav>
  <nav class="bg-gray-50 dark:bg-gray-700">
    <div class="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
      <div class="flex items-center">
        <ul class="flex flex-row mt-0 mr-6 space-x-8 text-md font-medium">
          <li>
            <a
              href="/"
              class="text-gray-900 dark:text-white hover:underline"
              aria-current="page"
              >Strona Główna</a
            >
          </li>
          <li>
            <a href="#" class="text-gray-900 dark:text-white hover:underline"
              >Kontakt</a
            >
          </li>
          <li>
            <a href="#" class="text-gray-900 dark:text-white hover:underline"
              >Dokumenty</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      logoSrc: `${process.env.APP_STORAGE}/images/logo.png`,
    };
  },
};
</script>
