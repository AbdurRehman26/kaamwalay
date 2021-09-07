/**
 * @api {post} /customer/orders/15/complete-review Complete order review
 * @apiName Complete Order Review
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *            "id": 15,
 *            "order_number": "RG000000015",
 *            "number_of_cards": 1,
 *            "total_declared_value": 15,
 *            "status": "Arrived",
 *            "admin_status": "Reviewed",
 *            "service_fee": 20,
 *            "shipping_fee": 14,
 *            "grand_total": 34,
 *            "created_at": "2021-08-12T19:15:32.000000Z",
 *            "customer": {
 *                "id": 17,
 *                "first_name": "Luis",
 *                "last_name": "Molina",
 *                "email": "luis@wooter.com",
 *                "username": "luis",
 *                "phone": null,
 *                "stripe_id": "cus_K1lUIejV1VeEK8",
 *                "roles": [
 *                    {
 *                        "id": 2,
 *                        "name": "customer"
 *                    }
 *                ]
 *            },
 *            "shipping_method": {
 *                "id": 1,
 *                "code": "insured_shipping",
 *                "name": "Insured Shipping"
 *            },
 *            "payment_plan": {
 *                "id": 1,
 *                "price": 20,
 *                "max_protection_amount": 500,
 *                "turnaround": "28-30 Day"
 *            },
 *            "shipping_address": {
 *                "id": 25,
 *                "first_name": "Luis",
 *                "last_name": "Molina",
 *                "address": "Test",
 *                "city": "Test",
 *                "state": "DE",
 *                "zip": "Test",
 *                "phone": "+1 (129) 309-2380",
 *                "flat": null,
 *                "country": {
 *                    "id": 1,
 *                    "code": "US",
 *                    "name": "United States"
 *                }
 *            },
 *            "billing_address": {
 *                "id": 25,
 *                "first_name": "Luis",
 *                "last_name": "Molina",
 *                "address": "Test",
 *                "city": "Test",
 *                "state": "DE",
 *                "zip": "Test",
 *                "phone": "+1 (129) 309-2380",
 *                "flat": null,
 *                "country": {
 *                    "id": 1,
 *                    "code": "US",
 *                    "name": "United States"
 *                }
 *            },
 *            "order_payment": {
 *                "card": {
 *                    "brand": "visa",
 *                    "exp_month": 4,
 *                    "exp_year": 2024,
 *                    "last4": "4242"
 *                }
 *            },
 *            "order_items": [
 *                {
 *                    "id": 13,
 *                    "quantity": 1,
 *                    "declared_value_per_unit": 15,
 *                    "card_product": {
 *                        "id": 1,
 *                        "name": "Bellsprout",
 *                        "card_category_name": "Pokemon",
 *                        "card_set_name": "Battle Styles",
 *                        "card_series_name": "Sword & Shield Series",
 *                        "release_year": 2021,
 *                        "card_number_order": "001",
 *                        "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                    },
 *                    "status": {
 *                        "id": 5,
 *                        "order_item_status": {
 *                            "id": 4,
 *                            "code": "confirmed",
 *                            "name": "Confirmed",
 *                            "description": "Item is present in the shipped box and will be graded",
 *                            "created_at": "2021-09-07T18:38:01.000000Z",
 *                            "updated_at": "2021-09-07T18:38:01.000000Z"
 *                        },
 *                        "notes": null
 *                    },
 *                    "certificate_number": 3
 *                }
 *            ],
 *            "invoice": null,
 *            "customer_shipment": {
 *                "id": 2,
 *                "shipment_date": null,
 *                "tracking_number": "0001",
 *                "shipping_provider": "fedex"
 *            },
 *            "reviewed_by": "John Doe",
 *            "reviewed_at": "2021-09-07T00:00:00.000000Z"
 *        }
 *    }
 */
