<script setup>
import { Modal } from "flowbite";

const props = defineProps({
  'addressType': {
    type: String,
    required: true
  }
})

const modal = ref(null);

const addresses = reactive([{"id":38785,"id_from_front_db":null,"customer_id":187,"status_id":4,"firm_source_id":null,"last_status_update_date":"2022-12-13 22:34:58","total_price":"1308.17","weight":"636.30","shipment_price_for_client":"0.00","shipment_price_for_us":null,"customer_notices":null,"cash_on_delivery_amount":null,"allegro_transaction_id":null,"employee_id":50,"created_at":"2022-12-13T12:45:13.000000Z","updated_at":"2023-01-04T08:03:24.000000Z","warehouse_id":16,"additional_service_cost":"228.76","invoice_warehouse_file":null,"document_number":null,"consultant_earning":null,"warehouse_cost":null,"printed":"","correction_description":null,"correction_amount":null,"packing_warehouse_cost":null,"rating":null,"rating_message":null,"shipping_abroad":0,"proposed_payment":"500.00","additional_cash_on_delivery_cost":null,"shipment_date":null,"shipment_start_days_variation":null,"consultant_notices":"\n2022-12-22 08:25:14 009 Malgorzata M: zgłosić się do Wojtka  przed wrzuceniem na produkcję ","remainder_date":null,"invoice_number":null,"additional_info":null,"print_order":1,"consultant_notice":null,"consultant_value":"80.00","warehouse_notice":null,"warehouse_value":null,"production_date":null,"master_order_id":null,"spedition_comment":"","token":"R8WFeQf7P8cFxi2r42gXRNWlB8iL9kE0","payment_deadline":null,"sello_id":null,"initial_sending_date_client":null,"initial_sending_date_consultant":"2022-12-31 00:00:00","initial_sending_date_magazine":null,"confirmed_sending_date_consultant":null,"initial_pickup_date_client":null,"confirmed_pickup_date_client":null,"confirmed_pickup_date_consultant":null,"initial_delivery_date_consultant":null,"confirmed_delivery_date":null,"proforma_filename":"kxPyi4ZSGLOWTMtIHAB8sKbHVS7ZDN5jwVTd91Wf.pdf","financial_comment":"","return_payment_id":"","to_refund":null,"refunded":null,"refund_id":null,"allegro_form_id":"","allegro_deposit_value":null,"allegro_operation_date":null,"allegro_additional_service":null,"payment_channel":null,"labels_log":"\n2022-12-13 13:49:45: Adres do dostawy: zmienione przez klienta: Imię: z `` na `Paweł`, Nazwisko: z `` na `Ceglarski`, Adres: z `` na `spacerowa`, Numer budynku: z `` na `6`, Email: z `` na `ceglasklep@vp.pl`, customers.table.country_id: z `` na `1`\n2022-12-13 13:49:45: Adres do faktury: zmienione przez klienta: Nazwa firmy: z `` na `Paweł Ceglarski Przedsiębiorstwo Handlowo Usługowe \"CEGŁA\"`, NIP: z `` na `6191889297`, Adres: z `` na `spacerowa`, Numer budynku: z `` na `6`, Miasto: z `` na `Trzcinica`, Kod pocztowy: z `` na `63-620`, Email: z `` na `ceglasklep@vp.pl`, customers.table.country_id: z `` na `1`\n2022-12-31 01:10:00 001 kontakt ogolny: dodał etykietę: klient zatwierdzil ostatecznie  zgodnosc oferty pod wzledem danych i asortymentu","confirmed_sending_date_warehouse":null,"confirmed_pickup_date_warehouse":null,"initial_delivery_date_warehouse":null,"data_verified_by_allegro_api":0,"allegro_payment_id":null,"preferred_invoice_date":null,"adress":{"id":65517,"order_id":38785,"type":"INVOICE_ADDRESS","firstname":"JAN","lastname":"NOWAK","firmname":"FIRMNAME","nip":"1111111111","phone_code":null,"phone":"513423123","address":"Nowa","flat_number":"6","city":"Warszawa","postal_code":"63-620","email":"admin@admin.pl","created_at":"2022-12-13T12:45:16.000000Z","updated_at":"2022-12-31T00:18:39.000000Z","country_id":1,"isAbroad":null}},{"id":38791,"id_from_front_db":null,"customer_id":187,"status_id":3,"firm_source_id":null,"last_status_update_date":"2022-12-14 11:08:37","total_price":"6978.08","weight":"1280.30","shipment_price_for_client":"0.00","shipment_price_for_us":null,"customer_notices":null,"cash_on_delivery_amount":null,"allegro_transaction_id":null,"employee_id":50,"created_at":"2022-12-14T07:58:54.000000Z","updated_at":"2023-01-25T17:04:55.000000Z","warehouse_id":16,"additional_service_cost":null,"invoice_warehouse_file":null,"document_number":null,"consultant_earning":null,"warehouse_cost":null,"printed":"","correction_description":null,"correction_amount":null,"packing_warehouse_cost":null,"rating":null,"rating_message":null,"shipping_abroad":0,"proposed_payment":"500.00","additional_cash_on_delivery_cost":null,"shipment_date":null,"shipment_start_days_variation":null,"consultant_notices":"\n2022-12-22 10:10:29 009 Malgorzata M: zgłosić się do Wojtka przed wrzuceniem na produkcję","remainder_date":null,"invoice_number":null,"additional_info":null,"print_order":1,"consultant_notice":null,"consultant_value":null,"warehouse_notice":null,"warehouse_value":null,"production_date":"2022-12-31 09:00:00","master_order_id":null,"spedition_comment":"","token":"ZziFlbF025TeF8WKubDDTJlMLDDIUP4g","payment_deadline":null,"sello_id":null,"initial_sending_date_client":null,"initial_sending_date_consultant":null,"initial_sending_date_magazine":null,"confirmed_sending_date_consultant":null,"initial_pickup_date_client":null,"confirmed_pickup_date_client":null,"confirmed_pickup_date_consultant":null,"initial_delivery_date_consultant":null,"confirmed_delivery_date":null,"proforma_filename":"PfWtMKPJGMToJVGPACnKEFDmjYM5siSpL14HH9Tn.pdf","financial_comment":"","return_payment_id":"","to_refund":null,"refunded":null,"refund_id":null,"allegro_form_id":"","allegro_deposit_value":null,"allegro_operation_date":null,"allegro_additional_service":null,"payment_channel":null,"labels_log":"\n2022-12-14 11:07:18: Adres do dostawy: zmienione przez klienta: Imię: z `` na `Paweł`, Nazwisko: z `` na `Ceglarski`, Adres: z `` na `spacerowa`, Numer budynku: z `` na `6`, Email: z `` na `ceglasklep@vp.pl`, customers.table.country_id: z `` na `1`\n2022-12-14 11:07:18: Adres do faktury: zmienione przez klienta: Nazwa firmy: z `` na `Paweł Ceglarski Przedsiębiorstwo Handlowo Usługowe \"CEGŁA\"`, NIP: z `` na `6191889297`, Adres: z `` na `Spacerowa 6`, Numer budynku: z `` na `6`, Miasto: z `` na `Trzcinica`, Kod pocztowy: z `` na `63-629`, Email: z `` na `Ceglasklep@vp.pl`, customers.table.country_id: z `` na `1`\n2022-12-14 11:09:30 008 Lukasz N: usunął etykietę: przekazano do obslugi konsultantowi-konsultant kasuje etykiete po czym wykonuje zadania dotyczace oferty\n2022-12-22 10:09:41 009 Malgorzata M: dodał etykietę: sprawdzamy poprawnosc zlecenie w kazdym aspekcie - skaskowanie etykiety powoduje podjecie decyzji o przekazaniu do produkcji badz awizacji-mozna takze przesunac ustalenie na pozniejszy czas\n2022-12-31 01:10:05 001 kontakt ogolny: dodał etykietę: klient zatwierdzil ostatecznie  zgodnosc oferty pod wzledem danych i asortymentu\n2023-01-23 16:51:52: Adres do faktury: zmienione przez klienta: Imię: z `JAN` na ``, Nazwisko: z `NOWAK` na ``\n2023-01-25 18:04:55: Adres do faktury: zmienione przez klienta: Nazwa firmy: z `FIRMNAME` na `JAN`","confirmed_sending_date_warehouse":null,"confirmed_pickup_date_warehouse":null,"initial_delivery_date_warehouse":null,"data_verified_by_allegro_api":0,"allegro_payment_id":null,"preferred_invoice_date":null,"adress":null},{"id":39062,"id_from_front_db":null,"customer_id":187,"status_id":3,"firm_source_id":null,"last_status_update_date":"2023-01-21 22:43:11","total_price":"1650.57","weight":"982.40","shipment_price_for_client":"0.00","shipment_price_for_us":null,"customer_notices":null,"cash_on_delivery_amount":null,"allegro_transaction_id":null,"employee_id":50,"created_at":"2023-01-04T12:42:52.000000Z","updated_at":"2023-01-25T17:11:17.000000Z","warehouse_id":null,"additional_service_cost":null,"invoice_warehouse_file":null,"document_number":null,"consultant_earning":null,"warehouse_cost":null,"printed":"","correction_description":null,"correction_amount":null,"packing_warehouse_cost":null,"rating":null,"rating_message":null,"shipping_abroad":0,"proposed_payment":"500.00","additional_cash_on_delivery_cost":null,"shipment_date":null,"shipment_start_days_variation":null,"consultant_notices":null,"remainder_date":null,"invoice_number":null,"additional_info":null,"print_order":0,"consultant_notice":null,"consultant_value":"90.00","warehouse_notice":null,"warehouse_value":null,"production_date":null,"master_order_id":null,"spedition_comment":"","token":"Htso2xP6HcEgxiCDbbfasHY4L9CnRSz4","payment_deadline":null,"sello_id":null,"initial_sending_date_client":null,"initial_sending_date_consultant":null,"initial_sending_date_magazine":null,"confirmed_sending_date_consultant":null,"initial_pickup_date_client":null,"confirmed_pickup_date_client":null,"confirmed_pickup_date_consultant":null,"initial_delivery_date_consultant":null,"confirmed_delivery_date":null,"proforma_filename":"","financial_comment":"","return_payment_id":"","to_refund":null,"refunded":null,"refund_id":null,"allegro_form_id":"","allegro_deposit_value":null,"allegro_operation_date":null,"allegro_additional_service":null,"payment_channel":null,"labels_log":"Oferta została wyświetlona dnia 2023-01-21 22:43:42 przez admin@admin.pl\nProforma została wyświetlona dnia 2023-01-21 22:43:45 przez admin@admin.pl\n\n2023-01-25 18:11:17: Adres do faktury: zmienione przez klienta: customers.table.order_id: z `38791` na `39062`, Kod pocztowy: z `63-629` na `66-400`","confirmed_sending_date_warehouse":null,"confirmed_pickup_date_warehouse":null,"initial_delivery_date_warehouse":null,"data_verified_by_allegro_api":0,"allegro_payment_id":null,"preferred_invoice_date":null,"adress":{"id":65529,"order_id":39062,"type":"INVOICE_ADDRESS","firstname":"","lastname":"","firmname":"JAN","nip":"1111111111","phone_code":null,"phone":"513423123","address":"Nowa","flat_number":"6","city":"Warszawa","postal_code":"66-400","email":"admin@admin.pl","created_at":"2022-12-14T07:58:58.000000Z","updated_at":"2023-01-25T17:11:17.000000Z","country_id":1,"isAbroad":null}}])

const emit = defineEmits(["selectAddress"]);

onMounted(() => {
  const $targetEl = document.getElementById(`modal`);

  const options = {
    backdrop: "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  modal.value = new Modal($targetEl, options);
});

const submitOption = (id) => {
  let address = addresses.filter((address) => address.id === id)[0].adress;

  address.type = props.addressType;

  emit("selectAddress", {
    addresses: address,
  });

  modal.value.hide();
};
</script>

<template>
  <SubmitButton @click="modal?.show()">
    Wyświetl dane z kilku ostatnich zamówień
  </SubmitButton>

  <div :id="`modal`" tabindex="-1"
       class="top-0 fixed z-50 w-auto hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
    <div class="relative w-full h-full max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            Wybierz adres
          </h3>
          <button type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="modal" @click="modal?.hide">
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Zamknij modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6 w-auto">

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Numer oferty
                </th>
                <th scope="col" class="px-6 py-3">
                  Imię
                </th>
                <th scope="col" class="px-6 py-3">
                  Nazwisko
                </th>
                <th scope="col" class="px-6 py-3">
                  Ulica/wioska
                </th>
                <th scope="col" class="px-6 py-3">
                  Miasto
                </th>
                <th scope="col" class="px-6 py-3">
                  Kod pocztowy
                </th>
                <th scope="col" class="px-6 py-3">
                  email
                </th>
                <th scope="col" class="px-6 py-3">
                  telefon
                </th>
                <th scope="col" class="px-6 py-3">
                  akcje
                </th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="address in addresses" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <td class="px-6 py-4">
                    {{ address.id }}
                  </td>
                  <td class="px-6 py-4">

                  </td>
                  <td class="px-6 py-4">
                    {{ addresses.firstname }}
                  </td>
                  <td class="px-6 py-4">
                    {{ addresses.surname }}
                  </td>
                  <td class="px-6 py-4">
                    Warszawa
                  </td>
                  <td class="px-6 py-4">
                    00-000
                  </td>
                  <td class="px-6 py-4">
                    antoniwoj@o2.pl
                  </td>
                  <td class="px-6 py-4">
                    123456789
                  </td>
                  <td class="px-6 py-4">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="submitOption(address.id)">
                      Wybierz
                    </button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
