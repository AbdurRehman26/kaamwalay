/**
 * @api {get} /v3/admin/orders/payment-plans List payment plans
 * @apiName List Payment Plans
 * @apiGroup Admin Payment Plans
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data Payment plans data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "price": 18,
 *                  "max_protection_amount": 200,
 *                  "turnaround": "20 Business Days",
 *                  "price_ranges": [
 *                      {
 *                          "id": 1,
 *                          "min_cards": 1,
 *                          "max_cards": 20,
 *                          "price": 18
 *                      },
 *                      {
 *                          "id": 2,
 *                          "min_cards": 21,
 *                          "max_cards": 50,
 *                          "price": 17
 *                      },
 *                      {
 *                          "id": 3,
 *                          "min_cards": 51,
 *                          "max_cards": 100,
 *                          "price": 16
 *                      },
 *                      {
 *                          "id": 4,
 *                          "min_cards": 101,
 *                          "max_cards": 200,
 *                          "price": 15
 *                      },
 *                      {
 *                          "id": 5,
 *                          "min_cards": 201,
 *                          "max_cards": null,
 *                          "price": 14
 *                      }
 *                  ],
 *                  "min_price": 14,
 *                  "max_price": 18
 *              },
 *              {
 *                  "id": 2,
 *                  "price": 30,
 *                  "max_protection_amount": 500,
 *                  "turnaround": "10 Business Days",
 *                  "price_ranges": [
 *                      {
 *                          "id": 1,
 *                          "min_cards": 1,
 *                          "max_cards": 20,
 *                          "price": 30
 *                      },
 *                      {
 *                          "id": 2,
 *                          "min_cards": 21,
 *                          "max_cards": 50,
 *                          "price": 29
 *                      },
 *                      {
 *                          "id": 3,
 *                          "min_cards": 51,
 *                          "max_cards": 100,
 *                          "price": 28
 *                      },
 *                      {
 *                          "id": 4,
 *                          "min_cards": 101,
 *                          "max_cards": 200,
 *                          "price": 27
 *                      },
 *                      {
 *                          "id": 5,
 *                          "min_cards": 201,
 *                          "max_cards": null,
 *                          "price": 26
 *                      }
 *                  ],
 *                  "min_price": 26,
 *                  "max_price": 30
 *              },
 *              {
 *                  "id": 3,
 *                  "price": 50,
 *                  "max_protection_amount": 1000,
 *                  "turnaround": "5 Business Days",
 *                  "price_ranges": [
 *                      {
 *                          "id": 1,
 *                          "min_cards": 1,
 *                          "max_cards": 20,
 *                          "price": 50
 *                      },
 *                      {
 *                          "id": 2,
 *                          "min_cards": 21,
 *                          "max_cards": 50,
 *                          "price": 49
 *                      },
 *                      {
 *                          "id": 3,
 *                          "min_cards": 51,
 *                          "max_cards": 100,
 *                          "price": 48
 *                      },
 *                      {
 *                          "id": 4,
 *                          "min_cards": 101,
 *                          "max_cards": 200,
 *                          "price": 47
 *                      },
 *                      {
 *                          "id": 5,
 *                          "min_cards": 201,
 *                          "max_cards": null,
 *                          "price": 46
 *                      }
 *                  ],
 *                  "min_price": 46,
 *                  "max_price": 50
 *              }
 *          ]
 *      }
 */
