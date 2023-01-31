<script setup lang="ts">
const { $api: api } = useNuxtApp();

const defaultError = "Wystąpił błąd. Spróbuj ponownie później";
let phoneInput = "";

const loading = useState(() => false);
const errorMessage = useState(() => "");
const phone = usePhone();
const cart = useCart();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  loading.value = true;
  const params = {
    phone: phoneInput,
    want_contact: true,
  };
  try {
    const res = await api.post("/api/new_order", params);
    if (res.status !== 201) throw new Error();
    cart.value = res.data.token;
    phone.value = phoneInput;
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.error_message || defaultError;
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
        <label
          for="phone"
          class="block mb-2 text-sm lg:text-lg font-medium text-gray-900"
          >Numer telefonu</label
        >
        <input
          type="phone"
          name="phone"
          id="phone"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="123456789"
          required
          :disabled="loading"
          v-model="phoneInput"
        />
        <p class="mt-2 text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
      <button
        class="w-full text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm lg:text-lg px-5 py-2.5 text-center"
        :disabled="loading"
        type="submit"
      >
        Wyślij
      </button>
    </form>
  </div>
</template>
