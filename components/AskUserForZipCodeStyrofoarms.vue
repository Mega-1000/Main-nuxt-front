<script setup>
  import Swal from 'sweetalert2';

  const zipCode = ref('');

  const submitZipCode = async () =>  {
    localStorage.setItem('zipCode', zipCode.value);

    await Swal.fire('Zapisano kod pocztowy', 'Od teraz będziemy ci pokazywać jedynie ofery w twoim zasięgu', 'success')
    await window.location.reload();
  }
</script>

<template>
  <transition name="fade">
    <div class="modal-backdrop" v-if="true"> <!-- Replace v-if condition with your actual condition for showing the modal -->
      <div class="modal-content">
        <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style="background-color: rgba(0, 0, 0, 0.50)">
          <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Kod pocztowy
                </h3>
              </div>
              <!-- Modal body -->
              <div class="p-4 md:p-5 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Wpisz swój kod pocztowy żebyśmy mogli dobrać fabryki specjalnie dla ciebie
                </p>
                <form @submit.prevent="submitZipCode">
                  <TextInput type="text" @input="zipCode = $event" label="Wpisz kod pocztowy" />

                  <SubmitButton>
                    Zapisz
                  </SubmitButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
/* Define enter and leave animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.modal-backdrop {
  /* Your existing styles for backdrop */
  background-color: rgba(0, 0, 0, 0.17);
  /* Ensure full viewport coverage for the fading effect */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  /* Your existing styles for modal content */
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
