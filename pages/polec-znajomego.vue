<script setup>
import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";
import swal from "sweetalert2";

const refereedPhoneNumber = ref('');
const currentUser = ref({});
const { $shopApi: shopApi } = useNuxtApp();

onMounted(() => {
  currentUser.value = checkIfUserIsLoggedIn();
});

const submitForm = async () => {
  const {data: response} = await shopApi.post('api/contact-approach/create', {
    phone: refereedPhoneNumber.value,
    referred_by_user_id: currentUser.value.id,
  });

  if (response) {
    await swal.fire('Pomyślnie wysłano numer telefonu!', 'Skontaktujemy się z twoim znajomym i powiadomimy cię jeśli dojdzie do zakupu!', 'success');
  }
};
</script>
<template>
  <div class="lg:pl-20 max-w-[90%] mb-40">
    <h1 class="font-bold text-4xl">
      Zgarnij 30 zł polecając nas znajomym!
    </h1>
    <br>
    <p>
      Mamy świetną wiadomość: zaproś do nas dowolną ilość znajomych, którzy jeszcze nie kupowali styropianów na naszej stronie, i odbierz 25 zł na każde zamówienie nowego użytkownika! Twoje bonusy automatycznie zamienią się na zniżki przy kolejnych zakupach.
      <br>
      <br>
      Wystarczy, że wpiszesz tutaj numer telefonu twojego znajomego lub wyślesz mu twój link referencyjny.
    </p>
    <div class="my-5">
      Twój link referencyjny to: https://mega1000.pl/sklep?ref={{ btoa(currentUser.id) }}
    </div>
    <form @submit.prevent="submitForm">
      <TextInput :value="refereedPhoneNumber" @input="refereedPhoneNumber = $event" placeholder="Wpisz numer telefonu" />

      <SubmitButton class="mt-4">
        Wyślij numer
      </SubmitButton>
    </form>
  </div>
</template>
