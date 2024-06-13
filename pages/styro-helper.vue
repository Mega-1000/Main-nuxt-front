<template>
  <div>
    <h2>Jakiego styropianu potrzevujesz?</h2>
    <label class="input">
      <input type="text" placeholder="" v-model="prompt" />
      <span>NP: Porzebuje czaegoś na ocieplenie podłogi...</span>
    </label>
    <div>
      <button @click="sendS">Wyślij</button>
    </div>
  </div>

  <div v-html="response">

  </div>
</template>

<script setup>
  import axios from "axios";

  const prompt = ref('');
  const response = ref('')

  const sendS = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const url = `https://admin.mega1000.pl/api/styro-help`;

    axios.post(url, {
      'message': prompt.value,
      'formData': queryParams.toString()
    }).then((res) => {
      response.value = res.data
    })
  }
</script>
