<template>
  <div v-if="showLoader" class="loader-container">
    <div class="loader">
      <div class="styrofoam-pack">
        <div class="face front"></div>
        <div class="face back"></div>
        <div class="face right"></div>
        <div class="face left"></div>
        <div class="face top"></div>
        <div class="face bottom"></div>
      </div>
    </div>
    <div class="loader-text mt-10">
      <p>Ładowanie, prosimy poczekać... Ale czekanie ci się opłaci :)</p>
      <p class="fact">{{ currentFact }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  showLoader: {
    type: Boolean,
    required: true,
  },
});

const facts = [
  "Styropian składa się w 98% z powietrza!",
  "Styropian jest odporny na wilgoć i pleśń.",
  "Styropian może być w 100% poddany recyklingowi.",
  "Styropian został wynaleziony przypadkowo w 1941 roku.",
  "Styropian jest doskonałym izolatorem dźwięku.",
];

const currentFact = ref(facts[0]);
let factInterval;

onMounted(() => {
  let index = 0;
  factInterval = setInterval(() => {
    index = (index + 1) % facts.length;
    currentFact.value = facts[index];
  }, 5000);
});

onUnmounted(() => {
  clearInterval(factInterval);
});
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
}

.loader {
  width: 200px;
  height: 200px;
  position: relative;
  perspective: 1000px;
  margin-bottom: 20px;
}

.styrofoam-pack {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate 10s linear infinite;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #f0f0f0, #ffffff);
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.front  { transform: rotateY(0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

@keyframes rotate {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

.loader-text {
  font-size: 1.2em;
  color: #333;
  text-align: center;
  max-width: 80%;
}

.fact {
  font-style: italic;
  color: #3498db;
  margin-top: 10px;
  animation: fadeInOut 5s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
