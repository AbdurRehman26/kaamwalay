/**
 * @api {post} /v1/admin/wallets/{wallet}/credit Wallet Credit
 * @apiName Customer Wallet Credit
 * @apiGroup Admin Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @urlParam {Number} wallet resource ID for wallet. E.g. 1
 * @apiParam {Number} amount amount to credit. E.g. 10
 * @apiSuccess {Object} data success response
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 1,
 *                "description": Customer added to wallet,
 *                "amount": 10.,
 *                "created_at": 2021-12-01 00:00:00,
 *            }
 *        }
 */
