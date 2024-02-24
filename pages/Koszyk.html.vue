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
  cart.removeFromCart(prodId);

  try {
    const response = await shopApi.get(`/api/products/${productId}`);
    let product = response.data;
    product.recalculate = 1;
    cart.addToCart(product, amount);
  } catch (err) { }
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

  loading.value = true;
  const data =  await handleSubmit(null);
  loading.value = false;

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

  let isOrderStyrofoam = true;
  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group != 'styropiany') {
      isOrderStyrofoam = false;
    }
  });

  if (isOrderStyrofoam) {
    var url = `${config.baseUrl}/chat-show-or-new/${data.id}/${data.customerId}?showAuctionInstructions=true`;

    window.open(url, '_blank');
    return;
  }
  await router.push(`/payment?token=${data.token}&total=${(parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value).toFixed(2)}`);
};

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
  <div class="flex">
    <div>
      <Sidebar class="h-fit flex flex-col justify-center mt-30 w-fit" :categories="categories" />
    </div>
    <div class="w-[50%] mx-auto">
      <div class="pb-15">
        <div class="flex justify-center mt-7">
          <h2 v-if="!productsCart?.products || productsCart?.products?.length === 0" class="text-xl md:text-3xl">
            Brak produktów w koszyku
          </h2>
          <div v-else class="grid grid-cols-1 space-y-8">
            <p class="mt-2 text-sm text-red-600" v-if="state?.errorText">
              {{ state?.errorText }}
            </p>
            <template v-if="state?.cart_token">
              <div
                class="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Info</span>
                <div>
                  <span class="font-medium">Uwaga! To jest edycja koszyka.</span>
                </div>
              </div>
              <div class="flex items-center mb-4">
                <input id="default-checkbox" type="checkbox" v-model="isNewOrder"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Czy to
                  jest nowe zamówienie?</label>
              </div>
            </template>
            <button type="button" @click="productsCart.removeAllFromCart"
              class="w-40 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
              Usuń wszystko
            </button>

            <div v-for="product in productsCart.products" class="max-w-[100vw]" v-tooltip.auto-start="ShipmentCostItemsLeftText(product)">
              <div
                class="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-7xl mx-auto border border-white bg-white">
                <div class="w-full md:w-1/3 bg-white grid place-items-start md:max-w-2xl">
                  <img :src="buildImgRoute(product?.url_for_website)" alt="Photo" class="rounded-xl" />
                  <div class="absolute bottom-0 right-0 md:right-auto">
                    <button v-if="state?.cart_token" @click="
                      () =>
                        updateProduct(
                          productsCart,
                          product.product_id,
                          product.amount,
                          product.id
                        )
                    " type="button"
                      class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                      Przelicz po cenie z CSV
                    </button>
                    <button @click="
                      async () => {
                        productsCart.removeFromCart(product.id);
                        await handleDelete();
                      }
                    " type="button"
                      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 my-2">
                      Usuń
                    </button>
                  </div>
                </div>
                <div class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3 grid md:place-items-end">
                  <h3 class="font-black text-gray-800 md:text-2xl text-xl">
                    {{ product.name }}
                  </h3>

                  <CartPriceTable class="w-full pb-10" :product="product" :handle-product-amount="(val) => updateAmount(product.id, val)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center py-10 px-5 w-full"
          v-if="productsCart?.products && productsCart?.products?.length > 0">
          <div
            class="grid space-y-7 min-w-fit sm:max-w-3xl md:max-w-4xl lg:max-w-5xl w-full p-6 border border-gray-200 rounded-lg shadow bg-gray-100">
            <h5 class="text-2xl font-bold tracking-tight text-gray-900">
              Podsumowanie
            </h5>
            <hr />

            <div class="relative overflow-x-auto sm:rounded-lg w-full">
              <table class="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-sm text-left text-gray-500 w-full">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3">Produkt</th>
                    <th scope="col" class="px-6 py-3">Ilość</th>
                    <th scope="col" class="px-6 py-3">Cena netto</th>
                    <th scope="col" class="px-6 py-3">Cena brutto</th>
                    <th scope="col" class="px-6 py-3">Wartość netto</th>
                    <th scope="col" class="px-6 py-3">Wartość brutto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white border-b" v-for="product in productsCart.products">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 max-w-sm md:max-w-lg">
                      {{ product.name }}
                    </th>
                    <td class="px-6 py-4">
                      {{ product.amount }} {{ product.unit_commercial }}
                    </td>
                    <td class="px-6 py-4">
                      {{ product.net_selling_price_commercial_unit || 0 }}
                      {{ product.currency || "PLN" }}
                    </td>
                    <td class="px-6 py-4">
                      {{ product.gross_price_of_packing || 0 }}
                      {{ product.currency || "PLN" }}
                    </td>
                    <td class="px-6 py-4">
                      {{
                        (
                          parseFloat(product.net_selling_price_commercial_unit) *
                          product.amount
                        ).toFixed(2) || 0
                      }}
                      {{ product.currency || "PLN" }}
                    </td>
                    <td class="px-6 py-4">
                      {{
                        (
                          parseFloat(product.gross_price_of_packing) *
                          product.amount
                        ).toFixed(2) || 0
                      }}
                      {{ product.currency || "PLN" }}
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <hr />

            <div class="flex justify-between">
              <p class="text-2xl font-md">Łączne zamówienie</p>
              <div>
                <p class="text-md">Netto: {{ productsCart.nettoPrice() }} PLN</p>
                <p class="text-md">Brutto: {{ productsCart.grossPrice() }} PLN</p>
              </div>
            </div>
            <hr />
            <div class="flex justify-between">
              <p class="text-2xl font-md">Koszt transportu</p>
              <p class="text-lg">{{ shipmentCostBrutto }} PLN</p>
            </div>
            <hr />
            <div class="flex justify-between">
              <p class="text-2xl font-md">
                Łączna wartość zamówienia wraz z transportem
              </p>

              <p class="text-lg">
                Brutto:
                {{
                  (
                    parseFloat(productsCart.grossPrice()) + shipmentCostBrutto
                  ).toFixed(2)
                }}
                PLN
              </p>
            </div>

            <hr />
            <div class="flex justify-between">
              <p class="text-2xl font-md">Łączna waga</p>
              <p class="text-lg">
                {{ parseFloat(productsCart.totalWeight()).toFixed(2) }} kg
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-center mb-60" v-if="
          (productsCart?.products &&
            productsCart?.products?.length > 0 &&
            !state?.cart_token) ||
          isNewOrder
        ">
          <div
            class="w-screen max-w-sm md:max-w-md md:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
            <form class="space-y-6" @submit.prevent="createChat">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input type="email" name="email" id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required :disabled="loading" v-model="emailInput" />
              </div>
              <div>
                <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">Numer telefonu</label>
                <input type="phone" name="phone" id="phone"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required :disabled="loading" v-model="phoneInput" />
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="abroad" type="checkbox" v-model="abroadInput"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                </div>
                <label for="abroad" class="ml-2 text-sm font-medium text-gray-900">Wysyłka poza granice Polski</label>
              </div>
              <div>
                <label for="postal-code" class="block mb-2 text-sm font-medium text-gray-900">Kod Pocztowy</label>
                <input name="postal-code" id="postal-code"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required :disabled="loading" v-model="postalCodeInput" />
              </div>
              <div>
                <label for="city" class="block mb-2 text-sm font-medium text-gray-900">Miejscowość</label>
                <input name="city" id="city"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required :disabled="loading" v-model="cityInput" />
              </div>
              <div>
                <label for="additional-notices" class="block mb-2 text-sm font-medium text-gray-900">Opis i uwagi do
                  zamówienia</label>
                <textarea id="additional-notices" rows="4" v-model="additionalNoticesInput"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="rules" type="checkbox" required v-model="rulesInput"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                </div>
                <label for="rules" class="ml-2 text-sm font-medium text-gray-900">Zapoznałem się z regulaminem 1</label>
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="rules-2" type="checkbox" required v-model="rulesInput"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                </div>
                <label for="rules-1" class="ml-2 text-sm font-medium text-gray-900">Zapoznałem się z regulaminem 2</label>
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="rules-3" type="checkbox" required v-model="rulesInput"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                </div>
                <label for="rules-3" class="ml-2 text-sm font-medium text-gray-900">Zapoznałem się z regulaminem 3</label>
              </div>
<!--              <div>-->
<!--                <FileBase64 multiple @onDone="handleFiles" />-->
<!--                <p class="mt-1 text-sm text-gray-500" id="file_input_help">-->
<!--                  PNG, JPG, JPEG, GIF, TIF, lub PDF-->
<!--                </p>-->
<!--              </div>-->
              <p class="mt-2 text-sm text-red-600">
                {{ errorText2 }}
              </p>
              <SubmitButton
                :disabled="loading" type="submit">
                Zatwierdź
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>

      <div v-if="state?.cart_token && !isNewOrder" class="flex justify-center mb-10">
        <button
          class="w-60 text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          :disabled="loading" @click="handleSubmitWithToken">
          Zapisz edycję
        </button>
      </div>

      <div v-if="message" class="flex justify-center">
        <div class="bg-green-500 rounded p-2 text-white">
          {{ message }}
        </div>
      </div>
    </div>
  </div>

  <!-- if loading variable show spinner -->
  <div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div class="bg-white rounded p-5">
      <div class="flex justify-center items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z">
          </path>
        </svg>
        <span class="text-gray-900 text-lg">Ładowanie...</span>
      </div>
    </div>
  </div>
</template>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  text-transform: uppercase;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ccc;
}
</style>
