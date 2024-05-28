<script setup lang="ts">
import Cookies from "universal-cookie/cjs/Cookies";
import { getToken, setCookie } from "~~/helpers/authenticator";
import transportPrice from "~~/helpers/transportPrice";
import Cart from "~~/utils/Cart";
import Swal from "sweetalert2";
import shipmentCostBruttoFn from "~/helpers/ShipmentCostCalculator";
import emitter from "~/helpers/emitter";
import ShipmentCostCalculator from "~/helpers/PackageCalculator";
import swal from "sweetalert2";

const { query } = useRoute();
const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();
const productsCart = useProductsCart();
const state = ref<any>();
const selfPickup = ref(false);
const userName = ref('');

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
    return res.data;
  } catch (e: any) { }
});

const userToken = useUserToken();

const userData = ref<any>();

let emailInput = ref(userData?.value?.email || "");
let phoneInput = ref(userData?.value?.phone || "");
let postalCodeInput = userData?.value?.postal_code || "";
let cityInput = userData?.value?.city || "";
let additionalNoticesInput = "";
let abroadInput = false;
let rulesInput = false;
let files: any[] = [];
const message = ref("");
const auctionInput = ref('');
const deliveryStartDate = ref('');
const deliveryEndDate = ref('');
const route = useRoute();

onBeforeMount(async () => {
  await init();
});

const init = async () => {
  const timeOut = query.isEdition ? 10 : 0;
  setTimeout(async () => {
    const cookies = new Cookies();
    let cart_token;
    if (query && query.user_code) {
      try {
        const res = await shopApi.post(`api/auth/code/${query.user_code}`);
        setCookie(res.data);
        userToken.value = getToken();
      } catch (error) {
        console.log(error);
      }
    }
    if (query && query?.cart_token) {
      cart_token = query.cart_token;
      cookies.set("cart_token", cart_token);
    } else {
      cart_token = cookies.get("cart_token");
    }

    const res = await shopApi.get("api/user");
    if (res.status === 200 && res.data) {
      userData.value =
          res.data.addresses.filter(
              (address: any) => address.type === "STANDARD_ADDRESS"
          )[0] || {};
    }

    state.value = {
      ...state.value,
      cart_token: cart_token,
    };
  }, timeOut);
}

watch([userData], () => {
  emailInput.value = userData?.value?.email || "";
  phoneInput.value = userData?.value?.phone || "";
  postalCodeInput = userData?.value?.postal_code || "";
  cityInput = userData?.value?.city || "";
});

const router = useRouter();

const prepareCartEdition = async (cart: Cart, token: any) => {
  try {
    const res = await shopApi.get(`api/orders/getByToken/${token}`);
    cart.removeAllFromCart();
    res.data.map((product: any) => cart.addToCart(product, product.amount));
  } catch (ex: any) {
    router.push("/");
    console.log(ex.message);
  }
};

const getPackagesNumber = async (cart: Cart) => {
  try {
    const response = await shopApi.post(
        "api/packages/count",
        cart.idsWithQuantity()
    );

    state.value = {
      ...state.value,
      packages: response.data,
      transportPrice: transportPrice(response.data),
    };
  } catch (error: any) {
    state.value = {
      ...state.value,
      errorText:
          (error.response &&
              error.response.data &&
              error.response.data.error_message) ||
          "Wystąpił błąd, proszę spróbować później",
    };
  }
};

onMounted(async () => {
  const cart = new Cart();
  cart.init();

  if (query?.cart_token && !cart.getEditedCart() || query?.reloadCart) await prepareCartEdition(cart, query?.cart_token);
  await getPackagesNumber(cart);

  if (route.query.cart_token) {
    window.location.href = 'https://mega1000.pl/koszyk.html';
    return
  }

  window.dispatchEvent(new CustomEvent('token-refreshed'));

  productsCart.value = cart;
});

const handleDelete = async () => {
  productsCart.value.init();
  await getPackagesNumber(productsCart.value);

  emitter.emit("cart:change");

  window.location.reload();
};
const updateAmount = (productId: number, value: string | number) => {
  const idx = productsCart.value.getIdxByProductId(productId);
  if (idx === -1) {
    return;
  }
  productsCart.value.changeAmount(idx, value);
  getPackagesNumber(productsCart.value);
};

const prepareSpecialProducts = (item: any) => {
  let products: any[] = [];
  item.packagesList.forEach((item: any) => {
    products = products.concat(item.productList);
  });
  products = products.reduce((prev, current) => {
    const existingElement = prev.find((el: any) => el.id === current.id);
    if (existingElement) {
      existingElement.quantity += current.quantity;
    } else {
      prev.push(current);
    }
    return prev;
  }, []);
  return products;
};

const loading = ref(false);
const errorText2 = ref<string | null>(null);

const handleFiles = (filesInput: any[]) => {
  files = filesInput;
};

const areFilesValid = (files: any[]) => {
  const availableFileExtensions = ["png", "jpg", "jpeg", "pdf", "tif", "gif"];

  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.substring(files[i].name.lastIndexOf(".") + 1);
    if (!availableFileExtensions.includes(ext)) return false;
  }

  return true;
};

const handleSubmit = async (e: Event | null) => {
  e ? e.preventDefault() : null;
  loading.value = true;

  if (files.length > 0 && !areFilesValid(files)) {
    errorText2.value = "Nieprawidłowe pliki";
    loading.value = false;
    return;
  }
  let hideFromCustomer = false;

  if (localStorage.getItem('isAdmin') == 'true') {
    Swal.fire({
      title: 'Ukryć przed klientem?',
      text: "Czy chcesz ukryć zamówienie przed klientem?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        hideFromCustomer = true;
      }
    })
  }

  const params = {
    customer_login: emailInput.value,
    phone: phoneInput.value,
    customer_notices: additionalNoticesInput,
    delivery_address: {
      city: cityInput,
      postal_code: postalCodeInput,
    },
    shipping_abroad: abroadInput,
    is_standard: true,
    files,
    order_items: productsCart.value.idsWithQuantity(),
    rewrite: 0,
    need_support: true,
    update_email: true,
    hide_from_customer: hideFromCustomer,
    packages: ShipmentCostCalculator(productsCart.value.products),
    register_reffered_user_id: localStorage.getItem('registerRefferedUserId') || null,
    createAuction: auctionInput.value,
    delivery_start_date: deliveryStartDate.value,
    delivery_end_date: deliveryEndDate.value,
    user_name: userName.value,
  };

  try {
    const res = await shopApi.post("/api/new_order", params);
    const cookies = new Cookies();
    cookies.set("token", res.data.access_token);

    window.dispatchEvent(new CustomEvent('token-refreshed'));
    return res.data;
  } catch (err: any) {
    errorText2.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};

const config = useRuntimeConfig().public;

const handleSubmitWithToken = async () => {
  loading.value = true;

  const cookies = new Cookies();

  const params = {
    order_items: productsCart.value.idsWithQuantity(),
    rewrite: 0,
    cart_token: cookies.get("cart_token"),
    customer_login: '',
  };

  try {
    const res = await shopApi.post("/api/new_order", params);

    if (res.status === 200) {
      productsCart.value.removeAllFromCart();
      cookies.remove("cart_token");
      message.value = "Oferta została nadpisana na starą ofertę ale prosimy pamiętać że jest to niebezpieczne ponieważ klient po dostawie może się kłócić ze dostał nie to co  miał w ofercie i na dowód pokazać starą a upierać się że o nowej nic nie wie. Można sporadycznie tak robić bo ułatwia to temat gdy już jakieś zostały np dokonane wpłaty lub towar wyjechał na listach i jest dużo roboty aby dokonać zmiany do nowej oferty ale musimy być pewnie że klient nie będzie miał podstaw do reklamacji";
      router.push("/success");
    }
  } catch (err: any) {
    errorText2.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="query.isEdition">
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-slide-in-left mx-auto w-2/3" role="alert">
      <span class="block sm:inline">Edutujesz swoje zapytanie! Jeśli chcesz dodać produkt kliknij na sklep i dodaj produkt do koszyka.</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
      </span>
    </div>
  </div>

  <div v-if="!productsCart?.products || productsCart?.products?.length === 0" class="text-center py-20 animate-fade mx-auto w-fit">
    <h2 class="text-2xl md:text-4xl font-bold text-gray-600">Twój koszyk jest pusty</h2>
    <p class="mt-4 text-gray-500">Rozpocznij zakupy i dodaj produkty do koszyka.</p>
  </div>

  <div class="md:flex md:flex-row md:mt-8 md:w-5/6 md:gap-4 md:mx-auto">
    <div>
      <div class="grid grid-cols-1 space-y-8">
        <p class="mt-2 text-sm text-red-600" v-if="state?.errorText">{{ state?.errorText }}</p>
        <template v-if="state?.cart_token">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-slide-in-right" role="alert">
            <span class="block sm:inline">Uwaga! To jest edycja koszyka.</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </span>
          </div>

          <div class="flex items-center mb-4 animate-slide-in-left">
            <input id="default-checkbox" type="checkbox" v-model="isNewOrder" class="h-4 w-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2" />
            <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900">Czy to jest nowe zamówienie?</label>
          </div>
        </template>
        <button type="button" @click="productsCart.removeAllFromCart" v-if="!(!productsCart?.products || productsCart?.products?.length === 0)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded animate-bounce">
          Usuń wszystko
        </button>

        <div v-for="product in productsCart.products" class="max-w-[100vw]" v-tooltip.auto-start="ShipmentCostItemsLeftText(product)">
          <div class="flex flex-col md:flex-row md:items-center bg-white shadow-lg rounded-lg overflow-hidden animate-slide-in-left">
            <div class="w-full md:w-1/3 bg-gray-100">
              <img :src="buildImgRoute(product?.url_for_website)" alt="Zdjęcie produktu" class="h-64 w-full object-cover" />
            </div>
            <div class="w-full md:w-2/3 p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">{{ product.name }}</h3>
                <div class="flex space-x-2">
                  <button v-if="state?.cart_token" @click="() => updateProduct(productsCart, product.product_id, product.amount, product.id)" type="button" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                    Przelicz po cenie z CSV
                  </button>
                  <button @click="async () => { productsCart.removeFromCart(product.id); await handleDelete(); }" type="button" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded animate-bounce">
                    Usuń
                  </button>
                </div>
              </div>
              <CartPriceTable class="w-full pb-10" :product="product" :handle-product-amount="(val) => updateAmount(product.id, val)" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="productsCart?.products && productsCart?.products?.length > 0" class="bg-white shadow-lg rounded-lg p-6 mt-8 animate-slide-in-right">
        <h5 class="text-2xl font-bold mb-4">Podsumowanie</h5>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Produkt</th>
              <th scope="col" class="px-6 py-3">Ilość</th>
              <th scope="col" class="px-6 py-3">Cena netto</th>
              <th scope="col" class="px-6 py -3">Cena brutto</th>
              <th scope="col" class="px-6 py-3">Wartość netto</th>
              <th scope="col" class="px-6 py-3">Wartość brutto</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in productsCart.products" class="bg-white border-b hover:bg-gray-50">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 max-w-sm md:max-w-lg">{{ product.name }}</th>
              <td class="px-6 py-4">{{ product.amount }} {{ product.unit_commercial }}</td>
              <td class="px-6 py-4">{{ product.net_selling_price_commercial_unit || 0 }} {{ product.currency || "PLN" }}</td>
              <td class="px-6 py-4">{{ product.gross_price_of_packing || 0 }} {{ product.currency|| "PLN" }}</td>
              <td class="px-6 py-4">{{ (parseFloat(product.net_selling_price_commercial_unit) * product.amount).toFixed(2) || 0 }} {{ product.currency || "PLN" }}</td>
              <td class="px-6 py-4">{{ (parseFloat(product.gross_price_of_packing) * product.amount).toFixed(2) || 0 }} {{ product.currency || "PLN" }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-8 border-t pt-4">
          <div class="flex justify-between mb-4">
            <p class="text-lg font-medium">Łączne zamówienie</p>
            <div>
              <p class="text-md">Netto: {{ productsCart.nettoPrice() }} PLN</p>
              <p class="text-md">Brutto: {{ productsCart.grossPrice() }} PLN</p>
            </div>
          </div>
          <div class="flex justify-between mb-4">
            <p class="text-lg font-medium">Koszt transportu</p>
            <p class="text-md">{{ shipmentCostBrutto }} PLN</p>
          </div>
          <div class="flex justify-between mb-4">
            <p class="text-lg font-medium">Łączny koszt zamówienia z transportem</p>
            <p class="text-md">{{ (parseFloat(productsCart.grossPrice()) + shipmentCostBrutto.value).toFixed(2) }} PLN</p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center">
          <button
              type="button"
              @click="createChat(false)"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mt-4 w-full md:w-auto">
            Wyślij zapytanie ofertowe
          </button>
          <button
              type="button"
              @click="handleSubmitWithToken"
              v-if="state?.cart_token && isNewOrder"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full md:w-auto">
            Złóż nowe zamówienie
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-10 md:w-5/6 mx-auto animate-fade">
    <h2 class="text-2xl font-bold text-gray-800">Dane kontaktowe</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="flex flex-col">
          <label for="userName" class="text-sm text-gray-600">Imię i Nazwisko</label>
          <input type="text" id="userName" v-model="userName" class="mt-1 px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex flex-col">
          <label for="email" class="text-sm text-gray-600">Email</label>
          <input type="email" id="email" v-model="emailInput" class="mt-1 px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex flex-col">
          <label for="phone" class="text-sm text-gray-600">Telefon</label>
          <input type="text" id="phone" v-model="phoneInput" class="mt-1 px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex flex-col">
          <label for="postalCode" class="text-sm text-gray-600">Kod Pocztowy</label>
          <input type="text" id="postalCode" v-model="postalCodeInput" class="mt-1 px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex flex-col">
          <label for="city" class="text-sm text-gray-600">Miasto</label>
          <input type="text" id="city" v-model="cityInput" class="mt-1 px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex flex-col">
          <label for="additionalNotices" class="text-sm text-gray-600">Dodatkowe Uwagi</label>
          <textarea id="additionalNotices" v-model="additionalNoticesInput" class="mt-1 px-4 py-2 border border-gray-300 rounded-md"></textarea>
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <input type="checkbox" id="abroad" v-model="abroadInput" class="h-4 w-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2" />
        <label for="abroad" class="ml-2 text-sm text-gray-900">Dostawa za granicę</label>
      </div>
      <div class="mt-4 flex items-center">
        <input type="checkbox" id="rules" v-model="rulesInput" class="h-4 w-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2" />
        <label for="rules" class="ml-2 text-sm text-gray-900">Akceptuję regulamin</label>
      </div>
      <div class="mt-6">
        <button type="submit" :disabled="loading" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
          {{ loading ? 'Przetwarzanie...' : 'Złóż zamówienie' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style>
/* Additional styles can be added here */
.animate-fade {
  animation: fade 0.5s ease-in-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-in-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-in-out;
}

.animate-bounce {
  animation: bounce 0.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slide-in-left {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
