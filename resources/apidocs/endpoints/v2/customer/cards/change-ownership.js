/**
 * @api {post} /v2/customer/cards/change-ownership Change Ownership Card
 * @apiName Change Ownership
 * @apiGroup User Cards
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} user_id Unique customer id
 * @apiParam {Array} user_card_ids Unique user card ids
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": {
 *             "success": true
 *         }
 *     }
 */
