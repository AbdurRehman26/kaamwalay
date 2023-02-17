/**
 * @api {get} /v3/admin/referral-program/orders List Referral Orders
 * @apiName List Referral Orders
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching orders list based on these columns: order ID, customer Name and Customer ID. E.g. filter[search]=1
 * @apiParam {Array} [filter[payment_status]] For filtering records by order's payment status code. E.g. filter[payment_status]=0, filter[payment_status]=1
 * @apiParam {string} sort For sorting records, supporting params are [grand_total, -grand_total]. E.g. sort=grand_total
 * @apiParam {Array} [include] For including relationships [coupon,invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress,
 *  shippingAddress, orderStatusHistory, orderStatus, user, orderShipment, orderCustomerShipment]
 * @apiSuccess {Object} data Orders data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                  {
 *                      "id": 497,
 *                      "order_number": "RG000000497",
 *                      "number_of_cards": 1,
 *                      "total_declared_value": 1,
 *                      "grand_total": 25.7,
 *                          "customer": {
 *                          "id": 112,
 *                          "customer_number": "C00000112",
 *                          "first_name": "nene",
 *                          "last_name": "nene",
 *                          "email": "nene.nene@example.org",
 *                          "phone": null
 *                      },
 *                      "owner": null,
 *                      "referrer": {
 *                          "id": 5,
 *                          "first_name": "Yeovanni",
 *                          "last_name": "Dickens",
 *                          "full_name": "Yeovanni Dickens"
 *                      },
 *                      "order_status": {
 *                           "id": 2,
 *                           "code": "placed",
 *                           "name": "Placed",
 *                           "description": "Order is paid and placed",
 *                           "created_at": "2021-12-01T20:51:02.000000Z",
 *                           "updated_at": "2021-12-01T20:51:02.000000Z"
 *                       },
 *                       "invoice": {
 *                           "id": 661,
 *                           "invoice_number": "RG000000497",
 *                           "path": "http://minio:9000/robograding/invoice/a77085df-cb26-4bce-b1f2-b75095db2239.pdf",
 *                           "created_at": "2023-02-14T00:27:28.000000Z",
 *                           "updated_at": "2023-02-14T00:27:28.000000Z"
 *                       },
 *                      "payment_status": 2,
 *                      "created_at": "2023-02-14T00:26:48.000000Z",
 *                      "coupon": {
 *                          "id": 26,
 *                          "code": "V0XNK",
 *                          "description": "Submission discount referred by a user",
 *                          "type": "percentage",
 *                          "discount_value": "35.00",
 *                          "coupon_applicable_id": 3,
 *                          "coupon_status_id": 2,
 *                          "available_from": "2023-02-14",
 *                          "available_till": "2023-02-16",
 *                          "is_permanent": false,
 *                          "usage_allowed_per_user": 1
 *                      }
 *                  },
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
