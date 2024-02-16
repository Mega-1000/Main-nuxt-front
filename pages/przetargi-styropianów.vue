<script setup>
import { ref, onMounted } from 'vue';
import SubmitButton from "../components/SubmitButton.vue";
const { $shopApi: shopApi } = useNuxtApp();

const styrofoamTypes = ref([]);
const selections = ref([{ value: null }]);

onMounted(async () => {
  const types = await shopApi.get('/auctions/get-styrofoam-types');
  styrofoamTypes.value = Array.from(types.data.map((styrofoam) => ({ label: styrofoam, value: styrofoam })));
});

const addSelection = () => {
  if (selections.value.length < 5) {
    selections.value.push({ value: null });
  }
};

const updateSelection = (index, newValue) => {
  selections.value[index].value = newValue;
  if (index === selections.value.length - 1 && selections.value.length < 5) {
    addSelection();
  }
};

const showQuotes = () => {

}
</script>

<template>
  <div class="w-[70%] mx-auto">
    <div v-for="(selection, index) in selections" :key="index" class="flex justify-between mt-4">
      <SelectInput
          label="Wybierz rodzaj styropianu"
          :options="styrofoamTypes"
          v-model="selection.value"
          @change="updateSelection(index, $event)"
          v-if="styrofoamTypes.length !== 0"
          class="w-[85%]"
      />

      <SubmitButton onclick="showQuotes(selection)">
        Pokaż ceny
      </SubmitButton>
    </div>
    <br>
    <br>
    <SubmitButton>
      Zapisz przetarg
  </SubmitButton>
  </div>
</template>
