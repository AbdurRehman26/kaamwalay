/**
 * @api {get} /admin/customers List customers
 * @apiName List Customers
 * @apiGroup Admin Customers
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[signed_up_between]] for searching customers list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 * @apiParam {Array} [filter[submissions]] For filtering records by orders submissions by user. E.g. filter[submissions]=1,3
 * @apiParam {Array} [sort] For sorting records by email, customer_number, full_name, created_at . E.g. sort=-email, sort=email
 * @apiParam {Array} [filter[search]] For searching records by email, customer_number, full_name . E.g. filter[search]=abdc
 *
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
 *                   "submissions": 3
 *               },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/admin/customers?page=1",
 *                "last": "http://robograding.test/api/admin/customers?page=1",
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
 *                        "url": "http://robograding.test/api/admin/customers?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/admin/customers",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
