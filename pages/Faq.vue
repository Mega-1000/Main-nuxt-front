<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const { $shopApi: shopApi } = useNuxtApp();

const questions = ref([]);
const category = ref('');
const answer = ref('');
const withFormButton = ref('');
const fillAccountData = ref(false);

onMounted(async () => {
  const { data } = await shopApi.get("/api/faqs/get");
  questions.value = data;
});

const getWithForm = (decision) => {
  withFormButton.value = decision;
}

const categoryQuestions = computed(() => {
  return questions.value[category.value];
});

const [parent] = useAutoAnimate()
</script>

<template>
  <div class="w-[70%] mx-auto mt-8">
    <div>
      <h1 class="text-4xl">Pytania i odpowiedzi</h1>
    </div>

    <div class="rounded bg-slate-500 p-4 mt-4">
      Wybierz interesującą cię kwestię

      <div class="mt-6 text-2xl font-semibold">
        Dane kontaktowe:
      </div>
      Adres email: info@mega1000.pl
      <button class="bg-slate-700 text-white rounded px-4 py-2 block mt-4">Zadaj pytanie</button>
    </div>

    <div class="flex">

      <div class="w-[15%]">
        <button v-for="(questions, name) in questions" @click="category = name; answer = ''"
          class="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6 ">
          {{ name }}
        </button>
      </div>

      <div class="m-5" ref="parent">
        <div v-if="answer" class="my-5">
          <p>{{ answer }}</p>
        </div>
        <div v-for="question in categoryQuestions" :key="question.id" @click="answer = question.answer">
          <div class="pointer bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6">
            <h2 class="text-lg">{{ question.question }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>