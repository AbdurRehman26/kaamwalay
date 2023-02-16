/**
 * @api {get} /v3/admin/customer/:id/referral/commission-earnings Get Commission Earnings Data
 * @apiName Get Commission Earnings Data
 * @apiGroup Referrer
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id customer unique ID
 *
 * @apiSuccess {Array} data containing referral commission earnigns linked to given user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 478,
 *                  "first_name": "John",
 *                  "last_name": "Doe",
 *                  "full_name": "John Doe",
 *                  "profile_image": null,
 *                  "paid_at": "2023-01-28T00:25:20.000000Z",
 *                  "cards": 3,
 *                  "submission_total": 16.7,
 *                  "commission": "1.67"
 *              },
 *              {
 *                  "id": 477,
 *                 "first_name": "John",
 *                  "last_name": "Doe",
 *                  "full_name": "John Doe",
 *                  "profile_image": null,
 *                  "paid_at": "2023-01-27T19:41:54.000000Z",
 *                  "cards": 2,
 *                  "submission_total": 15.8,
 *                  "commission": "1.58"
 *              }
 *          ],
 *          "links": {
 *              "first": "http://robograding.test/api/v3/admin/customer/:id/referral/commission-earnings?page=1",
 *              "last": "http://robograding.test/api/v3/admin/customer/:id/referral/commission-earnings?page=1",
 *              "prev": null,
 *              "next": null
 *          },
 *          "meta": {
 *              "current_page": 1,
 *              "from": 1,
 *              "last_page": 1,
 *              "links": [
 *                  {
 *                      "url": null,
 *                      "label": "&laquo; Previous",
 *                      "active": false
 *                  },
 *                  {
 *                      "url": "http://robograding.test/api/v3/admin/customer/:id/referral/commission-earnings?page=1",
 *                      "label": "1",
 *                      "active": true
 *                  },
 *                  {
 *                      "url": null,
 *                      "label": "Next &raquo;",
 *                      "active": false
 *                  }
 *              ],
 *              "path": "http://robograding.test/api/v3/admin/customer/:id/referral/commission-earnings",
 *              "per_page": 10,
 *              "to": 1,
 *              "total": 1
 *          }
 *      }
 */
