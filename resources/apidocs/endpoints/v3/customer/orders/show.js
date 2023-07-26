/**
 * @api {get} /v3/customer/orders/1 Show Order
 * @apiName Show Order
 * @apiGroup Customer-Orders
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 *
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, shippingAddress, billingAddress, orderStatusHistory, orderStatusHistory.orderStatus, customer, orderShipment, orderCustomerShipment, extraCharges, refunds, coupon, shippingMethod, orderItems.cardProduct.cardSet.cardSeries, orderItems.cardProduct.cardCategory.cardCategoryType, orderItems.orderItemStatusHistory.orderItemStatus, orderItems.userCard, orderPayment.paymentMethod, orderItems.orderItemStatus, billingAddress.country, shippingAddress.country]
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *             "id": 523,
 *             "order_number": "RG000000523",
 *             "number_of_cards": 1,
 *             "total_declared_value": 1,
 *             "status": "Placed",
 *             "service_fee": 18,
 *             "shipping_insurance_fee": 10.0,
 *             "requires_shipping_insurance": true
 *             "shipping_fee": 14,
 *             "cleaning_fee": 0,
 *             "grand_total": 20,
 *             "created_at": "2023-04-24T20:37:24.000000Z",
 *             "customer": {
 *                 "id": 18,
 *                 "customer_number": "C00000018",
 *                 "first_name": "Luis",
 *                 "last_name": "Molina",
 *                 "full_name": "Luis Molina",
 *                 "email": "luis@wooter.com",
 *                 "username": "luism",
 *                 "phone": "+57 123 123 1231"
 *              },
 *             "shipping_method": {
 *                 "id": 1,
 *                 "code": "insured_shipping",
 *                 "name": "Insured Shipping"
 *              },
 *             "payment_plan": {
 *                 "id": 701,
 *                 "price": 18,
 *                 "price_before_discount": null,
 *                 "discount_percentage": null,
 *                 "max_protection_amount": 200,
 *                 "turnaround": "20 Business Days"
 *              },
 *             "shipping_address": {
 *                 "id": 688,
 *                 "first_name": "Lorem",
 *                 "last_name": "Ipsum",
 *                 "address": "Lorem Ipsum",
 *                 "address_2": null,
 *                 "city": "Sit",
 *                 "state": "AL",
 *                 "zip": "12345",
 *                 "phone": "+1 (123) 456-7890",
 *                 "flat": null,
 *                 "country_id": 1,
 *                 "country": {
 *                     "id": 1,
 *                     "code": "US",
 *                     "name": "United States",
 *                     "phone_code": "1"
 *                  }
 *               },
 *             "billing_address": {
 *                 "id": 689,
 *                 "first_name": "Lorem",
 *                 "last_name": "Ipsum",
 *                 "address": "Lorem Ipsum",
 *                 "address_2": "Dolor",
 *                 "city": "Sit",
 *                 "state": "AL",
 *                 "zip": "12345",
 *                 "phone": "+1 (123) 456-7890",
 *                 "flat": null,
 *                 "country_id": 1,
 *                 "country": {
 *                     "id": 1,
 *                     "code": "US",
 *                     "name": "United States",
 *                     "phone_code": "1"
 *                  }
 *              },
 *             "order_payment": {
 *                 "id": 431,
 *                 "card": {
 *                     "brand": "visa",
 *                     "exp_month": 4,
 *                     "exp_year": 2024,
 *                     "last4": "4242"
 *                  },
 *                 "amount": 20,
 *                 "notes": "Payment for Order # RG000000523",
 *                 "type": "order_payment",
 *                 "payment_method": {
 *                     "id": 1,
 *                     "code": "stripe",
 *                     "name": "Credit or Debit Card"
 *                  },
 *                 "created_at": "2023-04-24T20:48:18.000000Z"
 *              },
 *             "order_items": [
 *                  {
 *                     "id": 3082,
 *                     "quantity": 1,
 *                     "order_id": 523,
 *                     "declared_value_per_unit": 1,
 *                     "card_product": {
 *                         "id": 61,
 *                         "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 61",
 *                         "short_name": "",
 *                         "name": "Meowstic",
 *                         "card_category_name": "Pokemon",
 *                         "card_category_type": "TCG",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_date": "2021-03-19T00:00:00.000000Z",
 *                         "release_year": 2021,
 *                         "card_number_order": "061",
 *                         "image_path": "https://den-cards.pokellector.com/305/Meowstic.SWSH05.61.37585.png",
 *                         "language": "English",
 *                         "variant": "",
 *                         "surface": "",
 *                         "edition": "",
 *                         "added_by_customer": false,
 *                         "population": 0,
 *                         "rarity": "Rare",
 *                         "card_number": "61/163",
 *                         "card_category": {
 *                             "id": 1,
 *                             "name": "Pokemon",
 *                             "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Pokemon.png"
 *                          },
 *                         "card_set": {
 *                             "id": 1,
 *                             "name": "Battle Styles",
 *                             "release_date": "2021-03-19T00:00:00.000000Z",
 *                             "image_path": "https://den-media.pokellector.com/logos/Battle-Styles.logo.305.png"
 *                          }
 *                      },
 *                     "status": {
 *                         "id": 1,
 *                         "name": "Pending",
 *                         "description": "Item is pending to be reviewed"
 *                      },
 *                     "user_card": null,
 *                     "notes": ""
 *                  }
 *              ],
 *             "invoice": {
 *                 "id": 713,
 *                 "invoice_number": "RG000000523",
 *                 "path": "http://minio:9000/robograding/invoice/a298e04a-0b50-4a2c-868d-9bd13553ed97.pdf",
 *                 "created_at": "2023-04-24T20:48:20.000000Z",
 *                 "updated_at": "2023-04-24T20:48:20.000000Z"
 *              },
 *             "order_shipment": null,
 *             "order_customer_shipment": {
 *                 "id": 2,
 *                 "shipment_date": null,
 *                 "shipping_provider": "usps",
 *                 "tracking_number": "456",
 *                 "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=456"
 *              },
 *             "order_status": {
 *                 "id": 2,
 *                 "code": "placed",
 *                 "name": "Placed",
 *                 "description": "Order is paid and placed",
 *                 "created_at": "2021-12-01T20:51:02.000000Z",
 *                 "updated_at": "2021-12-01T20:51:02.000000Z"
 *              },
 *             "order_status_history": [
 *                  {
 *                     "id": 628,
 *                     "notes": null,
 *                     "order_id": 523,
 *                     "order_status_id": 2,
 *                     "created_at": "2023-04-24T20:37:24.000000Z",
 *                     "updated_at": "2023-04-24T20:37:24.000000Z"
 *                  }
 *              ],
 *             "extra_charges": [],
 *             "refunds": [],
 *             "extra_charge_total": 0,
 *             "refund_total": 0,
 *             "coupon": {
 *                 "id": 3,
 *                 "code": "50P",
 *                 "discount_statement": "50% discount"
 *              },
 *             "discounted_amount": 9,
 *             "payment_method_discounted_amount": 0,
 *             "payment_method_id": 1,
 *             "amount_paid_from_wallet": 3,
 *             "payment_status": 2,
 *             "order_step": "cardsSelectionStep",
 *             "requires_cleaning": false,
 *             "estimated_delivery_start_at": null,
 *             "estimated_delivery_end_at": null
 *          }
 *        }
 */
