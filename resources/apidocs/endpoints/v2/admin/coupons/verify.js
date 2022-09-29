/**
 * @api {get} /v2/admin/coupons/HvTGSYpak9?couponables_id=1 Verify Coupon
 * @apiName Verify Coupon
 * @apiGroup Admin Coupons
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} code coupon code
 * @apiParam {String} couponables_id id of coupon discount model ( service_level, payment_plan etc )
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          data: {
 *              "id": 1,
 *              "code": "HvTGSYpak9",
 *              "discount_statement": "20.00 Off",
 *          }
 *      }
 */
