/**
 * @api {post} /customer/payment-cards/charge Charge the user
 * @apiName Charge Customer
 * @apiGroup Payment-Methods
 *
 * @apiUse header_main
 * @apiUse authorization
 *
 * @apiParam { String } payment_method_id Payment Method ID of the user
 *
 * @apiSuccess {Object} Object containing success payment intent from stripe
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {}
 */
