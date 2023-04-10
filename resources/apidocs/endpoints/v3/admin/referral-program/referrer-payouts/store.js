/**
 * @api {post} /api/v3/admin/referral-program/payouts Send Payouts
 * @apiName Send Payouts
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {array} items Array of ids for pending payouts that should be send in the batch payout
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "items": [1,2]
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "success": true
 *      }
 */
