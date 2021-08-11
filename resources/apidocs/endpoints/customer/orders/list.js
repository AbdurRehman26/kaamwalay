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
         {
            "data": [
                {
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
                }
            ],
            "links": {
                "first": "http://localhost/api/customer/orders?page=1",
                "last": "http://localhost/api/customer/orders?page=1",
                "prev": null,
                "next": null
            },
            "meta": {
                "current_page": 1,
                "from": 1,
                "last_page": 1,
                "links": [
                    {
                        "url": null,
                        "label": "&laquo; Previous",
                        "active": false
                    },
                    {
                        "url": "http://localhost/api/customer/orders?page=1",
                        "label": "1",
                        "active": true
                    },
                    {
                        "url": null,
                        "label": "Next &raquo;",
                        "active": false
                    }
                ],
                "path": "http://localhost/api/customer/orders",
                "per_page": 15,
                "to": 5,
                "total": 5
            }
        }
 */
