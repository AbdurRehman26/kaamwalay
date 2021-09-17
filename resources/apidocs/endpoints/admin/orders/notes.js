/**
 * @api {post} /admin/orders/11/notes Update Order Notes
 * @apiName Update Order Notes
 * @apiGroup Admin Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "notes": "Lorem Ipsum Dolor Sit Amet"
 *      }
 *
 * @apiSuccess {Object} data Card object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": {
 *             "id": 15,
 *             "order_number": "RG000000015",
 *             "number_of_cards": 1,
 *             "total_declared_value": 15,
 *             "status": "Arrived",
 *             "service_fee": 20,
 *             "shipping_fee": 14,
 *             "grand_total": 34,
 *             "created_at": "2021-08-12T19:15:32.000000Z",
 *             "reviewed_by": "John Doe",
 *             "reviewed_at": "2021-09-16T21:45:02.000000Z",
 *             "auto_saved_at": "2021-09-16T21:45:08.000000Z",
 *             "total_graded_items": 0,
 *             "customer": {
 *                 "id": 17,
 *                 "first_name": "John",
 *                 "last_name": "Doe",
 *                 "email": "john.doe@wooter.com",
 *                 "phone": null
 *             },
 *             "shipping_method": {
 *                 "id": 1,
 *                 "code": "insured_shipping",
 *                 "name": "Insured Shipping"
 *             },
 *             "payment_plan": {
 *                 "id": 1,
 *                 "price": 20,
 *                 "max_protection_amount": 500,
 *                 "turnaround": "28-30 Day"
 *             },
 *             "shipping_address": {
 *                 "id": 25,
 *                 "first_name": "Luis",
 *                 "last_name": "Molina",
 *                 "address": "Test",
 *                 "city": "Test",
 *                 "state": "DE",
 *                 "zip": "Test",
 *                 "phone": "+1 (129) 309-2380",
 *                 "flat": null,
 *                 "country": {
 *                     "id": 1,
 *                     "code": "US",
 *                     "name": "United States"
 *                 }
 *             },
 *             "billing_address": {
 *                 "id": 25,
 *                 "first_name": "Luis",
 *                 "last_name": "Molina",
 *                 "address": "Test",
 *                 "city": "Test",
 *                 "state": "DE",
 *                 "zip": "Test",
 *                 "phone": "+1 (129) 309-2380",
 *                 "flat": null,
 *                 "country": {
 *                     "id": 1,
 *                     "code": "US",
 *                     "name": "United States"
 *                 }
 *             },
 *             "order_payment": {
 *                 "card": {
 *                     "brand": "visa",
 *                     "exp_month": 4,
 *                     "exp_year": 2024,
 *                     "last4": "4242"
 *                 }
 *             },
 *             "order_items": [
 *                 {
 *                     "id": 13,
 *                     "quantity": 1,
 *                     "declared_value_per_unit": 15,
 *                     "card_product": {
 *                         "id": 1,
 *                         "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 1 Bellsprout",
 *                         "name": "Bellsprout",
 *                         "card_category_name": "Pokemon",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_year": 2021,
 *                         "card_number_order": "001",
 *                         "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                     },
 *                     "status": {
 *                         "id": 92,
 *                         "order_item_status": {
 *                             "id": 1,
 *                             "code": "pending",
 *                             "name": "Pending",
 *                             "description": "Item is pending to be reviewed",
 *                         },
 *                         "notes": null
 *                     },
 *                     "certificate_number": null
 *                 }
 *             ],
 *             "invoice": null,
 *             "customer_shipment": {
 *                 "id": 2,
 *                 "shipment_date": null,
 *                 "tracking_number": "0001",
 *                 "shipping_provider": "fedex"
 *             },
 *             "notes": "Lorem Ipsum Dolor Sit Amet"
 *         }
 *     }
 */
