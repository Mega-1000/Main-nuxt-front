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

onBeforeMount(async () => {
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


  if (query && !query?.notReload) {
    setTimeout(() => window.location.reload(), 1000);
    const redirectString = cart_token ? `/koszyk.html?cart_token=${cart_token}&notReload=true` : "/koszyk.html?notReload=true";
    router.push(redirectString);
  }
});

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

  productsCart.value = cart;
});

const handleDelete = async () => {
  productsCart.value.init();
  await getPackagesNumber(productsCart.value);

  emitter.emit("cart:change");
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
  };

  try {
    const res = await shopApi.post("/api/new_order", params);
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

const canBeSubmitted = computed(() => {
  return !(!emailInput.value.includes("@") ||
      phoneInput.value.replace(/\D/g, "").length < 9);
});

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

  if (isOrderStyrofoam && auctionInput.value) {
    const url = `${config.baseUrl}/chat-show-or-new/${data.id}/${data.customerId}?showAuctionInstructions=true`;

    window.location.href = url;
    return;
  }

  if (isOrderStyrofoam) {
    await Swal.fire('Zapytanie zostało stworzone pomyślnie!', 'Po kliknięciu "OK" Przeniesiemy cię do konta z możliwością zarządzania twoimi zamówieniami', 'info');
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
  <div class="md:flex md:flex-row md:mt-8 md:w-5/6 md:gap-4 md:mx-auto">
    <div>
      <div v-if="!productsCart?.products || productsCart?.products?.length === 0" class="text-center py-20 animate-fade">
        <h2 class="text-2xl md:text-4xl font-bold text-gray-600">Twój koszyk jest pusty</h2>
        <p class="mt-4 text-gray-500">Rozpocznij zakupy i dodaj produkty do koszyka.</p>
      </div>

      <div v-if="query.isEdition">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-slide-in-left" role="alert">
          <span class="block sm:inline">Edutujesz swoje zapytanie! Jeśli chcesz dodać produkt kliknij na sklep i dodaj produkt do koszyka.</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </span>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 space-y-8">
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
        <button type="button" @click="productsCart.removeAllFromCart" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded animate-bounce">
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
                  <button v-if="state?.cart_token" @click="() => updateProduct(productsCart, product.product_id, product.amount, product.id)" type="button" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded animate-pulse">
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
            <p class="text-lg font-medium">Łączna wartość zamówienia wraz z transportem</p>
            <p class="text-md">Brutto: {{ (parseFloat(productsCart.grossPrice()) + shipmentCostBrutto).toFixed(2) }} PLN</p>
          </div>
          <div class="flex justify-between mb-4">
            <p class="text-lg font-medium">Łączna waga</p>
            <p class="text-md">{{ parseFloat(productsCart.totalWeight()).toFixed(2) }} kg</p>
          </div>
        </div>
      </div>
    </div>

      <div class="md:flex md:flex-row md:justify-between md:items-start">
        <div v-if="(productsCart?.products && productsCart?.products?.length > 0 && !state?.cart_token) || isNewOrder" class="bg-white shadow-lg rounded-lg p-6 mt-8  animate-slide-in-left">
          <form class="space-y-6" @submit.prevent="createChat">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="emailInput" />
            </div>
            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">Numer telefonu</label>
              <input type="phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="phoneInput" />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="abroad" type="checkbox" v-model="abroadInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
              </div>
              <label for="abroad" class="ml-2 text-sm font-medium text-gray-900">Wysyłka poza granice Polski</label>
            </div>
            <div>
              <label for="postal-code" class="block mb-2 text-sm font-medium text-gray-900">Kod Pocztowy</label>
              <input name="postal-code" id="postal-code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="postalCodeInput" />
            </div>
            <div>
              <label for="city" class="block mb-2 text-sm font-medium text-gray-900">Miejscowość</label>
              <input name="city" id="city" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required :disabled="loading" v-model="cityInput" />
            </div>
            <div>
              <label for="additional-notices" class="block mb-2 text-sm font-medium text-gray-900">Opis i uwagi do zamówienia</label>
              <textarea id="additional-notices" rows="4" v-model="additionalNoticesInput" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="rules" type="checkbox" required v-model="rulesInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
              </div>
              <label for="rules" class="ml-2 text-sm font-medium text-gray-900">Zapoznałem się z <nuxt-link class="text-blue-500" href="https://mega1000.pl/custom/5">regulaminem</nuxt-link></label>
            </div>

            <div class="flex items-start mt-2">
              <div class="flex items-center h-5">
                <input id="auction" type="checkbox" v-model="auctionInput" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
              </div>
              <label for="auction" class="ml-2 text-sm font-medium text-gray-900">Chcę wykonać przetarg (Opcja tylko dla dużych zamówień - cena może być do 20zł/m3 niższa)</label>
            </div>

            <p class="mt-2 text-sm text-red-600">{{ errorText2 }}</p>
            <SubmitButton :disabled="loading" type="submit">Zatwierdź</SubmitButton>
          </form>
        </div>

        <div v-if="state?.cart_token && !isNewOrder" class="flex justify-center mb-10 md:w-1/2 animate-slide-in-right">
          <button class="w-60 text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" :disabled="loading" @click="handleSubmitWithToken">
            Zapisz edycję
          </button>
        </div>
      </div>

      <div v-if="message" class="flex justify-center animate-bounce">
        <div class="bg-green-500 rounded p-2 text-white">{{ message }}</div>
      </div>
    </div>
  <!-- if loading variable show spinner -->
  <div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div class="bg-white rounded p-5">
      <div class="flex justify-center items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="text-gray-900 text-lg">Ładowanie...</span>
      </div>
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
