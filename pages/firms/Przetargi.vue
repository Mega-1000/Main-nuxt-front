<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const currentFirm = ref<any>(null);

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;

  currentFirm.value = response[0];
  auctions.value = response[1];

  auctions.value.forEach((auction: any) => {
    auction.offersExpanded = true;
    auction.activeOffers = auction.offers.splice(0, 3);
  });
};

const expandOffers = (auction: any) => {
  auction.offersExpanded = true;
  auction.activeOffers = auction.offers;
};

const collapseOffers = (auction: any) => {
  auction.offersExpanded = false;
  auction.activeOffers = auction.offers.splice(0, 3);
};

const showOfferTable = (auction: any) => {
  auction.offerTableShown = true;
};
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Aktualnie jesteś zalogowany jako: {{ currentFirm?.name }}</h1>
    </div>

    <SubmitButton class="mb-8">
      <a
          :href="`https://new.mega1000.pl/magazyn/aktualizacja-cen/${currentFirm?.id}/zaktualizuj`"
          target="__blank"
          class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Zaktualizuj ceny podstawowe styropianów
      </a>
    </SubmitButton>

    <div v-for="auction in auctions" class="border rounded-lg p-6 mb-8 shadow-md">
      <div class="flex flex-col md:flex-row justify-between items-center mb-4">
        <div class="flex-grow">
          <h2 class="text-2xl font-bold mb-2">Numer przetargu: {{ auction.id }}</h2>
          <p class="mb-2">Koniec przetargu: {{ auction.end_of_auction }}</p>
          <p class="mb-2">Wstępna data dostawy wskazana przez klienta: {{ auction.date_of_delivery }}</p>
          <p class="mb-2">Procentowy udział ceny: {{ auction.price }}</p>
          <p class="mb-2">Procentowy udział jakości: {{ auction.quality }}</p>
          <p class="mb-2">Data rozpoczęcia przetargu: {{ auction?.created_at?.split('T')[0] }} {{ auction?.created_at?.split('T')[1].split('.')[0] }}</p>
          <p class="mb-2">Ostatnia data aktualizacji danych przetargu: {{ auction?.updated_at?.split('T')[0] }} {{ auction?.updated_at?.split('T')[1].split('.')[0] }}</p>
        </div>
        <div class="flex flex-col md:flex-row items-center">
          <a :href="auction.editPricesLink" target="__blank" class="mb-4 md:mb-0 md:mr-4">
            <SubmitButton class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Zmień swoje ceny w tym przetargu
            </SubmitButton>
          </a>
          <button @click="showOfferTable(auction)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Zobacz tabelę ofert
          </button>
        </div>
      </div>

      <div class="mt-4">
        <table class="w-full border-collapse overflow-x-auto">
          <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">Produkt</th>
            <th class="px-4 py-2 text-left">Ilość opakowań</th>
            <th class="px-4 py-2 text-left">Ilość M3</th>
            <th class="px-4 py-2 text-left">Twoja cena</th>
            <th class="px-4 py-2 text-left">Najniższa cena na ten moment</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in auction?.chat?.order?.items" class="border-b">
            <td class="px-4 py-2">{{ item.product.name.substr(item.product.name.indexOf(" ") + 1) }}</td>
            <td class="px-4 py-2">{{ item.quantity }}</td>
            <td class="px-4 py-2">{{ Math.round(item.quantity * item.product.packing.numbers_of_basic_commercial_units_in_pack * 100) / 100 }} {{ item.product.unit_basic }}</td>
            <td
                :class="{ 'text-red-700': (lowestPrice = Math.min(...auction.offers.filter((offer) => offer.order_item_id === item.id).map((offer) => offer.basic_price_net))) > yourPrice }"
                class="px-4 py-2"
            >
              {{ yourPrice = auction.offers.filter((offer) => offer.firm_id === currentFirm.id && offer.order_item_id === item.id).sort((a, b) => a.basic_price_net - b.basic_price_net)[0]?.basic_price_net }}
              <span v-if="lowestPrice < yourPrice" class="text-red-700"> - Uwaga: Twoja oferta nie jest najniższa</span>
            </td>
            <td class="px-4 py-2">{{ lowestPrice }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<style scoped>
.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 20px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
}

.alert-text {
  color: red;
}
</style>
