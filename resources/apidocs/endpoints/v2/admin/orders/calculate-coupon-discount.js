/**
 * @api {post} /v2/admin/orders/1/coupons/calculate-discount Calculate Order Coupon Discount
 * @apiName Calculate Discount on Coupon For Order
 * @apiGroup Admin Orders
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
 *                  "type": "flat",
 *                  "discount_value": "60.00",
 *                  "coupon_applicable_id": 1,
 *                  "coupon_status_id": 2,
 *                  "available_from": "2022-05-27",
 *                  "available_till": null,
 *                  "is_permanent": true,
 *                  "usage_allowed_per_user": null,
 *                  "coupon_applicable": {
 *                      "id": 1,
 *                      "code": "service_fee",
 *                      "label": "Total Service Fee",
 *                      "description": "Coupon code will be applied to total service fee value only",
 *                      "is_active": true
 *                  }
 *            }
 *        }
 *    }
 */
