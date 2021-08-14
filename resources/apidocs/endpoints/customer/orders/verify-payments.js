/**
 * @api {post} /customer/orders/{order}/payments/{paymentIntentId} Verify Order Payment
 * @apiName Verify Order Payment
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {string} message response message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
            "message": "Payment verified successfully"
        }
 */
