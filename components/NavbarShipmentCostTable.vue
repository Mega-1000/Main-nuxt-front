<script lang="ts" setup>
  import ShipmentCostCalculatorFn from "~/helpers/ShipmentCostCalculator";

  const cart = ref();
  const table = ref({});
  const total = ref(0);

  onMounted(() => {
    init();
    window.addEventListener('cart:change', () => init());
  });

  const init = () => {
    cart.value = new Cart();
    cart.value.init();

    let GLSks = 0;
    let GLSkd = 0;
    let DPDd = 0;

    cart.value.products.forEach((item: any) => {
      switch(item.delivery_type) {
        case 'GLS':
          GLSks += item.amount / item.assortment_quantity;
          break;
        case 'GLSd':
          GLSkd += item.amount / item.assortment_quantity;
          break;
        case 'DPDd':
          DPDd += item.amount / item.assortment_quantity;
          break;
      }
    });

    total.value = ShipmentCostCalculatorFn(cart.value.products)
    table.value = {
      GLS: GLSks,
      GLs: GLSkd,
      DPD: DPDd,
    };
  }
</script>

<template>
  <div class="ml-4 fixed z-10 rounded-lg p-4 bg-gray-50">
    <div>
      Kosty dostawy:
    </div>

    <table class="table-auto">
      <thead>

      <tr>
        <th></th>
        <th></th>
        <th style="border-left: 2px solid black" colspan="2" class="text-center">
          Dłużyca
        </th>
      </tr>
      <tr>
        <td>
          Ilość
        </td>

        <td v-for="(v, k) in table">
          {{ k }}
        </td>
      </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            paczek
          </td>

          <td>
            {{ Math.round(table.GLS * 100) / 100 }}
          </td>

          <td>
            {{ Math.round(table.GLs * 100) / 100 }}
          </td>

          <td>
            {{ Math.round(table.DPD * 100) / 100 }}
          </td>
        </tr>

        <tr>
          <td>
            paczek po zaokrlągl.
          </td>

          <td>
            {{ Math.ceil(table.GLS) }}
          </td>

          <td>
            {{ Math.ceil(table.GLs) }}
          </td>

          <td>
            {{ Math.ceil(table.DPD) }}
          </td>
        </tr>

        <tr>
          <td>
            Cena
          </td>

          <td>
            18
          </td>

          <td>
            18
          </td>

          <td>
            48
          </td>
        </tr>

        <tr>
          <td>
            Warość
          </td>

          <td>
            {{ Math.ceil(table.GLS) * 18 }}
          </td>

          <td>
            {{ Math.ceil(table.GLs) * 18 }}
          </td>

          <td>
            {{ Math.ceil(table.DPD) * 48 }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4">
      <b>Suma:</b> {{ total }} zł
    </div>
  </div>
</template>


<style scoped>
th:nth-last-child(-n+1),
td:nth-last-child(-n+1) {
  border-right: 2px solid black;
}

td:nth-last-child(2) {
  border-left: 2px solid black;
}
</style>
