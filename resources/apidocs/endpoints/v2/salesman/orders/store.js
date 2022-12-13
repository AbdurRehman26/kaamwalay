/**
 * @api {post} /v2/salesman/orders Create Order
 * @apiName Create Order
 * @apiGroup Salesman Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Boolean} [requires_cleaning] If customer opts in for cleaning, value can be 1, 0, true, false
 * @apiParam {Boolean} [pay_now] If admin wants to pay the order right away, value should be true and a payment method should exist in request
 * @apiParam {Object} [payment_method] Payment method to pay order right away. Initially, id must be the one for Manual Payment.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "user_id": 18,
 *          "payment_plan": {
 *              "id": 1
 *          },
 *          "items": [
 *              {
 *                  "card_product": {
 *                      "id": 1
 *                  },
 *                  "quantity": 1,
 *                  "declared_value_per_unit": 500
 *              },
 *              {
 *                  "card_product": {
 *                      "id": 2
 *                  },
 *                  "quantity": 10,
 *                  "declared_value_per_unit": 500
 *              }
 *          ],
 *          "shipping_address": {
 *              "first_name": "Test",
 *              "last_name": "Test",
 *              "address": "Test address",
 *              "city": "Test",
 *              "state": "AB",
 *              "zip": "123A",
 *              "phone": "1312310913",
 *              "flat": "43",
 *              "save_for_later": true
 *          },
 *          "billing_address": {
 *              "first_name": "Test",
 *              "last_name": "Test",
 *              "address": "Test address",
 *              "city": "Test",
 *              "state": "AB",
 *              "zip": "123A",
 *              "phone": "1312310913",
 *              "flat": "43",
 *              "same_as_shipping": false
 *          },
 *          "shipping_method": {
 *              "id": 1
 *          },
 *          "payment_method": {
 *              "id": 1
 *          },
 *          "coupon": {
 *              "code": "HvTGSYpak9",
 *              "id": 2
 *          },
 *          "payment_by_wallet": 10.00,
 *          "requires_cleaning": 1,
 *          "pay_now": true,
 *          "payment_method": {
 *              "id": 4
 *          }
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *    {
 *        "data": {
 *            "id": 29,
 *            "order_number": "RG000000029",
 *            "order_items": [
 *                {
 *                    "id": 42,
 *                    "quantity": 1,
 *                    "declared_value_per_unit": 500,
 *                    "certificate_number": null,
 *                    "card_product": {
 *                        "id": 1,
 *                        "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 1 Bellsprout",
 *                        "name": "Bellsprout",
 *                        "card_category_name": "Pokemon",
 *                        "card_set_name": "Battle Styles",
 *                        "card_series_name": "Sword & Shield Series",
 *                        "release_year": 2021,
 *                        "card_number_order": "001",
 *                        "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                    },
 *                    "status": {
 *                        "id": 1,
 *                        "name": "Pending",
 *                        "description": "Item is pending to be reviewed"
 *                    },
 *                    "user_card": null
 *                },
 *                {
 *                    "id": 43,
 *                    "quantity": 10,
 *                    "declared_value_per_unit": 500,
 *                    "certificate_number": null,
 *                    "card_product": {
 *                        "id": 2,
 *                        "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 1 Bellsprout",
 *                        "name": "Weepinbell",
 *                        "card_category_name": "Pokemon",
 *                        "card_set_name": "Battle Styles",
 *                        "card_series_name": "Sword & Shield Series",
 *                        "release_year": 2021,
 *                        "card_number_order": "002",
 *                        "image_path": "https://den-cards.pokellector.com/305/Weepinbell.SWSH05.2.37529.png"
 *                    },
 *                    "status": {
 *                        "id": 1,
 *                        "status": "Pending",
 *                        "description": "Item is pending to be reviewed"
 *                    },
 *                    "user_card": null
 *                }
 *            ],
 *            "payment_plan": {
 *                "id": 1,
 *                "price": 20,
 *                "max_protection_amount": 500,
 *                "turnaround": "28-30 Day"
 *            },
 *            "order_payment": {
 *                "card": {
 *                    "brand": "visa",
 *                    "exp_month": 4,
 *                    "exp_year": 2024,
 *                    "last4": "4242"
 *                }
 *            },
 *            "billing_address": {
 *                "id": 58,
 *                "first_name": "Test",
 *                "last_name": "Test",
 *                "address": "Test address",
 *                "city": "Test",
 *                "state": "AB",
 *                "zip": "123A",
 *                "phone": "1312310913",
 *                "flat": "43",
 *                "country": {
 *                    "id": 1,
 *                    "code": "US",
 *                    "name": "United States"
 *                }
 *            },
 *            "shipping_address": {
 *                "id": 57,
 *                "first_name": "Test",
 *                "last_name": "Test",
 *                "address": "Test address",
 *                "city": "Test",
 *                "state": "AB",
 *                "zip": "123A",
 *                "phone": "1312310913",
 *                "flat": "43",
 *                "country": {
 *                    "id": 1,
 *                    "code": "US",
 *                    "name": "United States"
 *                }
 *            },
 *            "shipping_method": {
 *                "id": 1,
 *                "code": "insured_shipping",
 *                "name": "Insured Shipping"
 *            },
 *            "coupon": {
 *                  "id": 1,
 *                  "code": "HvTGSYpak9",
 *                  "discount_statement": "20.00 Off",
 *            },
 *            "discounted_amount" : 40.00,
 *            "service_fee": 2556,
 *            "shipping_fee": 43,
 *            "grand_total": 263,
 *            "amount_paid_from_wallet": 10.00,
 *            "created_by": {
 *                 "id": 1,
 *                 "first_name": "Carlos",
 *                 "last_name": "Morales",
 *                 "full_name": "Carlos Morales"
 *             }
 *        }
 *    }
 */
