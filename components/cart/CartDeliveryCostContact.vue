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
        Połącz mnie z konsultantem i potwierdz koszty transportu
      </div>
      <div>
        Odpowiedź natychmistowa 7 - 23 poza następnego dnia 7 dni w tygodniu
      </div>
      <div>
        Wymagane uzupełnienie danych kontaktowych poniżej
      </div>
    </button>
  </div>
</template>