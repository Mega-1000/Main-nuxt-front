<script setup>
import { checkIfUserIsLoggedIn } from "~/helpers/authenticationCheck";

onMounted(() => {
  checkIfUserIsLoggedIn();
});

const submitForm = () => {

};
</script>
<template>
  <div>
    <h1>
      Zgarnij 30 zł polecając nas znajomym!
    </h1>
    <p>
      Mamy świetną wiadomość: zaproś do nas dowolną ilość znajomych, którzy jeszcze nie kupowali styropianów na naszej stronie, i odbierz 25 zł na każde zamówienie nowego użytkownika! Twoje bonusy automatycznie zamienią się na zniżki przy kolejnych zakupach.
      <br>
      <br>
      Wystarczy, że wpiszesz tutaj numer telefonu twojego znajomego lub wyślesz mu twój link referencyjny.
    </p>

    <form @submit.prevent="submitForm">
      <TextInput placeholder="Wpisz numer telefonu" />

      <SubmitButton>
        Wyślij numer
      </SubmitButton>
    </form>
  </div>
</template>
