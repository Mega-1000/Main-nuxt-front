<script setup>
import Swal from "sweetalert2";

onMounted(() => {
  Swal.fire('Uwaga!', 'Ze względu na małą ilość styropianu w zamówieniu prosimy o wybranie punktu odbioru', 'info')
});

const warehouses = ref([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();

onMounted(() => {
  const {data: response} = shopApi.post(`/api/orders/get-warehouses-for-order/${route.query.token}`);
  warehouses.value = response;
});
</script>

<template>
  <div class="mt-12"></div>

  <div class="w-2/3 mx-auto mt-3" v-for="warehouse in warehouses">
    <input type="checkbox"> {{ warehouse.symbol }}
  </div>
</template>
