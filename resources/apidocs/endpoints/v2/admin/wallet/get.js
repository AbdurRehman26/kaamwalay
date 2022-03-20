/**
 * @api {get} /v2/admin/wallets/{wallet} Wallet Details
 * @apiName Wallet Details
 * @apiGroup Admin Wallet
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @urlParam {Number} wallet resource ID for wallet. E.g. 1
 * @apiSuccess {Object} data Wallet data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 1,
 *                "name": "John Doe",
 *                "balance": 10.00
 *            }
 *        }
 */
