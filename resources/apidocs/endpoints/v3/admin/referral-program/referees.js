/**
 * @api {get} /v3/admin/referral-program/referees List Referees
 * @apiName List Referees
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[signed_up_between]] for searching referrers list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 * @apiParam {Array} [filter[submissions]] For filtering records by orders submissions referrer by user. E.g. filter[submissions]=1,3
 * @apiParam {Array} [sort] For sorting records by email, customer_number, full_name, created_at . E.g. sort=-email, sort=email
 * @apiParam {Array} [filter[search]] For searching records by email, customer_number, full_name . E.g. filter[search]=abdc
 * @apiParam {Array} [filter[salesman_id]] To filter referrers that are owned an specific salesman . E.g. filter[salesman_id]=id
 * @apiParam {Array} [filter[is_referral_active]] To filter users which have referral status as Acitve/Inactive . E.g. filter[is_referral_active]=true
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                      "id": 23,
 *                      "profile_image": null,
 *                      "first_name": "John",
 *                      "last_name": "Doe",
 *                      "full_name": "John Doe",
 *                      "customer_number": "C00000023",
 *                      "email": "john.doe@example.org",
 *                      "phone": null,
 *                      "created_at": "2022-03-08T19:21:37.000000Z",
 *                      "submissions": 0,
 *                      "cards_count": 0,
 *                      "sign_ups": 2,
 *                      "is_referral_active": 1,
 *                      "sales": 0,
 *                      "commission": 0
 *                  },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v3/admin/referral-program/referees?page=1",
 *                "last": "http://robograding.test/api/v3/admin/referral-program/referees?page=1",
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
 *                        "url": "http://robograding.test/api/v3/admin/referral-program/referees?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v3/admin/referral-program/referees",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
