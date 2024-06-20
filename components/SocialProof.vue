<template>
  <div class="custom-social-proof" v-show="showNotification">
    <div class="custom-notification">
      <div class="custom-notification-container">
        <div class="custom-notification-image-wrapper">
          <img src="/favicon.ico" />
        </div>
        <div class="custom-notification-content-wrapper">
          <p class="custom-notification-content" id="customername">
            <span>{{ customerName }}</span> z <span>{{ location }}</span>
            <br />
            <strong>{{ actionName }}</strong>
            <small>{{ timePeriod }}</small>
          </p>
        </div>
      </div>
      <div class="custom-close" @click="closeNotification"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showNotification = ref(false);
const customerName = ref('');
const location = ref('');
const actionName = ref('');
const timePeriod = ref('');

const spFrequency = 14500;
const spTimeout = 1200;
let popBackup = null;
let toggleVar = null;

const names = [
  "Anonimowy", "Anonimowy", "Anonimowy", "Ktoś", "Ktoś", "Marek", "Piotrek", "Walerian", "Saszka2213", "henio", "Marta", "Jeremiasz"
];
const towns = [
  "Wrocław","Poznań","Katowice","Warszawa","Kalisz","Nowa wieś","Gorzów wielkopolski","Zielona góra","Kłodawka","Lublin","Skierniewice","Babimost"
];

const pastActions = [
  "Właśnie stworzył przetarg"
];
const recentActions = [
  "Właśnie zamówił 40.23m3 styropianu", "Właśnie zamówił 13m3 styropianu", "Właśnie zamówił 75.5m3 styropianu", "Właśnie zamówił 200m3 styropianu"
];
const futureActions = [
  "Scheduled for this week", "On the schedule", "Scheduled for an interior detail", "Protecting their investment with a ceramic coating", "Having their vehicle polished and sealed", "Getting a full odor removal"
];

const fn_UpdateSocialProofData = () => {
  const selectedName = names[Math.floor(Math.random() * names.length)];
  const selectedTown = towns[Math.floor(Math.random() * towns.length)];

  let selectedAction = recentActions[Math.floor(Math.random() * recentActions.length)];

  customerName.value = selectedName;
  location.value = selectedTown;
  actionName.value = selectedAction;
  timePeriod.value = 'Właśnie teraz';
};

const fn_ToggleSocialProof = () => {
  showNotification.value = !showNotification.value;
  if (showNotification.value) {
    fn_UpdateSocialProofData();
  }
  popBackup = setTimeout(() => {
    showNotification.value = !showNotification.value;
  }, spTimeout);
};

const fn_Percentage = (paraPercent) => Math.random() < paraPercent / 100;


const closeNotification = () => {
  clearTimeout(popBackup);
  clearTimeout(toggleVar);
  showNotification.value = false;
};

onMounted(() => {
  fn_UpdateSocialProofData();
  showNotification.value = true;
  toggleVar = setInterval(fn_ToggleSocialProof, spFrequency);
});

onBeforeUnmount(() => {
  clearTimeout(popBackup);
  clearTimeout(toggleVar);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600');

.custom-social-proof {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999999999999 !important;
  font-family: 'Open Sans', sans-serif;
}

.custom-notification {
  width: 320px;
  border: 0;
  text-align: left;
  z-index: 99999;
  box-sizing: border-box;
  font-weight: 400;
  border-radius: 6px;
  box-shadow: 2px 2px 10px 2px hsla(0, 4%, 4%, 0.2);
  background-color: #fff;
  position: relative;
  cursor: pointer;
}

.custom-notification-container {
  display: flex !important;
  align-items: center;
  height: 80px;
}

.custom-notification-image-wrapper img {
  max-height: 75px;
  width: 90px;
  overflow: hidden;
  border-radius: 6px 0 0 6px;
  object-fit: cover;
}

.custom-notification-content-wrapper {
  margin: 0;
  height: 100%;
  color: gray;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0 6px 6px 0;
  flex: 1;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
}

.custom-notification-content {
  font-family: inherit !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: 14px;
  line-height: 16px;
}

.custom-notification-content small {
  margin-top: 3px !important;
  display: block !important;
  font-size: 12px !important;
  opacity: .8;
}

.custom-close {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 12px;
  width: 12px;
  cursor: pointer;
  transition: .2s ease-in-out;
  transform: rotate(45deg);
  opacity: 0;
}

.custom-close::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: gray;
  position: absolute;
  left: 0;
  top: 5px;
}

.custom-close::after {
  content: "";
  display: block;
  height: 100%;
  width: 2px;
  background-color: gray;
  position: absolute;
  left: 5px;
  top: 0;
}

.custom-notification:hover .custom-close {
  opacity: 1;
}
</style>
