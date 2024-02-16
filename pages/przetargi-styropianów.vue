<script setup>
  const { $shopApi: shopApi } = useNuxtApp();

  const styrofoamTypes = [];
  const selectedStyrofoamType = '';

  onMounted(async () => {
    const types = await shopApi.get('/auctions/get-styrofoarm-types');

    styrofoamTypes.value = types.data.map((styrofoam) => {return {'label': styrofoam, 'value': styrofoam}});
  });

  // watch(selectedStyrofoamType, selectedStyrofoamTypeUpdated())
  //
  // const selectedStyrofoamTypeUpdated = () => {
  //
  // }
</script>

<template>
  okej
  <SelectInput
      label="Wybierz rodzaj styropianu"
      :options="styrofoamTypes"
      v-model="selectedStyrofoamType"
  />
</template>
