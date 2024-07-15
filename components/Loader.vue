<template>
  <div v-if="showLoader" class="loader-container">
    <div class="loader">
      <div class="styrofoam-pack">
        <div v-for="face in ['front', 'back', 'right', 'left', 'top', 'bottom']" :key="face" :class="['face', face]">
          <div class="inner-face"></div>
        </div>
      </div>
    </div>
    <div class="loader-text">
      <h2 class="title">Ładowanie...</h2>
      <p class="subtitle">Przygotowujemy coś wyjątkowego dla Ciebie!</p>
      <p class="fact" :key="currentFact">{{ currentFact }}</p>
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
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%);
  font-family: 'Arial', sans-serif;
}

.loader {
  width: 200px;
  height: 200px;
  position: relative;
  perspective: 1000px;
  margin-bottom: 40px;
}

.styrofoam-pack {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate 12s linear infinite;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #e0e0e0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.inner-face {
  width: 80%;
  height: 80%;
  background: linear-gradient(45deg, #f0f0f0, #ffffff);
  border-radius: 10px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
  transform: rotate(45deg);
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
  text-align: center;
  max-width: 80%;
}

.title {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.2em;
  color: #34495e;
  margin-bottom: 20px;
}

.fact {
  font-style: italic;
  font-size: 1.1em;
  color: #3498db;
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.5s ease;
  animation: fadeInOut 5s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translateY(20px); }
  50% { opacity: 1; transform: translateY(0); }
}
</style>
