/**
 * @api {get} /v1/wallet/payments Users wallet payments
 * @apiName List Wallet Payments
 * @apiGroup Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data wallet payments list
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                      "date": '2022/01/05',
 *                      "reason": '',
 *                      "amount": '',
 *                }
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v1/customer/wallet/payments?page=1",
 *                "last": "http://robograding.test/api/v1/customer/wallet/payments?page=1",
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
 *                        "url": "http://robograding.test/api/v1/customer/wallet/payments?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v1/customer/wallet/payments",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
