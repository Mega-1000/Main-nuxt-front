<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;

  // const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;
  auctions.value = [
    {
      "id": 36,
      "end_of_auction": "2024-02-08",
      "date_of_delivery": "2024-02-16",
      "price": 50,
      "quality": 50,
      "chat_id": 10555,
      "confirmed": 1,
      "created_at": "2024-02-03T09:37:34.000000Z",
      "updated_at": "2024-02-03T09:43:02.000000Z"
    }
  ]

  // auctions.value = response.data;
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
      <SubmitButton>
        Zobacz ten przetarg
      </SubmitButton>

      Oferty:
      <div v-for="offer in auction.offers">
        <div>
          ID: {{ offer.id }}
          <br>Symbol firmy: {{ offer.firm.symbol }}
          <br>Cena: {{ offer.basic_price_net }}
        </div>
      </div>
    </div>
  </div>
</template>
