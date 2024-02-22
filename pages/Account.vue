<script setup lang="ts">
import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import OrderItem from "~~/components/account/OrderItem.vue";
import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";

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

  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
      </li>
      <!-- Generate page numbers dynamically based on totalPages -->
      <li class="page-item" :class="{ active: currentPage === page }" v-for="page in totalPages" :key="page">
        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
      </li>
    </ul>
  </nav>
</template>
