<template>
  <section>
    <div class="mx-auto max-w-screen-xl py-10">
      <NuxtLink class="md:grid flex md:gap-8 justify-between text-gray-400 grid-cols-10 gap-5 mx-1" href="/styropiany">
        <div class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/genderka.webp" alt="Genderka - Lider rynku" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/swisspor.webp" alt="Swisspor - Szwajcarska precyzja" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (13).jpeg" alt="Termoorganika - Naturalnie ciepły dom" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/arsanit.webp" alt="Arsanit - Komfort na lata" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/austroterm.webp" alt="Austroterm - Najwyższa jakość" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/yetico.webp" alt="Yetico - Energia oszczędności" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (4).png" alt="Ciepły dom to szczęśliwy dom" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/unnamed.png" alt="Zaufana marka, komfortowa izolacja" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/knauf.png" alt="Knauf - Eksperci izolacji" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/polstyr_logo_without_background.png" alt="Polstyr - Polska jakość" class="md:w-[70%]">
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const logos = [
  '/genderka.webp',
  '/swisspor.webp',
  '/kubala.webp',
  '/arsanit.webp',
  '/austroterm.webp',
  '/yetico.webp',
  '/knauf.png',
  '/polstyr_logo_without_background.png',
  '/unnamed.png',
  '',
  '/austroterm.webp',
  '/yetico.webp',
]

const slider = ref(null)
const visibleLogos = ref(6) // Default number of visible logos
const displayLogos = computed(() => {
  if (logos.length <= visibleLogos.value) return logos
  return [...logos, ...logos.slice(0, visibleLogos.value)]
})

onMounted(() => {
  updateSliderWidth()
  window.addEventListener('resize', updateSliderWidth)
})

watch(displayLogos, updateSliderWidth)

function updateSliderWidth() {
  if (slider.value) {
    const sliderWidth = slider.value.scrollWidth
    slider.value.style.setProperty('--slider-width', `${sliderWidth / 2}px`)
  }
}
</script>

<style scoped>
@keyframes slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-1 * var(--slider-width)));
  }
}

.animate-slide {
  animation: slide 30s linear infinite;
}
</style>
