/**
 * @api {get} /v3/auth/me Get Referrer Data
 * @apiName Get Referrer Data
 * @apiGroup Referrer
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data containing referrer information for the logged in user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "referrer": {
 *                   "id": 18,
 *                   "referral_code": "VCVHK",
 *                   "referral_url": "http://robograding.test/referral/VCVHK",
 *                   "withdrawable_commission": 3.25,
 *                   "link_clicks": 0,
 *                   "successful_signups": 0,
 *                   "referral_orders": 2,
 *                   "is_referral_active": true
 *              }
 *          }
 *      }
 */
