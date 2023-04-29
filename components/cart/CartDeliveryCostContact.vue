<script setup lang="ts">
const props = defineProps<{
  disabled: boolean,
  loading: boolean,
}>()

const emit = defineEmits<{
  (e: 'createChat', value: boolean): void
}>()

const createChat = (redirect: boolean) => {
  emit('createChat', redirect);
}
</script>

<template>
  <div class="text-right" v-if="!loading">
    <div>
      Przed uzyciem buttona koniecznie uzupełnij dane adresowe ponizej.
    </div>
    <button class="bg-blue-600 rounded px-4 py-2 text-white w-fit disabled:bg-slate-400" @click="createChat(true)" :disabled="disabled">
      <div>
        Połącz mnie z konsultantem aby potwierdzić koszty transportu godzina 7 - 23
      </div>
    </button>
    <div>
      Poza tymi godzinami zostanie wysłane zapytanie ofertowe na które odpowiemy następnego dnia.
    </div>

    <button class="bg-blue-600 rounded px-4 py-2 text-white w-fit disabled:bg-slate-400" :disabled="disabled" @click="createChat(false)">
      Wyślij do sprawdzenia kosztów transportu bez łączenia z konsultantem
    </button>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <div class="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  </div>
</template>
