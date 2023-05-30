<script setup lang="ts">
  import Complaint from "~/pages/Complaint.vue";
  import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";

  interface Complaint {
    reason: string;
    offerId: number;
    waybillNumber: number;
    driverPhone: number;
    name: string;
    surname: string;
    email: string;
    phone: number;
    message: string;
    productValue: number;
    damagedProductsValue: number;
    dateTimeOfIssue: string;
    accountNumber: number;
  }

  const form = reactive<Complaint>({
    reason: '',
    offerId: 0,
    waybillNumber: 0,
    driverPhone: 0,
    name: '',
    surname: '',
    email: '',
    phone: 0,
    message: '',
    productValue: 0,
    damagedProductsValue: 0,
    dateTimeOfIssue: '',
    accountNumber: 0,
  });

  const config = useRuntimeConfig().public;
  const processing = ref<boolean>(false);
  const { $shopApi: shopApi } = useNuxtApp();
  const route = useRoute();
  const image = ref();
  const avaibleReasons = [
    {
      label: 'zaginięcie przesyłki',
      value: 'zaginięcie przesyłki',
    },
    {
      label: 'uszkodzenie przesyłki',
      value: 'uszkodzenie przesyłki',
    },
    {
      label: 'brak zawartości przesyłki',
      value: 'brak zawartości przesyłki',
    },
    {
      label: 'opóźnienie przesyłki',
      value: 'opóźnienie przesyłki',
    },
    {
      label: 'skarga/inne',
      value: 'skarga/inne',
    },
    {
      label: 'odwołanie do reklamacji',
      value: 'odwołanie do reklamacji',
    },
    {
      label: 'uzupełnienie zgłoszenia',
      value: 'uzupełnienie zgłoszenia',
    }
  ];

  onMounted(() => {
    checkIfUserIsLoggedIn('Proszę się zalogować');
    getdataFromUrl();
  });

  const getdataFromUrl = () => {
    form.offerId = route.query.offerId as unknown as number;
  }

  const submitFrom = async () => {
    processing.value = true;
    try {
      const { data: response } = await shopApi.post(`api/createCustomerComplaintChat/${form.offerId}`, dataToFormObject());

      window.open(
          `${config.baseUrl}/chat/${response.chatUserToken}`,
          "_blank"
      );
    } catch (error) {
      console.log(error);
    } finally {
      processing.value = false;
    }
  }

  const dataToFormObject = () => {
    const formData = new FormData();
    formData.append('firstname', form.name);
    formData.append('surname', form.surname);
    formData.append('email', form.email);
    formData.append('phone', form.phone.toString());
    formData.append('reason', form.reason);
    formData.append('date', form.dateTimeOfIssue);
    formData.append('image', image.value);
    formData.append('driverPhone', form.driverPhone.toString());
    formData.append('trackingNumber', form.waybillNumber.toString());
    formData.append('accountNumber', form.accountNumber.toString());
    formData.append('description', form.message);
    formData.append('offerId', form.offerId.toString());
    formData.append('productValue', form.productValue.toString());
    formData.append('damagedProductsValue', form.damagedProductsValue.toString());
    return formData;
  }
</script>

<template>
  <form @submit.prevent="submitFrom" class="w-[70%] mx-auto mt-10 shadow-lg p-8">
    <h1 class="text-4xl font-bold mb-10">
      Formularz reklamacyjny
    </h1>

    <SelectInput @input="form.reason = $event" :options="avaibleReasons" label="Powód reklamacji" />

    <TextInput label="Numer oferty" type="number" :value="form.offerId" @input="form.offerId = $event" class="mt-4" />

    <TextInput label="Numer przesyłki" type="text" :value="form.waybillNumber" @input="form.waybillNumber = $event" class="mt-4" />

    <TextInput label="Numer telefonu kierowcy (w przypadku gdy jest znany)" :value="form.driverPhone" @input="form.driverPhone = $event" class="mt-4" />

    <TextInput label="Imię" type="text" :value="form.name" @input="form.name = $event" class="mt-4" />

    <TextInput label="Nazwisko" type="text" :value="form.surname" @input="form.surname = $event" class="mt-4" />

    <TextInput label="Email" type="email" :value="form.email" @input="form.email = $event" class="mt-4" />

    <TextInput label="Numer telefonu" type="number" :value="form.phone" @input="form.phone = $event" class="mt-4" />

    <TextInput label="Wiadomość" type="text" :value="form.message" @input="form.message = $event" class="mt-4" />

    <TextInput label="Wartość produktu" type="number" :value="form.productValue" @input="form.productValue = $event" class="mt-4" />

    <TextInput label="Wartość uszkodzonych produktów" type="number" :value="form.damagedProductsValue" @input="form.damagedProductsValue = $event" class="mt-4" />

    <TextInput label="Data i czas stwierdzenia uszkodzenia towaru" type="datetime-local" :value="form.dateTimeOfIssue" @input="form.dateTimeOfIssue = $event" class="mt-4" />

    <TextInput label="Numer konta bankowego" type="number" :value="form.accountNumber" @input="form.accountNumber = $event" class="mt-4" />

    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
        Zdjęcie uszkodzonego towaru
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        @change="image = $event.target.files[0]"
      />
    </div>

    <SubmitButton class="mt-8" :disabled="processing">Wyślij</SubmitButton>
  </form>
</template>
