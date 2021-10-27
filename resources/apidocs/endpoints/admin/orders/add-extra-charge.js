/**
 * @api {post} /admin/orders/{order}/payments/extra-charge Add Extra Charge
 * @apiName Add Extra Charge
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
 *            "card": {
 *                "brand": "visa",
 *                "exp_month": 4,
 *                "exp_year": 2024,
 *                "last4": "4242"
 *              },
 *              "notes": "Lorem ispum",
 *              "amount": "12.22",
 *              "type": "order_payment",
 *              "created_at": "2021-08-12 02:22:46.000000",
 *              "user": {
 *                  "id": 1,
 *                  "first_name": "Jane",
 *                  "last_name": "Doe",
 *                  "email": "test@test.test"
 *              }
 *        }
 *    }
 */
