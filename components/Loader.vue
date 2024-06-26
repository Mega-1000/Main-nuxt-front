<template>
  <div v-if="showLoader" class="loader-container">
    <div ref="container" class="loader"></div>
    <div class="loader-text">
      <p>Ładowanie, prosimy poczekać... Ale czekanie ci się opłaci :)</p>
      <p class="fact">{{ currentFact }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
const container = ref(null);

let scene, camera, renderer, model, controls;

onMounted(() => {
  initThreeJS();
  loadModel();
  animate();

  let index = 0;
  factInterval = setInterval(() => {
    index = (index + 1) % facts.length;
    currentFact.value = facts[index];
  }, 5000);
});

onUnmounted(() => {
  clearInterval(factInterval);
  if (renderer) {
    renderer.dispose();
  }
});

function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  camera.position.z = 5;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
      'styro.glb',
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
}
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
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
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
