<script setup lang="ts">
const auctions = ref<[]>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;

  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;

  auctions.value = response.data;
};
</script>

<template>
  <div v-for="auction in auctions">
    {{ auction }}
  </div>
</template>
