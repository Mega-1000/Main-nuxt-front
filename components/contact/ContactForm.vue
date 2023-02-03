<script setup lang="ts">
import FileBase64 from "vue-file-base64";

const router = useRouter();

const { $shopApi: shopApi } = useNuxtApp();

const phone = usePhone();
const cart = useCart();

const loading = useState(() => false);
const errorMessage = useState(() => "");

let emailInput = "";
let postalCodeInput = "";
let cityInput = "";
let additionalNoticesInput = "";
let abroadInput = false;
let rulesInput = false;

let files: any[] = [];

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

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  loading.value = true;

  if (files.length > 0 && !areFilesValid(files)) {
    errorMessage.value = "Nieprawidłowe pliki";
    loading.value = false;
    return;
  }

  const params = {
    customer_login: emailInput,
    phone: phone.value,
    customer_notices: additionalNoticesInput,
    delivery_address: {
      city: cityInput,
      postal_code: postalCodeInput,
    },
    shipping_abroad: abroadInput,
    is_standard: true,
    files,
    cart_token: cart.value,
    rewrite: 1,
  };

  try {
    await shopApi.post("/api/new_order", params);
    router.push("/thanks?contact=true");
  } catch (err: any) {
    errorMessage.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="w-screen max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8"
  >
    <form class="space-y-6" @submit="handleSubmit">
      <h5 class="text-xl xl:text-2xl font-medium text-gray-900">
        Skontaktuj się telefonicznie z konsultantem
      </h5>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900"
          >Email</label
        >
        <input
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          :disabled="loading"
          v-model="emailInput"
        />
      </div>
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="abroad"
            type="checkbox"
            v-model="abroadInput"
            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label for="abroad" class="ml-2 text-sm font-medium text-gray-900"
          >Wysyłka poza granice Polski</label
        >
      </div>
      <div>
        <label
          for="postal-code"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Kod Pocztowy</label
        >
        <input
          name="postal-code"
          id="postal-code"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          :disabled="loading"
          v-model="postalCodeInput"
        />
      </div>
      <div>
        <label for="city" class="block mb-2 text-sm font-medium text-gray-900"
          >Miejscowość</label
        >
        <input
          name="city"
          id="city"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          :disabled="loading"
          v-model="cityInput"
        />
      </div>
      <div>
        <label
          for="additional-notices"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Opis i uwagi do zamówienia</label
        >
        <textarea
          id="additional-notices"
          rows="4"
          v-model="additionalNoticesInput"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="rules"
            type="checkbox"
            required
            v-model="rulesInput"
            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label for="rules" class="ml-2 text-sm font-medium text-gray-900"
          >Zapoznałem się z regulaminami 1, 2 i 3</label
        >
      </div>
      <div>
        <FileBase64 multiple @onDone="handleFiles" />
        <p class="mt-1 text-sm text-gray-500" id="file_input_help">
          PNG, JPG, JPEG, GIF, TIF, lub PDF
        </p>
      </div>
      <p class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <button
        class="w-full text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        :disabled="loading"
        type="submit"
      >
        Wyślij
      </button>
    </form>
  </div>
</template>
