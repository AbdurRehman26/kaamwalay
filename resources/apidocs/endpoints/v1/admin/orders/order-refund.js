/**
 * @api {post} /v1/admin/orders/{order}/order-payments/{orderPayment}/refund Partial/Full Refund Order
 * @apiName Refund Order
 * @apiGroup Admin Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data OrderPayment object
 *
 * @apiParam {String} notes notes for the extra charge.
 * @apiParam {Float} amount amount that needs to be charged.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *            "id": 1,
 *            "order_id": 1,
 *            "notes": "Lorem ispum",
 *            "amount": "12.22",
 *            "type": "refund",
 *            "user": {
 *                  "id": 1,
 *                  "customer_number": "qPQUp1dMlg",
 *                  "first_name": "Carlos",
 *                  "last_name": "Morales",
 *                  "email": "admin@robograding.com",
 *                  "username": "favian.kunze",
 *                  "phone": null,
 *                  "stripe_id": null,
 *                  "roles": [
 *                      {
 *                          "id": 1,
 *                          "name": "admin"
 *                      }
 *                  ]
 *              },
 *              "created_at": "2021-10-28T09:05:23.000000Z"
 *        }
 *    }
 */
