/**
 * @api {get} /v3/auth/me Get Referees Data
 * @apiName Get Referees Data
 * @apiGroup Referrer
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data containing referee sign ups linked to logged in user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 86,
 *                  "first_name": "John",
 *                  "last_name": "Doe",
 *                  "full_name": "John Doe",
 *                  "profile_image": null,
 *                  "signed_up_at": "2023-01-25T17:54:02.000000Z",
 *                  "submissions": 2,
 *                  "cards_count": 5,
 *                  "total_spent": "32.50",
 *                  "total_commissions": 3.25
 *              }
 *          ],
 *          "links": {
 *              "first": "http://robograding.test/api/v3/customer/referral/sign-ups?page=1",
 *              "last": "http://robograding.test/api/v3/customer/referral/sign-ups?page=1",
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
 *                      "url": "http://robograding.test/api/v3/customer/referral/sign-ups?page=1",
 *                      "label": "1",
 *                      "active": true
 *                  },
 *                  {
 *                      "url": null,
 *                      "label": "Next &raquo;",
 *                      "active": false
 *                  }
 *              ],
 *              "path": "http://robograding.test/api/v3/customer/referral/sign-ups",
 *              "per_page": 10,
 *              "to": 1,
 *              "total": 1
 *          }
 *      }
 */
