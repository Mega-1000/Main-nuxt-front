<script setup lang="ts">
const props = defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'createChat'): void
}>()
</script>

<template>
  <div class="text-right">
    <div>
      Przed uzyciem buttona koniecznie uzupełnij dane adresowe ponizej.
    </div>
    <button class="bg-blue-600 rounded px-4 py-2 text-white w-fit disabled:bg-slate-400" :disabled="disabled">
      <div>
        Połącz mnie z konsultantem aby potwierdzić koszty transportu godzina 7 - 23
      </div>
    </button>
    <div>
      Poza tymi godzinami zostanie wysłane zapytanie ofertowe na które odpowiemy następnego dnia.
    </div>

    <button class="bg-blue-600 rounded px-4 py-2 text-white w-fit disabled:bg-slate-400" :disabled="disabled" @click="">
      Wyślij do sprawdzenia kosztów transportu bez łączenia z konsultantem
    </button>
  </div>
</template>