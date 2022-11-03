/**
 * @api {get} /api/v2/admin/salesmen List Salesmen
 * @apiName List Salesmen
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For searching records by email, full_name . E.g. filter[search]=abdc
 * @apiParam {Array} [filter[signed_up_between]] for searching salesmen list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 * @apiParam {Array} [filter[status]] for searching salesmen list based on active status: status E.g. filter[status]=1
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                   "profile_image": null,
 *                   "full_name": "Joshua M Tassone",
 *                   "customer_number": "C00005558",
 *                   "email": "brittanyxberns@gmail.com",
 *                   "phone": null,
 *                   "signed_up": "2021-12-13",
 *                   "profile_image": null",
 *                   "first_name": "Wilburn",
 *                   "last_name": "Ratke",
 *                   "commission_type": null,
 *                   "commission_value": null,
 *                   "customers": null,
 *                   "orders": null,
 *                   "commission_earned": null,
 *                   "status": null,
 *                   "sales": null
 *               },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v2/admin/salesmen?page=1",
 *                "last": "http://robograding.test/api/v2/admin/salesmen?page=1",
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
 *                        "url": "http://robograding.test/api/v2/admin/salesmen?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v2/admin/salesmen",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
