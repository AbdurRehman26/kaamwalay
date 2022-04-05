/**
 * @api {get} /v1/admin/wallets/{wallet}/history Wallet Transaction History
 * @apiName Wallet Transaction History
 * @apiGroup Admin Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Wallet transaction data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                    "id": 1,
 *                    "description": Customer added to wallet,
 *                    "amount": 10.,
 *                    "created_at": 2021-12-01 00:00:00,
 *                },
 *                {
 *                    "id": 2,
 *                    "description": Customer added to wallet,
 *                    "amount": 10.,
 *                    "created_at": 2021-12-01 00:00:00,
 *                },
 *                {
 *                    "id": 3,
 *                    "description": Customer added to wallet,
 *                    "amount": 10.,
 *                    "created_at": 2021-12-01 00:00:00,
 *                }
 *            ]
 *        }
 */
