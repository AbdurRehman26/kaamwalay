/**
 * @api {post} /v1/admin/coupons/ Store coupon
 * @apiName Store Coupon
 * @apiGroup Admin Coupons
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} code coupon code for new coupon. Example: AGS-2021
 * @apiParam {String} type amount that needs to be charged, only 3 values are allowed: fixed, percentage, flat. Example: fixed
 * @apiParam {Float} discount_value value of the discount. Example: 10
 * @apiParam {Number} coupon_applicable_id resource ID of the coupon applicable. Example: 1
 * @apiParam {String} available_from datetime value representing the start of availability of the coupon, accepted format is: Y-m-d H:i:s.
 * @apiParam {Boolean} is_permanent boolean value representing whether the code is for permanent use. Example: true or 1
 * @apiParam {String} available_till datetime value representing the end of availability of the coupon, accepted format is: Y-m-d H:i:s.
 * @apiParam {Array} couponables array containing IDs of the resource to which the coupon will be applied. Example: [1,2,3]
 * @apiSuccess {Object} data Coupon data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 30,
 *                "code": "fUUEPwWB3V",
 *                "type": "fixed",
 *                "discount_value": "20.00",
 *                "coupon_applicable_id": 34,
 *                "coupon_status_id": 4,
 *                "available_from": "2021-12-30T10:18:01.000000Z",
 *                "available_till": "2021-12-21T10:17:01.000000Z",
 *                "is_permanent": false,
 *                "coupon_status": {
 *                    "id": 4,
 *                    "code": "expired",
 *                    "name": "Expired"
 *                }
 *            }
 *        }
 */
