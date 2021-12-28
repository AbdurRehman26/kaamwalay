/**
 * @api {post} /v1/customer/orders/{order}/payments/{paymentIntentId} Verify Order Payment
 * @apiName Verify Order Payment
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 * 
 * @apiParam {Integer} id Order unique ID
 * @apiParam {string} string Payment Intent unique ID
 *
 * @apiSuccess {string} message response message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
            "message": "Payment verified successfully"
        }
 */
