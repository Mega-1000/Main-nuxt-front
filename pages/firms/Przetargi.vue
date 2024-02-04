<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;
  auctions.value = response;
};
</script>

<template>
  <div v-for="auction in auctions" class="border p-3 mx-auto w-1/2 mt-12 text-lg flex justify-between">
    <div>
      ID: {{ auction.id }}
      <br>Koniec aukcji {{ auction.end_of_auction }}
      <br>Data dostawy {{ auction.date_of_delivery }}
      <br>Cena {{ auction.price }}
      <br>Jakość {{ auction.quality }}
      <br>Utworzona {{ auction.created_at }}
      <br>Zaktualizowana {{ auction.updated_at }}
    </div>

    <div>
      <a :href="auction.editPricesLink" target="__blank">
        <SubmitButton>
          Zmień swoje ceny w tym przetargu
        </SubmitButton>
      </a>

      <br>

      Oferty:
      <div v-for="offer in auction.offers">
        <div>
          ID: {{ offer.id }} Firma: {{ offer.firm.symbol }} Cena: {{ offer.basic_price_net }}
        </div>
      </div>
    </div>
  </div>
</template>
