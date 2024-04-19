<template>
  <nuxt-link href="/styropiany">
    <img src="/promo1.png" class="mx-auto mt-8">
  </nuxt-link>
</template>

<script setup>
import { ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';

const images = ref([
  'promo1.png',
  'promo2.png',
]);
const currentSlide = ref(0);

const { pause, resume } = useIntervalFn(() => {
  nextSlide();
}, 3000, { immediate: true });

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length;
}
</script>
