/**
 * @api {get} /v3/customer/orders List orders
 * @apiName List Orders
 * @apiGroup Customer-Orders
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[order_number]] For filtering records by order number. E.g. filter[order_number]=RG000000001
 * @apiParam {Array} [filter[order_status_id]] For filtering records by order status. E.g. filter[order_status_id]=1
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, shippingAddress, billingAddress, orderStatusHistory, orderStatusHistory.orderStatus, customer, orderShipment, orderCustomerShipment, extraCharges, refunds, coupon, shippingMethod, orderItems.cardProduct.cardSet.cardSeries, orderItems.cardProduct.cardCategory.cardCategoryType, orderItems.orderItemStatusHistory.orderItemStatus, orderItems.userCard, orderPayment.paymentMethod, orderItems.orderItemStatus, billingAddress.country, shippingAddress.country]
 *
 * @apiSuccess {Object} data Orders data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                      "id": 519,
 *                      "order_number": "RG000000519",
 *                      "number_of_cards": "5",
 *                      "total_declared_value": "9.00",
 *                      "created_at": "2023-04-17T15:33:41.000000Z",
 *                      "payment_plan": {
 *                          "id": 697,
 *                          "price": 30,
 *                          "price_before_discount": null,
 *                          "discount_percentage": null,
 *                          "max_protection_amount": 500,
 *                          "turnaround": "10 Business Days"
 *                      },
 *                      "invoice": {
 *                          "id": 705,
 *                          "invoice_number": "RG000000519",
 *                          "path": "http://minio:9000/robograding/invoice/2b0c75a0-6bc7-4c30-91ed-fc5cd22fa678.pdf",
 *                          "created_at": "2023-04-17T15:33:43.000000Z",
 *                          "updated_at": "2023-04-17T15:33:43.000000Z"
 *                      },
 *                      "order_customer_shipment": null,
 *                      "order_status": {
 *                          "id": 4,
 *                          "code": "graded",
 *                          "name": "Graded",
 *                          "description": "Order has been graded by us",
 *                          "created_at": "2021-12-01T20:51:02.000000Z",
 *                          "updated_at": "2021-12-01T20:51:02.000000Z"
 *                      },
 *                      "payment_status": 2
 *                  },
 *                {
 *                      "id": 518,
 *                      "order_number": "RG000000518",
 *                      "number_of_cards": "2",
 *                      "total_declared_value": "10.00",
 *                      "created_at": "2023-04-13T13:49:46.000000Z",
 *                      "payment_plan": {
 *                          "id": 696,
 *                          "price": 18,
 *                          "price_before_discount": null,
 *                          "discount_percentage": null,
 *                          "max_protection_amount": 200,
 *                          "turnaround": "20 Business Days"
 *                      },
 *                      "invoice": {
 *                          "id": 706,
 *                          "invoice_number": "RG000000518",
 *                          "path": "http://minio:9000/robograding/invoice/01177a8c-c137-41a1-8e76-c64f83bcfa72.pdf",
 *                          "created_at": "2023-04-18T00:17:50.000000Z",
 *                          "updated_at": "2023-04-18T00:17:50.000000Z"
 *                      },
 *                      "order_customer_shipment": null,
 *                      "order_status": {
 *                          "id": 3,
 *                          "code": "confirmed",
 *                          "name": "Confirmed",
 *                          "description": "Order is confirmed.",
 *                          "created_at": "2021-12-01T20:51:02.000000Z",
 *                          "updated_at": "2021-12-01T20:51:02.000000Z"
 *                      },
 *                      "payment_status": 0
 *                  }
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v3/customer/orders?page=1",
 *                "last": "http://robograding.test/api/v3/customer/orders?page=1",
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
 *                        "url": "http://robograding.test/api/v3/customer/orders?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v3/customer/orders",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
