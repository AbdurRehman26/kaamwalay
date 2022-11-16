/**
 * @api {get} /api/v2/admin/salesmen/{salesman}/commission-payments List Salesmen Commission Payments
 * @apiName List Salesmen Commission Payments
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For searching records by email, full_name . E.g. filter[search]=abdc
 * @apiParam {Array} [filter[signed_up_between]] for searching salesmen list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 * @apiParam {String} sort sorting the data. Currently supported created_at column: status E.g. created_at
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                   "id": 1,
 *                   "amount": 10.0,
 *                   "added_by": {
 *                       "id": 1,
 *                       "first_name": "John",
 *                       "last_name": "Doe",
 *                       "full_name": "John Doe",
 *                   },
 *                   "salesman": {
 *                       "id": 1,
 *                       "first_name": "John",
 *                       "last_name": "Doe",
 *                       "full_name": "John Doe",
 *                   },
 *                   "notes": "Test Notes",
 *                   "file_url": "https://file.com/test.png",
 *                   "created_at": "2021-12-13",
 *               },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v2/admin/ssalesmen/1/commission-payments?page=1",
 *                "last": "http://robograding.test/api/v2/admin/ssalesmen/1/commission-payments?page=1",
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
 *                        "url": "http://robograding.test/api/v2/admin/ssalesmen/1/commission-payments?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v2/admin/ssalesmen/1/commission-payments",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
