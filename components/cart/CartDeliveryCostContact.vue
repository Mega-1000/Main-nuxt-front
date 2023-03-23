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
    <button class="bg-blue-600 rounded px-4 py-2 text-white w-fit disabled:bg-slate-400" :disabled="disabled">
      <div>
        Połącz mnie z konsultantem aby potwierdzić koszty transportu
      </div>
    </button>
    <div>
      Poza tymi godzinami zostanie wysłane zapytanie ofertowe na które odpowiemy następnego dnia.
    </div>
  </div>
</template>