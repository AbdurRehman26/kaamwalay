/**
 * @api {post} /admin/orders/{order}/order-payments/{orderPayment}/refund Partial/Full Refund Order
 * @apiName Refund Order
 * @apiGroup Admin Orders
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
 *        }
 *    }
 */
