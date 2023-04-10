/**
 * @api {post} /v2/customer/orders/{order}/coupons/remove Remove Coupon
 * @apiName Remove Coupon From Order
 * @apiGroup Customer Coupons
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *    {
 *        "success": true
 *    }
 */
