<script setup lang="ts">
import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import OrderItem from "~~/components/account/OrderItem.vue";

const { $shopApi: shopApi } = useNuxtApp();

// Fetch orders function with pagination
const currentPage = ref(1);
const totalPages = ref(0);
let orders = reactive({ active: [], inactive: [], all: [] });

// Adjusted fetchOrders to directly update the orders ref
const fetchOrders = async (page) => {
  try {
    const inactiveStatusIds = [6, 8];
    const res = await shopApi.get(`/api/orders/getAll?page=${page}`);
    totalPages.value = res.data.last_page; // Update total pages from response
    // Directly updating orders ref
    orders = {
      active: res.data.data.filter(
          order => !inactiveStatusIds.includes(order.status.id) && order.is_hidden === 0
      ),
      inactive: res.data.data.filter(order =>
          inactiveStatusIds.includes(order.status.id)
      ),
      all: res.data.data,
    };

    console.log(orders);
  } catch (e) {
    console.error(e);
    // Handle error appropriately
  }
};

// Watch currentPage for changes and re-fetch orders
watch(currentPage, (newPage) => {
  fetchOrders(newPage);
});

// Initial fetch moved to onMounted to ensure it runs once component is mounted
onMounted(() => {
  fetchOrders(currentPage.value);
  // Other setup tasks
});

// Ensure goToPage method updates currentPage correctly
const goToPage = (page) => {
  currentPage.value = page; // This should trigger the watch effect
};

// Setup tabs - assuming this logic is needed for your component
function setupTabs() {
  const tabElements: TabItem[] = [
    // Define your tab elements here
  ];
  const tabsOptions: TabsOptions = {
    // Define your tabs options here
  };
  const tabs: TabsInterface = new Tabs(tabElements, tabsOptions);
  tabs.show("active");
}
</script>

<template>
  <div class="mb-5 border-b border-gray-200 mt-5 flex justify-center">
    <ul
      class="flex flex-wrap -mb-px text-sm font-medium text-center text-black"
      id="tabExample"
      role="tablist"
    >
      <li class="mr-2" role="presentation">
        <button
          class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
          id="active-tab"
          type="button"
          role="tab"
          aria-controls="active-content"
          aria-selected="false"
        >
          Aktywne
        </button>
      </li>
      <li class="mr-2" role="presentation">
        <button
          class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
          id="inactive-tab"
          type="button"
          role="tab"
          aria-controls="inactive-content"
          aria-selected="false"
        >
          Nieaktywne
        </button>
      </li>
      <li class="mr-2" role="presentation">
        <button
          class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
          id="all-tab"
          type="button"
          role="tab"
          aria-controls="all-content"
          aria-selected="false"
        >
          Wszystkie
        </button>
      </li>
      <li class="mr-2" role="presentation">
        <nuxt-link
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
            id="active-tab"
            type="button"
            role="tab"
            aria-controls="active-content"
            aria-selected="false"
            href="/EditAccountInformations"
        >
          Edycja/korekta danych konta
        </nuxt-link>
      </li>
    </ul>
  </div>

  <div id="tabContentExample" class="pb-20">
    <div
      id="active-content"
      role="tabpanel"
      aria-labelledby="active-tab"
    >
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders?.active">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div
      class="hidden"
      id="inactive-content"
      role="tabpanel"
      aria-labelledby="inactive-tab"
    >
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders?.inactive">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div
      class="hidden"
      id="all-content"
      role="tabpanel"
      aria-labelledby="all-tab"
    >
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders?.all">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
  </div>

  <nav aria-label="Page navigation" class="flex justify-center mt-4 mb-16">
    <ul class="inline-flex items-center -space-x-px">
      <li :class="{ 'opacity-50': currentPage === 1 }">
        <button
            class="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            @click="currentPage > 1 && goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
        >
          Poprzednia
        </button>
      </li>
      <li v-for="page in totalPages" :key="page" :class="{ 'bg-blue-500 border-blue-500 text-white': currentPage === page, 'border-gray-300 text-gray-500 hover:bg-gray-100': currentPage !== page }">
        <button
            class="py-2 px-3 leading-tight bg-white border hover:text-gray-700"
            @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
      <li :class="{ 'opacity-50': currentPage === totalPages }">
        <button
            class="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            @click="currentPage < totalPages && goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
        >
          Następna
        </button>
      </li>
    </ul>
  </nav>

</template>
