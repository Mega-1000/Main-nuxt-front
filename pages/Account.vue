<script setup lang="ts">
import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import OrderItem from "~~/components/account/OrderItem.vue";
import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";

const { $shopApi: shopApi } = useNuxtApp();

const { data: orders } = useAsyncData(async () => {
  try {
    const inactiveStatusIds = [6, 8];
    const res = await shopApi.get("/api/orders/getAll");
    const activeOrders = res.data.filter(
      (order: any) => !inactiveStatusIds.includes(order.status.id) && order.is_hidden === false
    );
    const inactiveOrders = res.data.filter((order: any) =>
      inactiveStatusIds.includes(order.status.id)
    );
    return {
      active: activeOrders,
      inactive: inactiveOrders,
      all: res.data,
    };
  } catch (e) {}
});

onMounted(() => {
  checkIfUserIsLoggedIn('Aby pzrejść to twojego konta zaloguj się lub zarejestruj');
  // create an array of objects with the id, trigger element (eg. button), and the content element
  const tabElements: TabItem[] = [
    {
      id: "active",
      triggerEl: document.querySelector("#active-tab")!,
      targetEl: document.querySelector("#active-content")!,
    },
    {
      id: "inactive",
      triggerEl: document.querySelector("#inactive-tab")!,
      targetEl: document.querySelector("#inactive-content")!,
    },
    {
      id: "all",
      triggerEl: document.querySelector("#all-tab")!,
      targetEl: document.querySelector("#all-content")!,
    },
  ];

  const tabsOptions: TabsOptions = {
    defaultTabId: "active",
    activeClasses: "text-blue-600 hover:text-blue-600 border-blue-600",
    inactiveClasses:
      "text-gray-500 hover:text-gray-600 border-gray-400 hover:border-gray-300",
  };

  const tabs: TabsInterface = new Tabs(tabElements, tabsOptions);
  tabs.show("active");
});
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
      class="hidden"
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
</template>
