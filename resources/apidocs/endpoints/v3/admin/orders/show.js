/**
 * @api {get} /v3/admin/orders/1 Show Order
 * @apiName Show Order
 * @apiGroup Admin Orders
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress,
 *  shippingAddress, orderStatusHistory, orderStatus, user, orderShipment, orderCustomerShipment, createdBy, owner, shippingMethod,
 *  firstOrderPayment, orderLabel, orderCertificate, extraCharges, refunds, coupon]
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *    "data":{
 *       "id":506,
 *       "order_number":"RG000000506",
 *       "number_of_cards":2,
 *       "total_declared_value":2,
 *       "service_fee":36,
 *       "shipping_fee":0,
 *       "cleaning_fee":0,
 *       "grand_total":0,
 *       "customer_id":98,
 *       "created_at":"2023-03-17T17:23:25.000000Z",
 *       "reviewed_at":null,
 *       "graded_at":null,
 *       "shipped_at":null,
 *       "auto_saved_at":null,
 *       "notes":null,
 *       "owner":null,
 *       "order_status":{
 *          "id":2,
 *          "code":"placed",
 *          "name":"Placed",
 *          "description":"Order is paid and placed",
 *          "created_at":"2021-12-01T20:51:02.000000Z",
 *          "updated_at":"2021-12-01T20:51:02.000000Z"
 *       },
 *       "order_status_history":[
 *          {
 *             "id":599,
 *             "notes":null,
 *             "order_id":506,
 *             "order_status_id":2,
 *             "order_status":{
 *                "id":2,
 *                "code":"placed",
 *                "name":"Placed",
 *                "description":"Order is paid and placed",
 *                "created_at":"2021-12-01T20:51:02.000000Z",
 *                "updated_at":"2021-12-01T20:51:02.000000Z"
 *             },
 *             "created_at":"2023-03-17T17:23:25.000000Z",
 *             "updated_at":"2023-03-17T17:23:25.000000Z"
 *          }
 *       ],
 *       "customer":{
 *          "id":98,
 *          "customer_number":"C00000098",
 *          "first_name":"Coupon",
 *          "last_name":"Referee",
 *          "email":"coupon.referee@example.org",
 *          "phone":null,
 *          "wallet":{
 *             "id":70,
 *             "balance":35
 *          },
 *          "referredBy":{
 *             "id":18,
 *             "first_name":"Luis",
 *             "last_name":"Molina",
 *             "full_name":"Luis Molina"
 *          }
 *       },
 *       "shipping_method":{
 *          "id":2,
 *          "code":"vault_storage",
 *          "name":"Vault Storage"
 *       },
 *       "payment_plan":{
 *          "id":684,
 *          "price":18,
 *          "price_before_discount":null,
 *          "discount_percentage":null,
 *          "max_protection_amount":200,
 *          "turnaround":"20 Business Days"
 *       },
 *       "shipping_address":null,
 *       "billing_address":null,
 *       "order_payment":{
 *          "id":412,
 *          "card":{
 *             "brand":"visa",
 *             "exp_month":4,
 *             "exp_year":2024,
 *             "last4":"4242"
 *          },
 *          "amount":35,
 *          "notes":"Payment for Order # RG000000506",
 *          "type":"order_payment",
 *          "payment_method":{
 *             "id":1,
 *             "code":"stripe",
 *             "name":"Credit or Debit Card"
 *          },
 *          "user":null,
 *          "created_at":"2023-03-17T17:24:51.000000Z"
 *       },
 *       "order_items":[
 *          {
 *             "id":2229,
 *             "order_id":506,
 *             "quantity":1,
 *             "declared_value_per_unit":1,
 *             "card_product":{
 *                "id":64,
 *                "long_name":"2021 Pokemon Sword & Shield Series Battle Styles 64",
 *                "short_name":"",
 *                "name":"Dottler",
 *                "card_category_name":"Pokemon",
 *                "card_category_type":"TCG",
 *                "card_set_name":"Battle Styles",
 *                "card_series_name":"Sword & Shield Series",
 *                "release_date":"2021-03-19T00:00:00.000000Z",
 *                "release_year":2021,
 *                "card_number_order":"064",
 *                "image_path":"https:\/\/den-cards.pokellector.com\/305\/Dottler.SWSH05.64.37588.png",
 *                "language":"English",
 *                "variant":"",
 *                "surface":"",
 *                "edition":"",
 *                "added_by_customer":false
 *             },
 *             "status":{
 *                "id":2352,
 *                "order_item_status":{
 *                   "id":1,
 *                   "name":"Pending",
 *                   "description":"Item is pending to be reviewed"
 *                },
 *                "notes":""
 *             },
 *             "certificate_number":null,
 *             "user_card":null,
 *             "notes":"",
 *             "internal_notes":""
 *          },
 *          {
 *             "id":2230,
 *             "order_id":506,
 *             "quantity":1,
 *             "declared_value_per_unit":1,
 *             "card_product":{
 *                "id":10,
 *                "long_name":"2021 Pokemon Sword & Shield Series Battle Styles 10",
 *                "short_name":"",
 *                "name":"Durant",
 *                "card_category_name":"Pokemon",
 *                "card_category_type":"TCG",
 *                "card_set_name":"Battle Styles",
 *                "card_series_name":"Sword & Shield Series",
 *                "release_date":"2021-03-19T00:00:00.000000Z",
 *                "release_year":2021,
 *                "card_number_order":"010",
 *                "image_path":"https:\/\/den-cards.pokellector.com\/305\/Durant.SWSH05.10.37537.png",
 *                "language":"English",
 *                "variant":"",
 *                "surface":"",
 *                "edition":"",
 *                "added_by_customer":false
 *             },
 *             "status":{
 *                "id":2353,
 *                "order_item_status":{
 *                   "id":1,
 *                   "name":"Pending",
 *                   "description":"Item is pending to be reviewed"
 *                },
 *                "notes":""
 *             },
 *             "certificate_number":null,
 *             "user_card":null,
 *             "notes":"",
 *             "internal_notes":""
 *          }
 *       ],
 *       "order_label":null,
 *       "order_certificate":null,
 *       "order_customer_shipment":null,
 *       "order_shipment":null,
 *       "extra_charges":[
 *
 *       ],
 *       "refunds":[
 *          {
 *             "id":415,
 *             "notes":"Lorem",
 *             "amount":35,
 *             "type":"refund",
 *             "user":{
 *                "id":18,
 *                "customer_number":"C00000018",
 *                "first_name":"Luis",
 *                "last_name":"Molina",
 *                "full_name":"Luis Molina",
 *                "email":"luis@wooter.com",
 *                "username":"luism",
 *                "profile_image":"http:\/\/minio:9000\/robograding\/users\/18\/files\/dates\/2022-11-14\/6qW2XkuI_400x400.png",
 *                "phone":"+571234567890",
 *                "stripe_id":"cus_LryANBPI4GM8BT",
 *                "roles":[
 *                   {
 *                      "id":1,
 *                      "name":"admin"
 *                   },
 *                   {
 *                      "id":2,
 *                      "name":"customer"
 *                   },
 *                   {
 *                      "id":3,
 *                      "name":"super-admin"
 *                   },
 *                   {
 *                      "id":4,
 *                      "name":"salesman"
 *                   }
 *                ],
 *                "wallet":{
 *                   "id":35,
 *                   "balance":34.5
 *                },
 *                "is_marketing_notifications_enabled":true
 *             },
 *             "created_at":"2023-03-17T17:46:36.000000Z"
 *          }
 *       ],
 *       "extra_charge_total":0,
 *       "refund_total":35,
 *       "coupon":null,
 *       "discounted_amount":0,
 *       "payment_method_discounted_amount":0,
 *       "payment_method_id":1,
 *       "amount_paid_from_wallet":1,
 *       "payment_status":2,
 *       "requires_cleaning":false,
 *       "salesman_commission":null,
 *       "referral_commission":2,
 *       "shipping_insurance_fee": 10.0,
 *       "requires_shipping_insurance": true
 *    }
 * }
 */
