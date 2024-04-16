<script lang="ts" setup>
  import ShipmentCostCalculatorFn from "~/helpers/ShipmentCostCalculator";
  import PackageCalculator from "~/helpers/PackageCalculator";

  const cart = ref();
  const table = ref({});
  const total = ref(0);
  const showBox = ref(localStorage.getItem('showBox') === 'true');

  onMounted(() => {
    if (localStorage.getItem('showBox') === null) {
      localStorage.setItem('showBox', 'true');
    }

    init();
    window.addEventListener('cart:change', () => init());
  });

  watch(showBox, (val) => {
    localStorage.setItem('showBox', val.toString());
  });

  const init = () => {
    cart.value = new Cart();
    cart.value.init();

    const { GLSks, GLSkd, DPDd } = PackageCalculator(cart.value.products);

    total.value = ShipmentCostCalculatorFn(cart.value.products)
    table.value = {
      GLS: GLSks,
      GLs: GLSkd,
      DPD: DPDd,
    };
  }
</script>

<template>
  <div class="hidden md:block ml-4 fixed z-10 rounded-lg p-4 bg-gray-50">
    <transition name="fade" mode="out-in">
      <div v-if="showBox">
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
              Kurier
            </td>

            <td v-for="(v, k) in table">
              {{ k }}
            </td>
          </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Ilość paczek
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
                po zaokrlągl.
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
                Cena w PLN
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
                Warość w PLN
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
    </transition>

    <button @click="showBox = !showBox">{{ showBox ? 'ZAMKNIJ TABELĘ' : 'Otwórz tabelę kosztów transportu' }}</button>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
