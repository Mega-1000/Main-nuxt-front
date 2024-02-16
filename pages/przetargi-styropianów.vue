<script setup>
  const { $shopApi: shopApi } = useNuxtApp();

  const styrofoamTypes = ref([]);
  const selectedStyrofoamType = '';

  onMounted(async () => {
    const types = await shopApi.get('/auctions/get-styrofoarm-types');

    styrofoamTypes.value = types.data.map((styrofoam) => {return {'label': styrofoam, 'value': styrofoam}});
    console.log(styrofoamTypes.value)
  });

  // watch(selectedStyrofoamType, selectedStyrofoamTypeUpdated())
  //
  // const selectedStyrofoamTypeUpdated = () => {
  //
  // }
</script>

<template>
  <SelectInput
      label="Wybierz rodzaj styropianu"
      :options="styrofoamTypes.value"
      v-model="selectedStyrofoamType"
      v-if="styrofoamTypes.length !== 0"
  />
</template>
