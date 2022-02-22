/**
 * @api {post} /v2/customer/orders/{order}/order-payment Create order payment
 * @apiName Create Order Payment
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "payment_method": {
 *              "id": 1
 *          },
 *          "coupon": {
 *              "code": "HvTGSYpak9",
 *              "id": 2
 *          },
 *          "payment_by_wallet": 10.00,
 *      }
 *
 * @apiSuccess {Object} data object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 201 OK
 *    {
 *        "success": true
 *    }
 */
