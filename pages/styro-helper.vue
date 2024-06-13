<template>
  <div class="container">
    <h2 class="title">Jakiego styropianu potrzebujesz?</h2>
    <label class="input">
      <input
          type="text"
          placeholder="Np: Potrzebuję czegoś na ocieplenie podłogi..."
          v-model="prompt"
          @keyup.enter="sendS"
      />
      <button class="button" @click="sendS" :disabled="!prompt">Wyślij</button>
    </label>
    <div v-if="response" class="response-container">
      <div class="response-header">
        <h3>{{ response.message }}</h3>
      </div>
      <transition-group name="product-list" tag="div" class="product-list">
        <div
            v-for="(product, index) in response.products"
            :key="index"
            class="product-item"
        >
          {{ product }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

const prompt = ref("");
const response = ref(null);

const sendS = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const url = `https://admin.mega1000.pl/api/styro-help`;

  axios
      .post(url, {
        message: prompt.value,
        formData: queryParams.toString(),
      })
      .then((res) => {
        response.value = res.data;
        prompt.value = "";
      });
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  margin-right: 10px;
}

.button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.response-container {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.response-header {
  margin-bottom: 10px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.product-item {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 4px;
  margin: 5px;
  transition: transform 0.3s ease;
}

.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.3s ease;
}

.product-list-enter-from,
.product-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
