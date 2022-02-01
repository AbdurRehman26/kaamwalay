/**
 * @api {post} /v1/customer/orders/{id}/addresses Update order addresses
 * @apiName Update Order Addresses
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
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
 *          "shipping_method": {
 *              "id": 1
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
