/**
 * @api {post} /v2/customer/orders/1/coupons/calculate-discount Calculate Order Coupon Discount
 * @apiName Calculate Discount on Coupon For Order
 * @apiGroup Customer Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam { Array } coupon Coupon data
 * @apiParam { String } coupon.code Coupon code
 * @apiParam { Int } coupon.id Coupon id
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "coupon": {
 *              "code": "HvTGSYpak9",
 *              "id": 2
 *          },
 *
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *    {
 *        "data": {
 *            "discounted_amount": 29,
 *            "coupon": {
 *                  "id": 1,
 *                  "code": "HvTGSYpak9",
 *                  "discount_statement": "20.00 Off",
 *            }
 *        }
 *    }
 */
