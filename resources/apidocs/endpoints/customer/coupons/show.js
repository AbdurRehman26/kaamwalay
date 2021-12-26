/**
 * @api {get} /customer/coupons/HvTGSYpak9?couponables_id=1 Show Coupon
 * @apiName Show Coupon
 * @apiGroup Customer Coupons
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} code coupon code
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          data: {
 *              id: 1,
 *              code: "HvTGSYpak9",
 *              type: "fixed",
 *              discount_statement: "20.00 Off",
 *              discount_value: "20.00",
 *              coupon_applicable_id: 5,
 *              coupon_status_id: 5,
 *              available_from: "2021-12-20T18:06:17.000000Z",
 *              available_till: "2022-01-01T18:06:17.000000Z",
 *              is_permanent: false
 *          }
 *      }
 */
