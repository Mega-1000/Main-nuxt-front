<script setup>
import { Tabs } from "flowbite";
import OrderItem from "~~/components/account/OrderItem.vue";

const { $shopApi: shopApi } = useNuxtApp();

// Fetch orders function with pagination
const currentPage = ref(1);
const totalPages = ref(0);
const currentTab = ref('active');
let orders = reactive({ active: [], inactive: [], all: [] });

const navigationLink = ref(null);
const profileLink = ref(null);
const settingsLink = ref(null);
const logoutLink = ref(null);
const navLinks = ref(null);

const tutorialActive = ref(false);
const tutorialTitle = ref('');
const tutorialDescription = ref('');
const tutorialHighlightStyle = reactive({});
const tutorialNextButtonText = ref('Next');
const tutorialStep = ref(0);


// Adjusted fetchOrders to directly update the orders ref
const fetchOrders = async (page) => {
  try {
    const inactiveStatusIds = [6, 8];
    const res = await shopApi.get(`/api/orders/getAll?page=${page}`);
    totalPages.value = res.data.last_page;
    orders.active = res.data.data.filter(order => !inactiveStatusIds.includes(order.status.id) && order.is_hidden === 0);
    orders.inactive = res.data.data.filter(order => inactiveStatusIds.includes(order.status.id) && order.is_hidden === 1);
    orders.all = res.data.data;
  } catch (e) {
    console.error(e);
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
  const tabElements = [
    // Define your tab elements here
  ];
  const tabsOptions = {
    // Define your tabs options here
  };
  const tabs = new Tabs(tabElements, tabsOptions);
  tabs.show("active");
}

const changeTab = (tabName) => {
  currentTab.value = tabName;
};


const showTutorial = () => {
  tutorialActive.value = true;

  switch (tutorialStep.value) {
    case 0:
      tutorialTitle.value = 'Welcome';
      tutorialDescription.value = 'This tutorial will guide you through the user dashboard.';
      tutorialHighlightStyle.top = navLinks.value.offsetTop + 'px';
      tutorialHighlightStyle.left = navLinks.value.offsetLeft + 'px';
      tutorialHighlightStyle.width = navLinks.value.offsetWidth + 'px';
      tutorialHighlightStyle.height = navLinks.value.offsetHeight + 'px';
      tutorialNextButtonText.value = 'Start';
      break;
    case 1:
      tutorialTitle.value = 'Navigation';
      tutorialDescription.value = 'This is your navigation menu. Click on the items to access different sections.';
      const navigationLinkRect = navigationLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = navigationLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = navigationLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = navigationLinkRect.width + 'px';
      tutorialHighlightStyle.height = navigationLinkRect.height + 'px';
      break;
    case 2:
      tutorialTitle.value = 'Profile';
      tutorialDescription.value = 'Click here to view and update your profile information.';
      const profileLinkRect = profileLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = profileLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = profileLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = profileLinkRect.width + 'px';
      tutorialHighlightStyle.height = profileLinkRect.height + 'px';
      break;
    case 3:
      tutorialTitle.value = 'Settings';
      tutorialDescription.value = 'Customize your preferences and settings from here.';
      const settingsLinkRect = settingsLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = settingsLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = settingsLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = settingsLinkRect.width + 'px';
      tutorialHighlightStyle.height = settingsLinkRect.height + 'px';
      break;
    case 4:
      tutorialTitle.value = 'Logout';
      tutorialDescription.value = 'Click here to logout from your account.';
      const logoutLinkRect = logoutLink.value.getBoundingClientRect();
      tutorialHighlightStyle.top = logoutLinkRect.top + window.pageYOffset + 'px';
      tutorialHighlightStyle.left = logoutLinkRect.left + window.pageXOffset + 'px';
      tutorialHighlightStyle.width = logoutLinkRect.width + 'px';
      tutorialHighlightStyle.height = logoutLinkRect.height + 'px';
      tutorialNextButtonText.value = 'Finish';
      break;
  }
};

const nextTutorialStep = () => {
  if (tutorialStep.value === 4) {
    tutorialActive.value = false;
  } else {
    tutorialStep.value++;
    showTutorial();
  }
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

  <div class="max-w-7xl mx-auto">
    <SubmitButton class="max-w-7xl mx-auto my-4" :ref="profileLink">
      <nuxt-link href="/EditAccountInformations">
        Edytuj adresy i dane powiązane z twoim kontem
      </nuxt-link>
    </SubmitButton>
  </div>

  <div id="tabContentExample" class="pb-20">
    <div v-if="currentTab === 'active'" id="active-content" role="tabpanel">
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders.active" :key="order.id">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div v-if="currentTab === 'inactive'" id="inactive-content" role="tabpanel">
      <div class="grid space-y-10">
        <div class="flex justify-center" v-for="order in orders.inactive" :key="order.id">
          <OrderItem :item="order" />
        </div>
      </div>
    </div>
    <div v-if="currentTab === 'all'" id="all-content" role="tabpanel">
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

  <div v-if="tutorialActive" class="tutorial-overlay">
    <div class="tutorial-modal">
      <div class="tutorial-content">
        <h3>{{ tutorialTitle }}</h3>
        <p>{{ tutorialDescription }}</p>
        <div class="tutorial-highlight" style="position: fixed" :style="tutorialHighlightStyle">
          <slot name="tutorial-highlight"></slot>
        </div>
        <button @click="nextTutorialStep">{{ tutorialNextButtonText }}</button>
      </div>
    </div>
  </div>

</template>
