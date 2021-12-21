/**
 * @api {get} /admin/coupons List coupons
 * @apiName List Coupons
 * @apiGroup Admin Coupons
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching coupons list based on these columns: code, available_from,status. E.g. filter[search]=1
 * @apiParam {Array} [filter[status]] For filtering records by coupon status. E.g. filter[status]=1
 * @apiParam {Array} [filter[code]] For filtering records by coupon code. E.g. filter[code]=AGSBLACKFRIDAY
 * @apiParam {string} sort For sorting records, supporting params are [available_from, -available_from, available_till, -available_till, discount, -discount, discount_value, -discount_value]. E.g. sort=discount_value
 * @apiParam {Array} [include] For including relationships [couponStatus, couponApplicable, couponStats, couponLogs, users, paymentPlans]
 * @apiSuccess {Object} data Coupon data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                      "id": 30,
 *                      "code": "fUUEPwWB3V",
 *                      "type": "fixed",
 *                      "discount_value": "20.00",
 *                      "coupon_applicable_id": 34,
 *                      "coupon_status_id": 4,
 *                      "available_from": "2021-12-30T10:18:01.000000Z",
 *                      "available_till": "2021-12-21T10:17:01.000000Z",
 *                      "is_permanent": false,
 *                      "coupon_status": {
 *                          "id": 4,
 *                          "code": "expired",
 *                          "name": "Expired"
 *                      }
 *                  }
 *               },
 *            ],
 *            "links": {
 *                "first": "http://robograding.test/api/admin/coupons?page=1",
 *                "last": "http://robograding.test/api/admin/coupons?page=1",
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
 *                        "url": "http://robograding.test/api/admin/coupons?page=1",
 *                        "label": "1",
 *                        "active": true
 *                    },
 *                    {
 *                        "url": null,
 *                        "label": "Next &raquo;",
 *                        "active": false
 *                    }
 *                ],
 *                "path": "http://robograding.test/api/admin/coupons",
 *                "per_page": 15,
 *                "to": 15,
 *                "total": 15
 *            }
 *        }
 */
