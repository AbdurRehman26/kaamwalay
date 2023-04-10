/**
 * @api {get} /v3/admin/referral-program/referrers List Referrers
 * @apiName List Referrers
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[signed_up_between]] for searching referees list between a date range: created_at E.g. filter[signed_up_between]=2018-01-01,2022-12-31
 * @apiParam {Array} [filter[submissions]] For filtering records by orders submissions referrer by user. E.g. filter[submissions]=1,3
 * @apiParam {Array} [sort] For sorting records by email, customer_number, full_name, created_at . E.g. sort=-email, sort=email
 * @apiParam {Array} [filter[search]] For searching records by email, customer_number, full_name . E.g. filter[search]=abdc
 * @apiParam {Array} [filter[salesman_id]] To filter referees that are owned an specific salesman . E.g. filter[salesman_id]=id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                  {
 *                      "id": 125,
 *                      "profile_image": null,
 *                      "first_name": "qazzz",
 *                      "last_name": "qazzz",
 *                      "full_name": "qazzz qazzz",
 *                      "customer_number": "C00000125",
 *                      "email": "qazzz@example.org",
 *                      "phone": null,
 *                      "submissions": 0,
 *                      "cards_count": 0,
 *                      "wallet": {
 *                          "id": 97,
 *                          "user_id": 125,
 *                          "balance": 0,
 *                          "is_active": true,
 *                          "created_at": "2023-02-15T20:25:28.000000Z",
 *                          "updated_at": "2023-02-15T20:25:28.000000Z"
 *                      },
 *                      "created_at": "2023-02-15T20:25:28.000000Z",
 *                      "salesman": null,
 *                      "referred_by": {
 *                          "id": 18,
 *                          "first_name": "John",
 *                          "last_name": "Doe",
 *                          "full_name": "John Doe"
 *                      }
 *                  },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/v3/admin/referral-program/referrers?page=1",
 *                "last": "http://robograding.test/api/v3/admin/referral-program/referrers?page=1",
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
 *                        "url": "http://robograding.test/api/v3/admin/referral-program/referrers?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/v3/admin/referral-program/referrers",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
