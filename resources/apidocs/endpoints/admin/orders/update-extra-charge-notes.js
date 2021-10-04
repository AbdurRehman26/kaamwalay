/**
 * @api {put} /admin/orders/{order}/order-payments/{orderPayment} Update Extra Charge Note
 * @apiName Update Extra Charge Note
 * @apiGroup Admin Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data OrderPaymentResource object
 *
 * @apiParam {String} notes notes for the extra charge.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *            "id": 1,
 *            "card": {
 *                "brand": "visa",
 *                "exp_month": 4,
 *                "exp_year": 2024,
 *                "last4": "4242"
 *              },
 *              "notes": "Lorem ispum",
 *              "amount": "12.22",
 *              "type": "order_payment",
 *        }
 *    }
 */
