/**
 * @api {delete} /v1/admin/coupons/{coupon} Delete coupon
 * @apiName Delete Coupon
 * @apiGroup Admin Coupons
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiQuery {Number} coupon resource ID
 * @apiSuccess (204) No Content
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No-Content
 *        {
 *        }
 */
