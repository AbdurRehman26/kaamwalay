/**
 * @api {get} /v2/customer/wallet/transactions Users wallet payments
 * @apiName List Wallet Transactions
 * @apiGroup Wallet
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data wallet transactions list
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                      "id": 1,
 *                      "created_at": '2022-01-06T21:20:15.000000Z',
 *                      "description": 'AGS credited $50 in your wallet.',
 *                      "amount": 50,
 *                }
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v2/customer/wallet/transactions?page=1",
 *                "last": "http://robograding.test/api/v2/customer/wallet/transactions?page=1",
 *                "prev": null,
 *                "next": null
 *            },
 *            "meta": {
 *                "current_page": 1,
 *                "from": 1,
 *                "last_page": 1,
 *                "links": [
 *                    {
 *                        "url": null,
 *                        "label": "&laquo; Previous",
 *                        "active": false
 *                    },
 *                    {
 *                        "url": "http://robograding.test/api/v2/customer/wallet/transactions?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v2/customer/wallet/transactions",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
