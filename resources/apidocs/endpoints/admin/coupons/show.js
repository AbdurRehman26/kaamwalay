/**
 * @api {get} /admin/coupons/{coupon} List coupon
 * @apiName List Coupon
 * @apiGroup Admin Coupons
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiQuery {Number} coupon coupon ID
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
