<template>
  <Transition name="fade">
    <div class="social-proof" v-show="showNotification">
      <div class="notification">
        <div class="notification-content">
          <div class="notification-image">
            <img :src="randomImage" alt="User Avatar" />
          </div>
          <div class="notification-text">
            <p class="name">{{ customerName }} z {{ location }}</p>
            <p class="action">{{ actionName }}</p>
            <p class="time">{{ timePeriod }}</p>
          </div>
        </div>
        <button class="close-button" @click="closeNotification" aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showNotification = ref(false);
const customerName = ref('');
const location = ref('');
const actionName = ref('');
const timePeriod = ref('');
const randomImage = ref('');

const spFrequency = 12000; // Reduced frequency for more frequent notifications
const spTimeout = 8000; // Increased visibility time
let popBackup = null;
let toggleVar = null;

const names = [
  "Anonimowy", "Ktoś", "Marek", "Piotrek", "Walerian", "Saszka2213", "henio", "Marta", "Jeremiasz",
  "Anna", "Karolina", "Tomasz", "Michał", "Ewa", "Zofia", "Krzysztof", "Magdalena"
];
const towns = [
  "Wrocław", "Poznań", "Katowice", "Warszawa", "Kalisz", "Nowa Wieś", "Gorzów Wielkopolski",
  "Zielona Góra", "Kłodawka", "Lublin", "Skierniewice", "Babimost", "Kraków", "Gdańsk", "Szczecin"
];

const recentActions = [
  "właśnie zamówił(a) 40.23m³ styropianu",
  "właśnie zamówił(a) 13m³ styropianu",
  "właśnie zamówił(a) 75.5m³ styropianu",
  "właśnie zamówił(a) 200m³ styropianu",
  "właśnie zapytał(a) o cenę 50m³ styropianu",
  "właśnie porównuje oferty na styropian",
  "właśnie zaoszczędził(a) 15% na zamówieniu styropianu"
];

const avatars = [
  "/api/placeholder/50/50?text=👤1",
  "/api/placeholder/50/50?text=👤2",
  "/api/placeholder/50/50?text=👤3",
  "/api/placeholder/50/50?text=👤4",
  "/api/placeholder/50/50?text=👤5"
];

const updateSocialProofData = () => {
  const selectedName = names[Math.floor(Math.random() * names.length)];
  const selectedTown = towns[Math.floor(Math.random() * towns.length)];
  const selectedAction = recentActions[Math.floor(Math.random() * recentActions.length)];
  const selectedAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  customerName.value = selectedName;
  location.value = selectedTown;
  actionName.value = selectedAction;
  timePeriod.value = 'Właśnie teraz';
  randomImage.value = selectedAvatar;

  showNotification.value = true;

  popBackup = setTimeout(() => {
    showNotification.value = false;
  }, spTimeout);
};

const closeNotification = () => {
  clearTimeout(popBackup);
  showNotification.value = false;
};

onMounted(() => {
  setTimeout(() => {
    updateSocialProofData();
    toggleVar = setInterval(updateSocialProofData, spFrequency);
  }, 5000); // Start notifications sooner
});

onBeforeUnmount(() => {
  clearTimeout(popBackup);
  clearInterval(toggleVar);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.social-proof {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  font-family: 'Roboto', sans-serif;
}

.notification {
  width: 300px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.notification:hover {
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 12px;
}

.notification-image img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.notification-text {
  margin-left: 12px;
  flex: 1;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 2px;
}

.action {
  font-size: 13px;
  color: #4a4a4a;
  margin: 0 0 2px;
}

.time {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #333;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
