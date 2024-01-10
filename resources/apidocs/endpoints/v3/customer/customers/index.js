/**
 * @api {get} /v3/customer List customers
 * @apiName List Customers
 * @apiGroup Customer Customers
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] for searching customers list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                   "profile_image": null,
 *                   "full_name": "Joshua M Tassone",
 *                   "customer_number": "C00005558",
 *                   "email": "b*******@****.com",
 *                   "id": 1
 *               },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/customer?page=1",
 *                "last": "http://robograding.test/api/customer?page=1",
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
 *                        "url": "http://robograding.test/api/customer?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/customer",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
