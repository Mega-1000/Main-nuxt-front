<template>
  <div v-if="showLoader" class="loader-container">
    <div class="loader"></div>
    <div class="loader-text">Ładowanie tabeli cen, prosimy poczekać...</div>
  </div>
</template>

<script setup>
const props = defineProps({
  showLoader: {
    type: Boolean,
    required: true,
  },
});
</script>

<style>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-text {
  font-size: 1.2em;
  color: #333;
  text-align: center;
  max-width: 80%;
}
</style>
