/**
 * @api {get} /v1/admin/orders/1 Show Order
 * @apiName Show Order
 * @apiGroup Admin Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress,
 *  shippingAddress, orderStatusHistory, orderStatus, user, orderShipment, orderCustomerShipment]
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 29,
 *                "order_number": "RG000000029",
 *                "number_of_cards": 11,
 *                "total_declared_value": 5500,
 *                "service_fee": 20,
 *                "shipping_fee": 43,
 *                "grand_total": 263,
 *                "extra_charge_total": 0,
 *                "refund_total": 0,
 *                "created_at": {
 *                    "date": "2021-08-12 02:22:46.000000",
 *                    "timezone_type": 3,
 *                    "timezone": "UTC"
 *                },
 *                "reviewed_by": "John Doe",
 *                "reviewed_at": "2021-09-16T21:45:02.000000Z",
 *                "graded_by": null,
 *                "graded_at": null,
 *                "auto_saved_at": "2021-09-16T21:45:08.000000Z",
 *                "total_graded_items": 0,
 *                "customer": {
 *                    "id": 16,
 *                    "first_name": "Gisselle",
 *                    "last_name": "Homenick",
 *                    "email": "terrance.schmidt@example.net",
 *                    "username": "satterfield.toy",
 *                    "phone": null,
 *                    "stripe_id": "cus_K1Sq1o4TaJvMHX",
 *                    "roles": [
 *                        {
 *                            "id": 2,
 *                            "name": "customer"
 *                        }
 *                    ]
 *                },
 *                "shipping_method": {
 *                    "id": 1,
 *                    "code": "insured_shipping",
 *                    "name": "Insured Shipping"
 *                },
 *                "payment_plan": {
 *                    "id": 1,
 *                    "price": 20,
 *                    "max_protection_amount": 500,
 *                    "turnaround": "28-30 Day"
 *                },
 *                "shipping_address": {
 *                    "id": 57,
 *                    "first_name": "Test",
 *                    "last_name": "Test",
 *                    "address": "Test address",
 *                    "city": "Test",
 *                    "state": "AB",
 *                    "zip": "123A",
 *                    "phone": "1312310913",
 *                    "flat": "43",
 *                    "country": {
 *                        "id": 1,
 *                        "code": "US",
 *                        "name": "United States"
 *                    }
 *                },
 *                "billing_address": {
 *                    "id": 58,
 *                    "first_name": "Test",
 *                    "last_name": "Test",
 *                    "address": "Test address",
 *                    "city": "Test",
 *                    "state": "AB",
 *                    "zip": "123A",
 *                    "phone": "1312310913",
 *                    "flat": "43",
 *                    "country": {
 *                        "id": 1,
 *                        "code": "US",
 *                        "name": "United States"
 *                    }
 *                },
 *                "invoice": {
 *                    "id": 28
 *                    "invoice_number": "RG000000042"
 *                    "path": "http://minio:9000/local/invoice/89a79cd1-48a6-4ee6-a606-c62d83f80f50.pdf"
 *                },
 *                "order_payment": {
 *                    "card": {
 *                        "brand": "visa",
 *                        "exp_month": 4,
 *                        "exp_year": 2024,
 *                        "last4": "4242"
 *                    },
 *                    "notes": "Lorem ispum",
 *                    "amount": "12.22",
 *                    "type": "order_payment",
 *                },
 *                "order_items": [
 *                    {
 *                        "id": 42,
 *                        "quantity": 1,
 *                        "declared_value_per_unit": 500,
 *                        "card_product": {
 *                            "id": 1,
 *                            "name": "Bellsprout",
 *                            "card_category_name": "Pokemon",
 *                            "card_set_name": "Battle Styles",
 *                            "card_series_name": "Sword & Shield Series",
 *                            "release_year": 2021,
 *                            "card_number_order": "001",
 *                            "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                        },
 *                        "status": {
 *                             "id": 6,
 *                             "order_item_status": {
 *                                 "id": 5,
 *                                 "name": "Graded",
 *                                 "description": "Item has been graded by us"
 *                             },
 *                             "notes": ""
 *                        },
 *                        "certificate_number": "00000502",
 *                        "grade": {
 *                            "grade": 7,
 *                            "nickname": "NM"
 *                        },
 *                        "graded_by": "John Doe",
 *                        "graded_at": "2021-09-16T21:58:02.000000Z"
 *                    },
 *                    {
 *                        "id": 43,
 *                        "quantity": 10,
 *                        "declared_value_per_unit": 500,
 *                        "card_product": {
 *                            "id": 2,
 *                            "name": "Weepinbell",
 *                            "card_category_name": "Pokemon",
 *                            "card_set_name": "Battle Styles",
 *                            "card_series_name": "Sword & Shield Series",
 *                            "release_year": 2021,
 *                            "card_number_order": "002",
 *                            "image_path": "https://den-cards.pokellector.com/305/Weepinbell.SWSH05.2.37529.png"
 *                        },
 *                        "status": {
 *                             "id": 5,
 *                             "order_item_status": {
 *                                 "id": 4,
 *                                 "name": "Confirmed",
 *                                 "description": "Item is present in the shipped box and will be graded"
 *                             },
 *                             "notes": ""
 *                        },
 *                        "certificate_number": "00000504",
 *                        "grade": {
 *                            "grade": null,
 *                            "nickname": null
 *                        },
 *                    }
 *                ],
 *                "customer_shipment": {
 *                     "id": 2,
 *                     "shipping_provider": "fedex",
 *                     "tracking_number": "020207021381215"
 *                },
 *                "shipment": {
 *                    "id": 14,
 *                    "shipment_date": "2021-09-20T20:12:48.000000Z",
 *                    "shipping_provider": "usps",
 *                    "tracking_number": "9400100000000000000000"
 *                    "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=9400100000000000000000",
 *                },
 *                 "extra_charges": [
 *                     {
 *                          "card": {
 *                              "brand": "visa",
 *                              "exp_month": 4,
 *                              "exp_year": 2024,
 *                              "last4": "4242"
 *                          },
 *                          "notes": "Lorem ispum",
 *                          "amount": "12.22",
 *                          "type": "extra_charge",
 *                     }
 *                 ],
 *                 "refunds": [
 *                     {
 *                         "id": 1,
 *                         "order_id": 1,
 *                         "notes": "Lorem Ispum",
 *                         "amount": "10.00",
 *                         "type": "refund"
 *                     }
 *                 ],
 *            }
 *        }
 */
