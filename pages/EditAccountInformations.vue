<script setup lang="ts">
  import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";

  const { $shopApi: shopApi } = useNuxtApp();

  type editMode = "password" | "standard_address" | "primary_data";

  interface Address {
    id: number;
    name: string;
    surname: string;
    street: string;
    house_number: string;
    flat_number: string;
    city: string;
    postal_code: string;
    phone: string;
    email: string;
    type: string;
  }

  const user = ref<any>({});
  const password = ref("");
  const processing = ref(false);
  const error = ref("");
  const editMode = ref<editMode>("password");
  const router = useRouter();
  const standardAddress = ref({});
  const success = ref(false);
  const passwordConfirmation = ref("");

  onMounted(async () => {
    await checkIfUserIsLoggedIn(
      "Proszę się zalogować, aby móc zmienić hasło i dane do przesyłki"
    );

    ({ data: user.value } = await shopApi.get("/api/user"));

    standardAddress.value = user.value.addresses.filter(
      (address: { type: string; }) => address.type === "STANDARD_ADDRESS"
    )[0] as Address ?? {
      name: "",
      surname: "",
      street: "",
      house_number: "",
      flat_number: "",
      city: "",
      postal_code: "",
      phone: "",
      email: "",
    } as Address;

    initEditMode();
  });

  const savePassword = async () => {
    processing.value = true;

    if (password.value !== passwordConfirmation.value) {
      error.value = "Hasła nie są takie same";
      processing.value = false;

      setTimeout(() => {
        error.value = "";
      }, 3000);

      return;
    }

    try {
      await shopApi.post("/api/user/change-password", {
        password: password.value,
      });
      setSuccess(true);
    } catch (e: any) {
      error.value = e.response.data.message;

      setTimeout(() => {
        error.value = "";
      }, 3000);
    }
    processing.value = false;
  };

  const setEditMode = (mode: editMode) => {
    editMode.value = mode;

    router.push({ query: { editMode: mode } });
  }

  const initEditMode = () => {
    const queryEditMode = router.currentRoute.value.query.editMode;
    switch (queryEditMode) {
      case "password":
        editMode.value = "password";
        break;
      case "standard_address":
        editMode.value = "standard_address";
        break;
      case "primary_data":
        editMode.value = "primary_data";
        break;
    }
  }

  const setSuccess = (value: boolean) => {
    success.value = value;

    setTimeout(() => {
      success.value = false;
    }, 3000);
  }

  const saveStandardAddress = async () => {
    processing.value = true;
    await shopApi.post("/api/user/update-informations", {
      standardAddress: standardAddress.value,
    });
    setSuccess(true);
    processing.value = false;
  }
</script>

<template>
  <div class="mt-10 w-[70%] mx-auto rounded bg-white shadow p-8">
    <div v-if="error" class="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Błąd!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div class="mb-8">
      <SubmitButton @click="setEditMode('password')" :disabled="editMode === 'password'">
        Zmień hasło
      </SubmitButton>

      <SubmitButton class="ml-4" @click="setEditMode('standard_address')" :disabled="editMode === 'standard_address'">
        Adres podstawowy
      </SubmitButton>
    </div>

    <form @submit.prevent="savePassword" v-if="editMode === 'password'">
      <label for="password_input">Hasło</label>
      <TextInput id="password_input" placeholder="Hasło - Jeśli chcesz je zmienić wpisz je tutaj, w przeciwnym wypadku zostaw puste" :value="password" @input="password = $event" ></TextInput>

      <label for="password_confirmation_input">Potwierdź hasło</label>
      <TextInput id="password_confirmation_input" placeholder="Potwierdź hasło" :value="passwordConfirmation" @input="passwordConfirmation = $event" ></TextInput>

      <SubmitButton class="mt-4" type="submit" :disabled="processing">Zapisz</SubmitButton>

      <div v-if="success" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Sukces!</strong>
        <span class="block sm:inline">Twoje dane zostały zaaktualizowane</span>
      </div>
    </form>

    <form @submit.prevent="saveStandardAddress" v-if="editMode === 'standard_address'">
      <!-- name -->
      <label for="name_input">Imię</label>
      <TextInput id="name_input" placeholder="Imię" :value="standardAddress.firstname" @input="standardAddress.firstname = $event" ></TextInput>

      <!-- surname -->
      <label for="surname_input">Nazwisko</label>
      <TextInput id="surname_input" placeholder="Nazwisko" :value="standardAddress.lastname" @input="standardAddress.lastname = $event" ></TextInput>

      <!-- firmname -->
      <label for="firmname_input">Nazwa firmy</label>
      <TextInput id="firmname_input" placeholder="Nazwa firmy" :value="standardAddress.firmname" @input="standardAddress.firmname = $event" ></TextInput>

      <!-- nip -->
      <label for="nip_input">NIP</label>
      <TextInput id="nip_input" placeholder="NIP" :value="standardAddress.nip" @input="standardAddress.nip = $event" ></TextInput>

      <!-- phone_number -->
      <label for="phone_number_input">Numer telefonu</label>
      <TextInput id="phone_number_input" placeholder="Numer telefonu" :value="standardAddress.phone" @input="standardAddress.phone = $event" ></TextInput>

      <!-- adres -->
      <label for="address_input">Adres</label>
      <TextInput id="address_input" placeholder="Adres" :value="standardAddress.address" @input="standardAddress.address = $event" ></TextInput>

      <!-- building number -->
      <label for="building_number_input">Numer budynku</label>
      <TextInput id="building_number_input" placeholder="Numer budynku" :value="standardAddress.flat_number" @input="standardAddress.flat_number = $event" ></TextInput>

      <!-- city -->
      <label for="city_input">Miasto</label>
      <TextInput id="city_input" placeholder="Miasto" :value="standardAddress.city" @input="standardAddress.city = $event" ></TextInput>

      <!-- zip code -->
      <label for="zip_code_input">Kod pocztowy</label>
      <TextInput id="zip_code_input" placeholder="Kod pocztowy" :value="standardAddress.postal_code" @input="standardAddress.postal_code = $event" ></TextInput>

      <!-- email -->
      <label for="email_input">Email</label>
      <TextInput id="email_input" placeholder="Email" :value="standardAddress.email" @input="standardAddress.email = $event" ></TextInput>

      <submitButton :disabled="processing" class="mt-8" :class="{ 'bg-geen-500': success }">
        Zapisz
      </submitButton>

      <div v-if="success" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Sukces!</strong>
        <span class="block sm:inline">Twoje dane zostały zaaktualizowane</span>
      </div>
    </form>
  </div>
</template>
