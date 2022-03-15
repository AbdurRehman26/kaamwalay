/**
 * @api {post} /v1/customer/orders/{id}/update-credit-discount Update order credit and discount amount
 * @apiName Update Order Credit And Discount Amount
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "billing_address": {
 *              "same_as_shipping": true,
 *              "first_name": "optional",
 *              "last_name": "optional",
 *              "address": "optional",
 *              "city": "optional",
 *              "state": "optional",
 *              "zip": "optional",
 *              "phone": "optional",
 *              "flat": "optional",
 *          },
 *          "payment_by_wallet": 0,
 *          "coupon": {
 *              "code": "JS3NJXS"
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
 *            }
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
 *            }
 *        }
 *    }
 */
