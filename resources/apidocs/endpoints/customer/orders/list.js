/**
 * @api {get} /customer/orders List orders
 * @apiName List Orders
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse authorization
 *
 * @apiSuccess {Array} data Orders List
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
                    "id": 3,
                    "order_number": "b67ae96f-ff60-393e-b363-23844f311a18",
                    "created_at": {
                        "date": "2021-08-11 15:40:24.000000",
                        "timezone_type": 3,
                        "timezone": "UTC"
                    },
                    "arrived_at": {
                        "date": "2015-07-09 00:00:00.000000",
                        "timezone_type": 3,
                        "timezone": "UTC"
                    },
                    "payment_plan": {
                        "id": 10,
                        "price": 2958,
                        "max_protection_amount": 2108,
                        "turnaround": "24 Day Turnaround"
                    },
                    "number_of_cards": 2553,
                    "status": "Elenora"
                },
                {
                    "id": 4,
                    "order_number": "8ff12998-cbed-3718-9712-15f8cc7c94fa",
                    "created_at": {
                        "date": "2021-08-11 15:40:24.000000",
                        "timezone_type": 3,
                        "timezone": "UTC"
                    },
                    "arrived_at": {
                        "date": "1995-12-23 00:00:00.000000",
                        "timezone_type": 3,
                        "timezone": "UTC"
                    },
                    "payment_plan": {
                        "id": 11,
                        "price": 3475,
                        "max_protection_amount": 5205,
                        "turnaround": "7 Day Turnaround"
                    },
                    "number_of_cards": 8081,
                    "status": "Isac"
                },
 *          ]
 *      }
 */
