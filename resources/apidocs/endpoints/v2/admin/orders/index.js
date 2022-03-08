/**
 * @api {get} /v2/admin/orders List orders
 * @apiName List Orders
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching orders list based on these columns: order ID, customer Name and Customer ID. E.g. filter[search]=1
 * @apiParam {Array} [filter[order_id]] For filtering records by order ID. E.g. filter[order_id]=1
 * @apiParam {Array} [filter[order_number]] For filtering records by order number. E.g. filter[order_number]=RG000000029
 * @apiParam {Array} [filter[order_status]] For filtering records by order number. E.g. filter[order_status]=3
 * @apiParam {Array} [filter[customer_id]] For filtering records by customer ID. E.g. filter[customer_id]=1
 * @apiParam {Array} [filter[customer_name]] For filtering records by customer name. E.g. filter[customer_name]=Jhon
 * @apiParam {Array} [filter[status]] For filtering records by order's status code. E.g. filter[status]=arrived, filter[status]=1
 * @apiParam {string} sort For sorting records, supporting params are [grand_total, -grand_total]. E.g. sort=grand_total
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress,
 *  shippingAddress, orderStatusHistory, orderStatus, user, orderShipment, orderCustomerShipment]
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
 *                    "status": "Pending Payment",
 *                    "customer_shipment": {
 *                        "id": 1,
 *                        "shipping_provider": "usps",
 *                        "tracking_number": "9400100000000000000000"
 *                    },
 *                    "grade": {
 *                        "grade": null,
 *                        "nickname": null
 *                    },
 *                    "shipment": {
 *                        "id": 14,
 *                        "shipment_date": "2021-09-20T20:12:48.000000Z",
 *                        "shipping_provider": "usps",
 *                        "tracking_number": "9400100000000000000000"
 *                        "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=9400100000000000000000",
 *                    }
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
 *                    "status": "Pending Payment",
 *                    "customer_shipment": {
 *                        "id": 2,
 *                        "shipping_provider": "fedex",
 *                        "tracking_number": "020207021381215"
 *                    },
 *                    "grade": {
 *                        "grade": 7,
 *                        "nickname": "NM"
 *                    },
 *                    "shipment": {
 *                        "id": 14,
 *                        "shipment_date": "2021-09-20T20:12:48.000000Z",
 *                        "shipping_provider": "usps",
 *                        "tracking_number": "9400100000000000000000"
 *                        "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=9400100000000000000000",
 *                    }
 *                },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v2/customer/orders?page=1",
 *                "last": "http://robograding.test/api/v2/customer/orders?page=1",
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
 *                        "url": "http://robograding.test/api/v2/customer/orders?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v2/customer/orders",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
