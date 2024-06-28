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
import {trackEvent} from "~/utils/trackEvent";
import { Polish } from 'flatpickr/dist/l10n/pl.js';

const { query } = useRoute();
const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();
const productsCart = useProductsCart();
const state = ref<any>();
const selfPickup = ref(false);
const userName = ref('');
let isPostalCodeValid = ref(true);
const userToken = useUserToken();
const userData = ref<any>();
let emailInput = ref(userData?.value?.email || "");
let phoneInput = ref(userData?.value?.phone || "");
let postalCodeInput = userData?.value?.postal_code || "";
let cityInput = userData?.value?.city || "";
let additionalNoticesInput = "";
let abroadInput = ref(false);
let rulesInput = false;
let files: any[] = [];
const message = ref("");
const auctionInput = ref('');
const deliveryStartDate = ref('');
const deliveryEndDate = ref('');
const route = useRoute();
const loading = ref(false);

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
    return res.data;
  } catch (e: any) { }
});

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

  const startDatePicker = useDatePicker('#delivery-start-date', {
    altInput: true,
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d',
    locale: Polish,
  });

  const endDatePicker = useDatePicker('#delivery-end-date', {
    altInput: true,
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d',
    locale: Polish,
  });
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

const separateProducts = (products: any[]) => {
  const styrofoamProducts = products.filter(p => p.variation_group === 'styropiany');
  const otherProducts = products.filter(p => p.variation_group !== 'styropiany');
  return { styrofoamProducts, otherProducts };
};

const handleSubmit = async (e: Event | null) => {
  e ? e.preventDefault() : null;
  loading.value = true;
  let hideFromCustomer = false;

  if (localStorage.getItem('isAdmin') == 'true') {
    Swal.fire({
      title: 'Ukryć przed klientem?',
      text: "Czy chcesz ukryć zapytanie przed klientem?",
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

  const { styrofoamProducts, otherProducts } = separateProducts(productsCart.value.products);

  const createOrder = async (products: any[]) => {
    const params = {
      customer_login: emailInput.value,
      phone: phoneInput.value,
      customer_notices: additionalNoticesInput,
      delivery_address: {
        city: cityInput,
        postal_code: postalCodeInput,
      },
      shipping_abroad: abroadInput.value,
      is_standard: true,
      files,
      order_items: products.map(p => ({ id: p.id, amount: p.amount, symbol: p.symbol })),
      rewrite: 0,
      need_support: true,
      update_email: true,
      hide_from_customer: hideFromCustomer,
      packages: ShipmentCostCalculator(products),
      register_reffered_user_id: localStorage.getItem('registerRefferedUserId') || null,
      createAuction: auctionInput.value,
      delivery_start_date: deliveryStartDate.value,
      delivery_end_date: deliveryEndDate.value,
      user_name: userName.value,
    };

    try {
      const res = await shopApi.post("/api/new_order", params);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  };

  try {
    let results = [];

    if (styrofoamProducts.length > 0) {
      results.push(await createOrder(styrofoamProducts));
    }

    if (otherProducts.length > 0) {
      results.push(await createOrder(otherProducts));
    }

    const firstOrderData = results[0];

    const cookies = new Cookies();
    cookies.set("token", firstOrderData.access_token);

    window.dispatchEvent(new CustomEvent('token-refreshed'));
    return firstOrderData;
  } catch (err: any) {
    errorText2.value = err.response?.data?.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};

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
      message.value = "Oferta została nadpisana na starą ofertę ale prosimy pamiętać że jest to niebezpieczne ponieważ klient po dostawie może się kłócić ze dostał nie to co  miał w ofercie i na dowód pokazać starą a upierać się że o nowej nic nie wie. Można sporadycznie tak robić bo ułatwia to temat gdy już jakieś zostały np dokonane wpłaty lub towar wyjechał na listach i jest dużo roboty aby dokonać zmiany do nowej oferty ale musimy być pewnie że klient nie będzie się upierał ze on chciał starą oferte."
    }
  } catch (err: any) {
    errorText2.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};

const shipmentCostBrutto = computed(() => {
  return shipmentCostBruttoFn(productsCart.value.products)
});

const isNewOrder = ref(false);

const updateProduct = async (
    cart: Cart,
    productId: number,
    amount: number,
    prodId: number
) => {
  await cart.removeFromCart(prodId);

  setTimeout(async () => {
    try {
      const response = await shopApi.get(`/api/products/${productId}`);
      let product = response.data;
      product.recalculate = 1;
      await cart.addToCart(product, amount);
    } catch (err) { }

    window.location.reload();
  }, 300)
};

const createChat = async (redirect: boolean) => {
  let deliveryTypesErrors: any[] = [];
  await productsCart.value.products.forEach((product) => {
    if (!product.delivery_type) {
      deliveryTypesErrors.push(product);
    }
  });

  if (deliveryTypesErrors.length != 0) {
    const alertText = 'Brak możliwości wyceny transportu produktów poniżej i jeżeli chcesz dokonać od razu zakupu to usuń je z koszyka.\n' +
        'W przypadku gdy chcesz poznać wycenę wraz z transportem to wyślij a skontaktujemy się z tobą.';

    const listOfProducts = deliveryTypesErrors.map((product) => {
      return `<br>${product.name} - ${product.amount} szt.`
    });


    const confirmation = await swal.fire({
      title: '',
      html: `${alertText}<br />${listOfProducts}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Wróć do koszyka i dokonaj usunięcia',
      confirmButtonText: 'Wyślij do sprawdzenia kosztów transportu',
    });

    if (!confirmation.isConfirmed) {
      return;
    } else {
      loading.value = true;
      const data =  await handleSubmit(null);
      loading.value = false;

      productsCart.value.removeAllFromCart();
      window.location.reload()

      swal.fire({
        title: '',
        html: 'Dziękujemy za wysłanie zapytania ofertowego. Wkrótce skontaktujemy się z Tobą.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      return;
    }
  }

  let isOrderStyrofoam = false;
  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group === 'styropiany') {
      isOrderStyrofoam = true;
    }
  });

  loading.value = true;
  const data =  await handleSubmit(null);
  loading.value  = isOrderStyrofoam && auctionInput.value;

  if (!getToken() && data.newAccount) {
    await Swal.fire('', `<span style="text-align: left; ">Informujemy że założyliśmy Państwu konto na naszej stronie na którym po zalogowaniu można :<br>
        <br>
        <br>- zapoznać się z ofertą i pobrać fakturę proformę\n
        <br>- skorygować wysłane zapytanie ofertowe\n
        <br>- uzupełnić dane do dostawy i faktury i wskazać datę nadania przesyłki\n
        <br>- podpiąć potwierdzenie przelewu które przyspiesza realizacje\n
        <br>- rozpocząć dyskusje/chata z konsultantem\n
        <br>- oraz sprawdzać statusy ofert i listów przewozowych.\n
        <br>
        <br>Z pozdrowieniami<br>
        <br>
    </span>`, 'info');
  }

  setTimeout(() =>  productsCart.value.removeAllFromCart(), 100)

  let totalQuantity = 0;
  productsCart.value.products.forEach((item) => {
    if (item.variation_group === 'styropiany') {
      totalQuantity += item.amount;
    }
  });

  if ((totalQuantity <= 33 && isOrderStyrofoam) || selfPickup.value) {
    trackEvent('purchase', 'styropian', 'zakup z odbiorem osobistym', parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value);

    await router.push(`/selectWarehouse?token=${data.token}&total=${(parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value).toFixed(2)}&isOrderSmall=${(totalQuantity <= 33)}`);
    return;
  }

  if (isOrderStyrofoam && auctionInput.value) {
    trackEvent('purchase', 'styropian', 'zakup przetargowy', parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value);

    const url = `${config.baseUrl}/chat-show-or-new/${data.id}/${data.customerId}?showAuctionInstructions=true`;

    window.location.href = url;
    return;
  }

  if (isOrderStyrofoam) {
    await Swal.fire('Zapytanie zostało stworzone pomyślnie!', 'Po kliknięciu "OK" Przeniesiemy cię do konta z możliwością zarządzania twoimi zapytaniami', 'info');
    await router.push('/account');
    return;
  }
  await router.push(`/payment?token=${data.token}&total=${(parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value).toFixed(2)}`);
};

const isOrderStyrofoam = computed(() => {
  let isOrderStyrofoam = false;

  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group === 'styropiany') {
      isOrderStyrofoam = true;
    }
  });

  return isOrderStyrofoam;
});

const canAuctionBeMade = computed(() => {
  let isOrderStyrofoam = false;

  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group === 'styropiany') {
      isOrderStyrofoam = true;
    }
  });

  let totalQuantity = 0;
  productsCart.value.products.forEach((item) => {
    if (item.variation_group === 'styropiany') {
      totalQuantity += item.amount;
    }
  });

  return isOrderStyrofoam && totalQuantity > 66;
});

const validatePostalCode = () => {
  const polishPostalCodePattern = /^\d{2}-\d{3}$/;
  isPostalCodeValid.value = abroadInput.value || polishPostalCodePattern.test(postalCodeInput);
};

watch(abroadInput, () => {
  validatePostalCode();
});

const isOrderSmall = computed(() => {
  let isOrderStyrofoam = false;

  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group === 'styropiany') {
      isOrderStyrofoam = true;
    }
  });

  let totalQuantity = 0;
  productsCart.value.products.forEach((item) => {
    if (item.variation_group === 'styropiany') {
      totalQuantity += item.amount;
    }
  });

  return isOrderStyrofoam && totalQuantity <= 49.5;
});

const ShipmentCostItemsLeftText = (product: any) => {
  const itemPackageQuantity = product.assortment_quantity;
  const products = productsCart.value.products.filter((item: any) => item.delivery_type === product.delivery_type);
  let itemsLeft;

  if (products.length > 0) {
    const itemsQuantity = Math.round((products.reduce((acc: any, item: any) => acc + item.amount / item.assortment_quantity, 0) % 1) * 100) / 100;
    itemsLeft = Math.floor((1 - itemsQuantity) / (1 / itemPackageQuantity));
  } else {
    itemsLeft = itemPackageQuantity;
  }

  return `Możesz dodać do przesyłki jeszcze ${itemsLeft} ${product.unit_commercial} tego produktu aby uzupełnić do pełna paczkę i nie ponosić dodatkowych kosztów transportu.`;
};
</script>
<template>
  <div class="cart-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Edit mode alert -->
    <div v-if="query.isEdition" class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md animate-fade-in" role="alert">
      <p class="font-bold">Tryb edycji</p>
      <p>Edytujesz swoje zapytanie. Aby dodać produkt, przejdź do sklepu i dodaj go do koszyka.</p>
    </div>

    <!-- Empty cart message -->
    <div v-if="!productsCart?.products || productsCart?.products?.length === 0" class="text-center py-20 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-48 h-48 mx-auto mb-6" stroke-linejoin="round">
        <path d="M25 30h65l-5 40H30z" />
        <path d="M85 30c0-10-20-10-20 0" />
        <circle cx="35" cy="80" r="5" />
        <circle cx="75" cy="80" r="5" />
        <path d="M50 50c-5 0-10 5-10 5s5 5 10 5 10-5 10-5-5-5-10-5z" />
        <path d="M45 60q5 5 10 0" stroke-linecap="round" />
      </svg>
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Twój koszyk jest pusty</h2>
      <p class="text-gray-600 mb-6">Rozpocznij zakupy i dodaj produkty do koszyka.</p>
      <nuxt-link to="/shop" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
        Przejdź do sklepu
      </nuxt-link>
    </div>

    <div v-else class="md:flex md:space-x-8">
      <div class="md:w-2/3">
        <!-- Product list -->
        <div class="space-y-6">
          <div v-for="product in productsCart.products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden animate-slide-in-left">
            <div class="md:flex">
              <div class="md:flex-shrink-0">
                <img :src="buildImgRoute(product?.url_for_website)" alt="Zdjęcie produktu" class="h-48 w-full object-cover md:w-48">
              </div>
              <div class="p-6 w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">{{ product.name }}</h3>
                  <button @click="async () => { productsCart.removeFromCart(product.id); await handleDelete(); }" class="text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <CartPriceTable class="w-full" :product="product" :handle-product-amount="(val) => updateAmount(product.id, val)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-1/3 mt-8 md:mt-0">
        <!-- Order summary -->
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 class="text-2xl font-bold mb-6">Podsumowanie zamówienia</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span>Suma częściowa</span>
              <span>{{ productsCart.nettoPrice() }} PLN</span>
            </div>
            <div class="flex justify-between">
              <span>Podatek</span>
              <span>{{ (productsCart.grossPrice() - productsCart.nettoPrice()).toFixed(2) }} PLN</span>
            </div>
            <div class="flex justify-between">
              <span>Koszt dostawy</span>
              <span>{{ shipmentCostBrutto }} PLN</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold">Suma</span>
                <span class="text-xl font-bold">{{ (parseFloat(productsCart.grossPrice()) + shipmentCostBrutto).toFixed(2) }} PLN</span>
              </div>
            </div>
          </div>

          <!-- Social proof -->
          <div class="mt-6 bg-gray-100 rounded-md p-4">
            <p class="text-sm text-gray-700 mb-2">
              <span class="font-semibold">98% klientów</span> poleca nasze produkty
            </p>
            <div class="flex items-center">
              <span class="text-yellow-400">★★★★★</span>
              <span class="ml-2 text-sm text-gray-600">4.9/5 (1023 opinii)</span>
            </div>
          </div>

          <!-- CTA Button -->
          <button @click="scrollToForm" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full mt-6 transition duration-300 ease-in-out transform hover:scale-105 animate-pulse">
            Przejdź do formularza zamówienia
          </button>
        </div>
      </div>
    </div>

    <!-- Order form -->
    <div v-if="(productsCart?.products && productsCart?.products?.length > 0 && !state?.cart_token) || isNewOrder" class="mt-12 bg-white rounded-lg shadow-md p-8 animate-fade-in" id="orderForm">
      <h2 class="text-2xl font-bold mb-6">Dane do zamówienia</h2>
      <form @submit.prevent="createChat" class="space-y-6">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
          <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="emailInput" />
        </div>

        <div>
          <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">Numer telefonu</label>
          <input type="tel" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="phoneInput" pattern="\d{3}\d{3}\d{3}" title="Prosimy podać numer telefonu w formacie 123456789." />
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="abroad" type="checkbox" v-model="abroadInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
          </div>
          <label for="abroad" class="ml-2 text-sm font-medium text-gray-900">Wysyłka poza granice Polski</label>
        </div>

        <div>
          <label for="postal-code" class="block mb-2 text-sm font-medium text-gray-900">Kod Pocztowy</label>
          <input name="postal-code" id="postal-code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                 required
                 :disabled="loading"
                 v-model="postalCodeInput"
                 :pattern="abroadInput ? '.*' : '\\d{2}-\\d{3}'"
                 @input="validatePostalCode"
                 :class="{'border-red-500': !isPostalCodeValid}"
          />
          <p v-if="!isPostalCodeValid" class="text-red-500 text-sm">Kod pocztowy musi mieć format XX-XXX</p>
        </div>

        <div v-if="isOrderStyrofoam" class="mt-4">
          Przybliżone daty dostawy/odbioru

          <div>
            <label for="delivery-start-date" class="block mb-2 text-sm font-medium text-gray-900">od</label>
            <input type="text" id="delivery-start-date" v-model="deliveryStartDate" placeholder="Kliknij aby wybrać date" class="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" required>
          </div>

          <div class="mt-4">
            <label for="delivery-end-date" class="block mb-2 text-sm font-medium text-gray-900">do</label>
            <input type="text" id="delivery-end-date" v-model="deliveryEndDate" placeholder="Kliknij aby wybrać date" class="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" required>
          </div>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="rules" type="checkbox" required v-model="rulesInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
          </div>
          <label for="rules" class="ml-2 text-sm font-medium text-gray-900">Zapoznałem się z <nuxt-link class="text-blue-500" href="https://mega1000.pl/custom/5">regulaminem</nuxt-link></label>
        </div>

        <div class="flex items-start mt-2" v-if="canAuctionBeMade && !selfPickup">
          <div class="flex items-center h-5">
            <input id="auction" type="checkbox" v-model="auctionInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
          </div>
          <label for="auction" class="ml-2 text-sm font-medium text-gray-900">Chcę wykonać przetarg (cena może być do 20zł/m3 niższa)</label>
        </div>

        <div v-if="!isOrderSmall && isOrderStyrofoam">
          <div class="flex items-start mt-2" v-if="!auctionInput && !isOrderSmall">
            <div class="flex items-center h-5">
              <input id="shipByMyself" type="checkbox" v-model="selfPickup" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
            </div>
            <label for="shipByMyself" class="ml-2 text-sm font-medium text-gray-900">Chce odebrać te produkty osobiście w magazynie fabryki.</label>
          </div>
        </div>

        <p class="mt-2 text-sm text-red-600">{{ errorText2 }}</p>

        <SubmitButton :disabled="loading" type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          {{ !auctionInput ? 'Wyślij zapytanie - do niczego nie zobowiązuje' : 'Chcę uzyskać oferty od ponad 50 producentów' }}
        </SubmitButton>

        <div class="text-red-600 font-bold" v-if="isOrderSmall">
          Z powodu że aktualne produkty z koszyka nie przekraczają 10m3 nie jest możliwa dostawa.
          <br>
          Zostaniesz przekierowany do wyboru magazynu, w którym chcesz odebrać dane produkty.
          <br>
          Zostanie również doliczona dodatkowa opłata 50zł
        </div>
      </form>
    </div>

    <div v-if="state?.cart_token && !isNewOrder" class="flex justify-center mt-8">
      <button @click="handleSubmitWithToken" class="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105" :disabled="loading">
        Zapisz edycję
      </button>
    </div>

    <div v-if="message" class="flex justify-center mt-8 animate-bounce">
      <div class="bg-green-500 rounded-full p-4 text-white font-bold">{{ message }}</div>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <Loader :showLoader="loading" />
    </div>
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
