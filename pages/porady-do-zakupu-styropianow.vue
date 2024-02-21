<script setup>
import { ref } from 'vue';

// State to track if the iframe is loading
const isLoading = ref(true);

// Function to call when the iframe has finished loading
function onIframeLoad() {
  isLoading.value = false;
}
</script>

<template>
  <div style="position: relative; width: 70%; margin: 0 auto; height: 80vh;">
    <!-- Loader displayed while isLoading is true -->
    <div v-if="isLoading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.8); z-index: 100;">
      <span>Loading...</span>
    </div>

    <!-- IFrame with the load event listener -->
    <iframe src="https://admin.mega1000.pl/auctions/display-prices-table" style="width: 100%; height: 100%;" @load="onIframeLoad"></iframe>
  </div>
</template>
