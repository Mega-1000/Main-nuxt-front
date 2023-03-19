<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const { $shopApi: shopApi } = useNuxtApp();

const questions = ref([]);
const category = ref('');
const answer = ref('');
const withFormButton = ref('');
const questionsTree = ref([]);

const categoryQuestions = computed(() => {
  return questions.value[category.value];
});

onMounted(async () => {
  const { data } = await shopApi.get("/api/faqs/get");
  questions.value = data;
});

const selectQuestion = async (question) => {
  const { data } = await shopApi.get(`/api/faqs/${question.id}`);

  answer.value = data.questions[0].answer;
  console.log(question.questions)
  questionsTree.value = data.questions[0].questions;
};

const [parent] = useAutoAnimate()
</script>

<template>
  <div class="w-[70%] mx-auto mt-8">
    <div>
      <h1 class="text-4xl">Pytania i odpowiedzi</h1>
    </div>

    <div class="rounded bg-slate-500 p-4 mt-4">
      Wybierz interesujący cię temat
    </div>

    <div class="flex">

      <div class="w-[15%]">
        <button v-for="(questions, name) in questions" @click="category = name; answer = ''"
          class="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6 ">
          {{ name }}
        </button>
      </div>

      <div ref="parent" class="m-5">

        <div v-if="answer" class="rounded p-4 bg-slate-300 my-5" ref="parent">
          <p>{{ answer }}</p>
          

          <div v-if="questionsTree[0]">
            <div v-for="q in questionsTree">
              <button @click="answer = q.answer;
              questionsTree = q.questions;"
                class="pointer bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6">
                <h2 class="text-lg">{{ q.question }}</h2>
              </button>
            </div>
          </div>

          <faqContactForm v-else />
        </div>
        <div v-for="question in categoryQuestions" :key="question.id" @click="selectQuestion(question)">
          <div
            class="pointer bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6">
            <h2 class="text-lg">{{ question.question }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>