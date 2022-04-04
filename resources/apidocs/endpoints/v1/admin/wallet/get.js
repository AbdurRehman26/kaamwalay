/**
 * @api {get} /v1/admin/wallets/{wallet} Wallet Details
 * @apiName Wallet Details
 * @apiGroup Admin Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
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
