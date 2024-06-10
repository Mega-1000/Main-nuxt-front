<template>
  <input type="text" v-model="prompt">
  <button @click="sendS">
    send
  </button>

  <div v-html="form">

  </div>


</template>

<script setup>
  import axios from "axios";

  const prompt = ref('');
  const form = ref('')

  const sendS = () => {
    axios.post('https://admin.mega1000.pl/api/styro-help', {
      'message': prompt.value
    }).then((res) => {
      form.value = res.data
    })
  }
</script>
