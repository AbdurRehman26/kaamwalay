/**
 * @api {get} /customer/orders List orders
 * @apiName List Orders
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse authorization
 *
 * @apiSuccess {Object} data Order data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
         {
            "data": {
                "id": 1,
                "order_number": "b9f7df2e-3168-3b96-ad08-7ef64467f0d9",
                "number_of_cards": 4488,
                "total_declared_value": 32147696.09,
                "grand_total": 7205.14,
                "shipping_fee": 425.13,
                "created_at": {
                    "date": "2021-08-11 15:40:23.000000",
                    "timezone_type": 3,
                    "timezone": "UTC"
                },
                "customer": {
                    "id": 2,
                    "first_name": "Rosemary",
                    "last_name": "Rosemary",
                    "email": "anastacio85@example.com",
                    "username": "amara.senger",
                    "phone": null,
                    "stripe_id": null,
                    "roles": [
                        {
                            "id": 2,
                            "name": "customer"
                        }
                    ]
                },
                "shipping_method": {
                    "id": 2,
                    "code": "sequi",
                    "name": "Gavin"
                },
                "payment_plan": {
                    "id": 8,
                    "price": 4823,
                    "max_protection_amount": 8049,
                    "turnaround": "22 Day Turnaround"
                },
                "shipping_address": {
                    "id": 1,
                    "first_name": "Herta",
                    "last_name": "Dickinson",
                    "address": "New Dax",
                    "state": "maxime",
                    "zip": "76066-6044",
                    "phone": "+1-714-224-8249",
                    "flat": "3",
                    "country": {
                        "id": 12,
                        "code": "PW",
                        "name": "Guernsey"
                    }
                },
                "billing_address": {
                    "id": 2,
                    "first_name": "Ronaldo",
                    "last_name": "Crona",
                    "address": "South Hershelshire",
                    "state": "facilis",
                    "zip": "15250",
                    "phone": "+1-785-698-0042",
                    "flat": "7",
                    "country": {
                        "id": 13,
                        "code": "CY",
                        "name": "Bhutan"
                    }
                },
                "order_items": [
                    {
                        "id": 1,
                        "quantity": 4488,
                        "declared_value_per_unit": 4902455.33,
                        "card_product": {
                            "id": 101,
                            "name": "Kylee",
                            "card_category_name": "Israel",
                            "card_set_name": "Nola",
                            "card_series_name": "Mireille",
                            "release_year": 1982,
                            "card_number_order": "589",
                            "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
                        }
                    }
                ]
            }
        }
 */
