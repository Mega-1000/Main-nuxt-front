<script setup lang="ts">
import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import OrderItem from "~~/components/account/OrderItem.vue";

const { $shopApi: shopApi } = useNuxtApp();

// Fetch orders function with pagination
const currentPage = ref(1);
const totalPages = ref(0);
const currentTab = ref('active');
let orders = reactive({ active: [], inactive: [], all: [] });

// Adjusted fetchOrders to directly update the orders ref
const fetchOrders = async (page) => {
  try {
    const fetchOrders = async (page) => {
      try {
        const inactiveStatusIds = [6, 8];
        const res = await shopApi.get(`/api/orders/getAll?page=${page}`);
        totalPages.value = res.data.last_page;
        orders.active = res.data.data.filter(order => !inactiveStatusIds.includes(order.status.id) && order.is_hidden === 0);
        orders.inactive = res.data.data.filter(order => inactiveStatusIds.includes(order.status.id));
        orders.all = res.data.data;
      } catch (e) {
        console.error(e);
      }
    };
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
  currentPage.value = page;
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

const changeTab = (tabName) => {
  currentTab.value = tabName;
};
</script>

<template>
  <div class="mb-5 border-b border-gray-200 mt-5 flex justify-center">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-black" id="tabExample" role="tablist">
      <li class="mr-2" role="presentation">
        <button @click="changeTab('active')" :class="{'border-b-2 border-blue-500': currentTab === 'active'}" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300" role="tab">
          Aktywne
        </button>
      </li>
      <li class="mr-2" role="presentation">
        <button @click="changeTab('inactive')" :class="{'border-b-2 border-blue-500': currentTab === 'inactive'}" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300" role="tab">
          Nieaktywne
        </button>
      </li>
      <li class="mr-2" role="presentation">
        <button @click="changeTab('all')" :class="{'border-b-2 border-blue-500': currentTab === 'all'}" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300" role="tab">
          Wszystkie
        </button>
      </li>
    </ul>
  </div>

  <div id="tabContentExample" class="pb-20">
    <div v-show="currentTab === 'active'" id="active-content" role="tabpanel">
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders.active" :key="order.id">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div v-show="currentTab === 'inactive'" id="inactive-content" role="tabpanel">
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders.inactive" :key="order.id">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div v-show="currentTab === 'all'" id="all-content" role="tabpanel">
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders.all" :key="order.id">
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
