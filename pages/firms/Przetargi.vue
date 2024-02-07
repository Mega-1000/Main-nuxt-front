<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const offers = ref<[]>([]);

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  // const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;
  auctions.value = [
      {
        "id": 36,
        "end_of_auction": "2024-02-08",
        "date_of_delivery": "2024-02-16",
        "price": 50,
        "quality": 50,
        "chat_id": 10555,
        "confirmed": 1,
        "created_at": "2024-02-03T09:37:34.000000Z",
        "updated_at": "2024-02-03T09:43:02.000000Z",
        "editPricesLink": "https:\/\/admin.mega1000.pl\/auctions\/offer\/create\/6u9tSVsI301WCopC38RB9a1XaqooDiXrpO5kdAayCSKlRhrkHdvp5OJ8VXHN",
        "offers": [
          {
            "id": 86,
            "commercial_price_net": 45.6,
            "basic_price_net": 152,
            "calculated_price_net": 30.4,
            "aggregate_price_net": 0,
            "commercial_price_gross": 56.09,
            "basic_price_gross": 186.96,
            "calculated_price_gross": 37.39,
            "aggregate_price_gross": 0,
            "order_item_id": 248909,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-03T09:50:03.000000Z",
            "updated_at": "2024-02-03T09:50:03.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 87,
            "commercial_price_net": 57.6,
            "basic_price_net": 192,
            "calculated_price_net": 9.6,
            "aggregate_price_net": 0,
            "commercial_price_gross": 70.85,
            "basic_price_gross": 236.16,
            "calculated_price_gross": 11.81,
            "aggregate_price_gross": 0,
            "order_item_id": 248910,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-03T09:50:18.000000Z",
            "updated_at": "2024-02-03T09:50:18.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 88,
            "commercial_price_net": 45.6,
            "basic_price_net": 152,
            "calculated_price_net": 30.4,
            "aggregate_price_net": 0,
            "commercial_price_gross": 56.09,
            "basic_price_gross": 186.96,
            "calculated_price_gross": 37.39,
            "aggregate_price_gross": 0,
            "order_item_id": 248909,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-03T09:50:39.000000Z",
            "updated_at": "2024-02-03T09:50:39.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 89,
            "commercial_price_net": 57.62,
            "basic_price_net": 192.08,
            "calculated_price_net": 19.21,
            "aggregate_price_net": 57.62,
            "commercial_price_gross": 70.87,
            "basic_price_gross": 236.26,
            "calculated_price_gross": 23.63,
            "aggregate_price_gross": 70.87,
            "order_item_id": 248911,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-03T09:50:59.000000Z",
            "updated_at": "2024-02-03T09:50:59.000000Z",
            "send_notification": 1,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 90,
            "commercial_price_net": 57.62,
            "basic_price_net": 192.08,
            "calculated_price_net": 9.6,
            "aggregate_price_net": 57.62,
            "commercial_price_gross": 70.87,
            "basic_price_gross": 236.26,
            "calculated_price_gross": 11.81,
            "aggregate_price_gross": 70.87,
            "order_item_id": 248910,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-03T09:51:03.000000Z",
            "updated_at": "2024-02-03T09:51:03.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 91,
            "commercial_price_net": 46.16,
            "basic_price_net": 153.86,
            "calculated_price_net": 30.77,
            "aggregate_price_net": 46.16,
            "commercial_price_gross": 56.78,
            "basic_price_gross": 189.25,
            "calculated_price_gross": 37.85,
            "aggregate_price_gross": 56.78,
            "order_item_id": 248909,
            "chat_auction_id": 36,
            "firm_id": 728,
            "created_at": "2024-02-05T09:29:09.000000Z",
            "updated_at": "2024-02-05T09:29:09.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 728,
              "name": "CENTRUM BUDOWLANE TOMBUD PLUS SP. Z O.O. OSIELSKO",
              "short_name": "",
              "symbol": "TOMBUD-OSIELSKO",
              "delivery_warehouse": null,
              "email": "biuro@tombudplus.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "523813833",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "uxqyRrnLCdaRepxh26LVnGrSWhZclSAHH6WIhYzVNY6AZlZTO4ple5cjPJA6",
              "laravel_through_key": 728
            }
          },
          {
            "id": 92,
            "commercial_price_net": 45.6,
            "basic_price_net": 152,
            "calculated_price_net": 30.4,
            "aggregate_price_net": 0,
            "commercial_price_gross": 56.09,
            "basic_price_gross": 186.96,
            "calculated_price_gross": 37.39,
            "aggregate_price_gross": 0,
            "order_item_id": 248909,
            "chat_auction_id": 36,
            "firm_id": 728,
            "created_at": "2024-02-05T09:30:21.000000Z",
            "updated_at": "2024-02-05T09:30:21.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 728,
              "name": "CENTRUM BUDOWLANE TOMBUD PLUS SP. Z O.O. OSIELSKO",
              "short_name": "",
              "symbol": "TOMBUD-OSIELSKO",
              "delivery_warehouse": null,
              "email": "biuro@tombudplus.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "523813833",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "uxqyRrnLCdaRepxh26LVnGrSWhZclSAHH6WIhYzVNY6AZlZTO4ple5cjPJA6",
              "laravel_through_key": 728
            }
          },
          {
            "id": 93,
            "commercial_price_net": 55.5,
            "basic_price_net": 185,
            "calculated_price_net": 9.25,
            "aggregate_price_net": 0,
            "commercial_price_gross": 68.27,
            "basic_price_gross": 227.55,
            "calculated_price_gross": 11.38,
            "aggregate_price_gross": 0,
            "order_item_id": 248910,
            "chat_auction_id": 36,
            "firm_id": 728,
            "created_at": "2024-02-05T09:30:45.000000Z",
            "updated_at": "2024-02-05T09:30:45.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 728,
              "name": "CENTRUM BUDOWLANE TOMBUD PLUS SP. Z O.O. OSIELSKO",
              "short_name": "",
              "symbol": "TOMBUD-OSIELSKO",
              "delivery_warehouse": null,
              "email": "biuro@tombudplus.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "523813833",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "uxqyRrnLCdaRepxh26LVnGrSWhZclSAHH6WIhYzVNY6AZlZTO4ple5cjPJA6",
              "laravel_through_key": 728
            }
          },
          {
            "id": 94,
            "commercial_price_net": 55.5,
            "basic_price_net": 185,
            "calculated_price_net": 18.5,
            "aggregate_price_net": 0,
            "commercial_price_gross": 68.27,
            "basic_price_gross": 227.55,
            "calculated_price_gross": 22.75,
            "aggregate_price_gross": 0,
            "order_item_id": 248911,
            "chat_auction_id": 36,
            "firm_id": 728,
            "created_at": "2024-02-05T09:31:15.000000Z",
            "updated_at": "2024-02-05T09:31:15.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 728,
              "name": "CENTRUM BUDOWLANE TOMBUD PLUS SP. Z O.O. OSIELSKO",
              "short_name": "",
              "symbol": "TOMBUD-OSIELSKO",
              "delivery_warehouse": null,
              "email": "biuro@tombudplus.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "523813833",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "uxqyRrnLCdaRepxh26LVnGrSWhZclSAHH6WIhYzVNY6AZlZTO4ple5cjPJA6",
              "laravel_through_key": 728
            }
          },
          {
            "id": 95,
            "commercial_price_net": 55.2,
            "basic_price_net": 184,
            "calculated_price_net": 9.2,
            "aggregate_price_net": 0,
            "commercial_price_gross": 67.9,
            "basic_price_gross": 226.32,
            "calculated_price_gross": 11.32,
            "aggregate_price_gross": 0,
            "order_item_id": 248910,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-05T12:11:04.000000Z",
            "updated_at": "2024-02-05T12:11:04.000000Z",
            "send_notification": 0,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          },
          {
            "id": 96,
            "commercial_price_net": 55.2,
            "basic_price_net": 184,
            "calculated_price_net": 18.4,
            "aggregate_price_net": 0,
            "commercial_price_gross": 67.9,
            "basic_price_gross": 226.32,
            "calculated_price_gross": 22.63,
            "aggregate_price_gross": 0,
            "order_item_id": 248911,
            "chat_auction_id": 36,
            "firm_id": 736,
            "created_at": "2024-02-05T12:11:17.000000Z",
            "updated_at": "2024-02-05T12:11:17.000000Z",
            "send_notification": 1,
            "firm": {
              "id": 736,
              "name": "",
              "short_name": "",
              "symbol": "CWANIAK-SIANOWO",
              "delivery_warehouse": null,
              "email": "579qqq@o2.pl",
              "secondary_email": null,
              "complaint_email": "",
              "nip": "",
              "account_number": "",
              "status": "ACTIVE",
              "phone": "602256996",
              "secondary_phone": null,
              "notices": "M",
              "secondary_notices": null,
              "created_at": "2019-01-25T11:22:39.000000Z",
              "updated_at": "2024-02-03T18:46:00.000000Z",
              "id_from_old_db": null,
              "firm_type": "PRODUCTION",
              "send_request_to_update_data": 0,
              "access_token": "IrAblIzonC5RSIANiOaGCrzhPAUc4TMY4ca3szwbVGdAURtzfEjrpDXJth7f",
              "laravel_through_key": 736
            }
          }
        ],
        "chat": {
          "id": 10555,
          "created_at": "2024-02-02T11:31:31.000000Z",
          "updated_at": "2024-02-03T09:42:25.000000Z",
          "product_id": null,
          "order_id": 85020,
          "need_intervention": 0,
          "user_id": 12,
          "complaint_form": "",
          "questions_tree": "",
          "order": {
            "id": 85020,
            "id_from_front_db": null,
            "customer_id": 56326,
            "status_id": 3,
            "firm_source_id": null,
            "last_status_update_date": null,
            "total_price": "0.00",
            "weight": "0.00",
            "shipment_price_for_client": "0.00",
            "shipment_price_for_us": null,
            "customer_notices": null,
            "cash_on_delivery_amount": null,
            "allegro_transaction_id": null,
            "employee_id": 50,
            "created_at": "2024-02-02T11:28:32.000000Z",
            "updated_at": "2024-02-03T09:43:02.000000Z",
            "warehouse_id": null,
            "additional_service_cost": null,
            "invoice_warehouse_file": null,
            "document_number": null,
            "consultant_earning": null,
            "warehouse_cost": null,
            "printed": "",
            "correction_description": null,
            "correction_amount": null,
            "packing_warehouse_cost": null,
            "rating": null,
            "rating_message": null,
            "shipping_abroad": 0,
            "proposed_payment": null,
            "additional_cash_on_delivery_cost": null,
            "shipment_date": null,
            "shipment_start_days_variation": null,
            "consultant_notices": null,
            "remainder_date": null,
            "invoice_number": null,
            "additional_info": null,
            "print_order": 0,
            "consultant_notice": null,
            "consultant_value": null,
            "warehouse_notice": null,
            "warehouse_value": null,
            "production_date": null,
            "master_order_id": null,
            "spedition_comment": "",
            "token": "PaOEWdOdO8PwlbQ73FrYujdf0n2COAlo",
            "payment_deadline": null,
            "sello_id": null,
            "initial_sending_date_client": null,
            "initial_sending_date_consultant": null,
            "initial_sending_date_magazine": null,
            "confirmed_sending_date_consultant": null,
            "initial_pickup_date_client": null,
            "confirmed_pickup_date_client": null,
            "confirmed_pickup_date_consultant": null,
            "initial_delivery_date_consultant": null,
            "confirmed_delivery_date": null,
            "proforma_filename": "i5ixIDLXRVh5d30HBh6CD0p1ALfhLUavsgL8b60A.pdf",
            "financial_comment": "",
            "return_payment_id": "",
            "to_refund": null,
            "refunded": null,
            "refund_id": null,
            "allegro_form_id": null,
            "allegro_deposit_value": null,
            "allegro_operation_date": null,
            "allegro_additional_service": null,
            "payment_channel": null,
            "labels_log": "\nDodano etykiet\u0119id:  2024-02-02 12:28:35 przez u\u017ctkownika: \nDodano etykiet\u0119id: 39 2024-02-02 12:28:38 przez u\u017ctkownika: \nDodano etykiet\u0119id: 39 2024-02-02 12:28:43 przez u\u017ctkownika: \nDodano etykiet\u0119id: 39 2024-02-02 12:28:47 przez u\u017ctkownika: \nDodano etykiet\u0119id: 39 2024-02-02 12:28:50 przez u\u017ctkownika: \nDodano etykiet\u0119id: 95 2024-02-02 12:28:50 przez u\u017ctkownika: \nDodano etykiet\u0119id: 39 2024-02-02 12:28:53 przez u\u017ctkownika: \nDodano etykiet\u0119id: 224 2024-02-02 12:36:53 przez u\u017ctkownika: 001\nDodano etykiet\u0119id: 58 2024-02-02 12:44:17 przez u\u017ctkownika: \nDodano etykiet\u0119id: 224 2024-02-02 12:44:36 przez u\u017ctkownika: 001\nDodano etykiet\u0119id: 224 2024-02-02 12:50:14 przez u\u017ctkownika: 001\nDodano etykiet\u0119id: 224 2024-02-03 08:54:07 przez u\u017ctkownika: 001\nDodano etykiet\u0119id: 58 2024-02-03 10:37:37 przez u\u017ctkownika: \nDodano etykiet\u0119id: 224 2024-02-03 10:43:02 przez u\u017ctkownika: 001",
            "confirmed_sending_date_warehouse": null,
            "confirmed_pickup_date_warehouse": null,
            "initial_delivery_date_warehouse": null,
            "data_verified_by_allegro_api": 0,
            "allegro_payment_id": null,
            "preferred_invoice_date": null,
            "need_support": 0,
            "reminder_date": null,
            "proposed_cash_on_delivery": "20.00",
            "invoice_bilans": null,
            "is_buying_admin_side": 0,
            "preliminary_buying_document_number": null,
            "buying_document_number": null,
            "packages_values": "{\"DPDd\": 0, \"GLSkd\": 0, \"GLSks\": 0}",
            "is_hidden": 0,
            "send_auto_messages": 1,
            "customer": {
              "id": 56326,
              "id_from_old_db": null,
              "login": "matikinus@gmail.com",
              "nick_allegro": null,
              "status": "ACTIVE",
              "is_staff": 0,
              "created_at": "2023-09-29T13:29:56.000000Z",
              "updated_at": "2023-09-29T13:29:56.000000Z",
              "login_token": null,
              "login_token_expires_at": null
            }
          }
        }
      }
]

  auctions.value.forEach((auction: any) => {
    auction.offersExpanded = false;
    auction.activeOffers = auction.offers.splice(0, 3);
  });
};

const expandOffers = (auction: any) => {
  auction.offersExpanded = true;
  auction.activeOffers = auction.offers;
};

const collapseOffers = (auction: any) => {
  auction.offersExpanded = false;
  auction.activeOffers = auction.offers.splice(0, 3);
};
</script>

<template>
  <div v-for="auction in auctions" class="border p-3 mx-auto w-1/2 mt-12 text-lg flex justify-between">
    <div>
      ID: {{ auction.id }}
      <br>Koniec aukcji {{ auction.end_of_auction }}
      <br>Data dostawy {{ auction.date_of_delivery }}
      <br>Cena {{ auction.price }}
      <br>Jakość {{ auction.quality }}
      <br>Utworzona {{ auction.created_at }}
      <br>Zaktualizowana {{ auction.updated_at }}
      <br>Email klienta: {{ auction.chat.order.customer.login }}
      <br>Telefon klienta: {{ auction.chat.order.customer.addresses[0].phone }} <a :href="`tel:${auction.chat.order.customer.addresses[0].phone}`">Zadzwoń</a>
    </div>

    <div>
      <a :href="auction.editPricesLink" target="__blank">
        <SubmitButton>
          Zmień swoje ceny w tym przetargu
        </SubmitButton>
      </a>

      <br>

      Oferty:
      <div v-for="offer in auction.activeOffers" class="tooltip">
          ID: {{ offer.id }} Firma: {{ offer.firm.symbol }} Cena: {{ offer.basic_price_net }}
          <span class="tooltip-text">
            Cena za opakowanie handlowe: {{ offer.commercial_price_net }}<br>
            Cena za m3: {{ offer.basic_price_net }}<br>
            cena za m2: {{ offer.calculated_price_net }}<br>
          </span>
      </div>

      <SubmitButton @click="auction.offersExpanded === false ? expandOffers(auction) : collapseOffers(auction)">
        <span v-if="auction.offersExpanded === false">
          Wyświetl wszystkie oferty
        </span>
        <span v-else>
          Ogranicz oferty
        </span>
      </SubmitButton>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 20px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
}

</style>
