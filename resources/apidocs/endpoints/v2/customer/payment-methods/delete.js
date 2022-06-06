/**
 * @api {delete} /v2/customer/payment-cards/{paymentMethodId} Delete Payment Method
 * @apiName Delete Payment Method
 * @apiGroup Payment-Methods
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiQuery {paymentMethodId} Payment Method ID ( Stripe )
 * @apiSuccess (204) No Content
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 No-Content
 *        {
 *        }
 */
