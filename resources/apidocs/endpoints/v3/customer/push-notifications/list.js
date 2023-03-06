/**
 * @api {get} /v3/customer/push-notifications List Push Notifications
 * @apiName List Push Notifications
 * @apiGroup Customer Push Notifications
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Number} [per_page] Per page count for pagination. Defaults to 15.
 *
 * @apiSuccess {Array} data Push notifications data
 * @apiSuccess {String} data.id ID of notification
 * @apiSuccess {String} data.title Title of notification
 * @apiSuccess {String} data.body Body of notification
 * @apiSuccess {Array} [data.intent] Intent (if any)
 * @apiSuccess {String} data.created_at Time at which notification was created
 * @apiSuccess {String} data.read_at Time at which notification was read (null if not read)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": "9e3ab533-f109-4d16-a7ce-2ee5e31f3305",
 *                  "title": "Submission Placed",
 *                  "body": "Your submission # RG000000264 has been placed",
 *                  "intent": {
 *                      "intent": "SUBMISSION_DETAIL_VIEW",
 *                      "object_id": 264
 *                  },
 *                  "created_at": "2022-12-06T10:21:45.000000Z",
 *                  "read_at": "2022-12-06T12:04:23.000000Z"
 *              },
 *              {
 *                  "id": "502c069b-410e-4903-9345-33b46065f1c0",
 *                  "title": "Submission Placed",
 *                  "body": "Your submission # RG000000264 has been placed",
 *                  "intent": {
 *                      "intent": "SUBMISSION_DETAIL_VIEW",
 *                      "object_id": 264
 *                  },
 *                  "created_at": "2022-12-06T10:19:53.000000Z",
 *                  "read_at": null
 *              },
 *              {
 *                  "id": "502c069b-410e-4903-9345-33b46065f1c0",
 *                  "title": "Submission Placed",
 *                  "body": "Your submission # RG000000264 has been placed",
 *                  "intent": {
 *                  },
 *                  "created_at": "2022-12-06T10:19:53.000000Z",
 *                  "read_at": null
 *              }
 *          ],
 *          "links": {
 *              "first": "http://robograding.test/api/v3/customer/push-notifications?page=1",
 *              "last": "http://robograding.test/api/v3/customer/push-notifications?page=1",
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
 *                      "url": "http://robograding.test/api/v3/customer/push-notifications?page=1",
 *                      "label": "1",
 *                      "active": true
 *                  },
 *                  {
 *                      "url": null,
 *                      "label": "Next &raquo;",
 *                      "active": false
 *                  }
 *              ],
 *              "path": "http://robograding.test/api/v3/customer/push-notifications",
 *              "per_page": 15,
 *              "to": 2,
 *              "total": 2
 *          }
 *      }
 */
