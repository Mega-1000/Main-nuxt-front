<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const offers = ref<[]>([]);

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;
  auctions.value = response.data;

  auctions.value.forEach((auction: any) => {
    auction.offersExpanded = false;
    auction.activeOffers = auction.offers.splice(0, 3);
  });
};

const toggleOffers = (auction: any) => {
  if (auction.offersExpanded) {
    collapseOffers(auction);
  } else {
    expandOffers(auction);
  }
};

const expandOffers = (auction: any) => {
  auction.offersExpanded = true;
  auction.activeOffers = auction.offers;
};

const collapseOffers = (auction: any) => {
  auction.offersExpanded = false;
  auction.activeOffers = auction.offers.splice(0, 3);
};
</script>

<template>
  <div class="auctions-container">
    <div v-for="auction in auctions" class="auction-card">
      <div class="auction-header">
        <h2>Numer przetargu: {{ auction.id }}</h2>
        <p>Koniec przetargu: {{ auction.end_of_auction }}</p>
      </div>
      <div class="auction-details">
        <p>Data dostawy: {{ auction.date_of_delivery }}</p>
        <p>Cena: {{ auction.price }}%, Jakość: {{ auction.quality }}%</p>
        <p>Data rozpoczęcia: {{ auction.created_at }}</p>
        <button @click="toggleOffers(auction)" class="toggle-offers-btn">{{ auction.offersExpanded ? 'Ogranicz' : 'Wyświetl wszystkie' }} oferty</button>
      </div>
      <div v-if="auction.offersExpanded" class="offers-list">
        <div v-for="offer in auction.activeOffers" class="offer">
          <span>ID: {{ offer.id }}</span>
          <span>Firma: {{ offer.firm.symbol }}</span>
          <span>Cena: {{ offer.basic_price_net }}</span>
          <div class="offer-details">
            <p>Cena za opakowanie: {{ offer.commercial_price_net }}</p>
            <p>Cena za m3: {{ offer.basic_price_net }}</p>
            <p>Cena za m2: {{ offer.calculated_price_net }}</p>
          </div>
        </div>
      </div>

      <a :href="auction.editPricesLink" target="__blank" class="edit-prices-link">Zmień swoje ceny</a>
    </div>
  </div>
</template>

<style scoped>
.auction-card {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  width: 50vw;
  margin: 0 auto;
  margin-top: 40px;
}

.auction-card:hover {
  transform: translateY(-5px);
}

.auction-header h2, .auction-header p {
  margin: 0;
  padding: 16px;
  background-color: #007BFF;
  color: white;
}

.auction-details, .offers-list {
  padding: 16px;
}

.toggle-offers-btn {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.offer {
  background: #F8F9FA;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.edit-prices-link {
  display: inline-block;
  background-color: #28A745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
  margin: 10px;
}
</style>
