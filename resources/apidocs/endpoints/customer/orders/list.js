/**
 * @api {get} /customer/orders List orders
 * @apiName List Orders
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[order_number]] For filtering records by order number. E.g. filter[order_number]=RG000000001
 *
 * @apiSuccess {Object} data Orders data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                    "id": 29,
 *                    "order_number": "RG000000029",
 *                    "created_at": {
 *                        "date": "2021-08-12 02:22:46.000000",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                    "arrived_at": {
 *                        "date": "2021-08-12 02:42:56.957751",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                    "payment_plan": {
 *                        "id": 1,
 *                        "price": 20,
 *                        "max_protection_amount": 500,
 *                        "turnaround": "28-30 Day"
 *                    },
 *                    "number_of_cards": 11,
 *                    "status": "Pending Payment"
 *                },
 *                {
 *                    "id": 28,
 *                    "order_number": "RG000000028",
 *                    "created_at": {
 *                        "date": "2021-08-11 23:10:30.000000",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                    "arrived_at": {
 *                        "date": "2021-08-12 02:42:56.961054",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                    "payment_plan": {
 *                        "id": 1,
 *                        "price": 20,
 *                        "max_protection_amount": 500,
 *                        "turnaround": "28-30 Day"
 *                    },
 *                    "number_of_cards": 11,
 *                    "status": "Pending Payment"
 *                },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/customer/orders?page=1",
 *                "last": "http://robograding.test/api/customer/orders?page=1",
 *                "prev": null,
 *                "next": null
 *            },
 *            "meta": {
 *                "current_page": 1,
 *                "from": 1,
 *                "last_page": 1,
 *                "links": [
 *                    {
 *                        "url": null,
 *                        "label": "&laquo; Previous",
 *                        "active": false
 *                    },
 *                    {
 *                        "url": "http://robograding.test/api/customer/orders?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/customer/orders",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
