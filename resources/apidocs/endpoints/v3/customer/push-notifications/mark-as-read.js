/**
 * @api {post} /v3/customer/push-notifications/{notification}/mark-as-read Mark as Read
 * @apiName Mark as Read
 * @apiGroup Customer Push Notifications
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} notification Notification ID
 *
 * @apiSuccess {Array} data Push notifications data
 * @apiSuccess {String} data.id ID of notification
 * @apiSuccess {String} data.title Title of notification
 * @apiSuccess {String} data.body Body of notification
 * @apiSuccess {Array} [data.intent] Intent (if any)
 * @apiSuccess {String} data.created_at Time at which notification was created
 * @apiSuccess {String} data.read_at Time at which notification was read
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": "9e3ab533-f109-4d16-a7ce-2ee5e31f3305",
 *              "title": "Submission Placed",
 *              "body": "Your submission # RG000000264 has been placed",
 *              "intent": {
 *                  "intent": "SUBMISSION_DETAIL_VIEW",
 *                  "object_id": 264
 *              },
 *              "created_at": "2022-12-06T10:21:45.000000Z",
 *              "read_at": "2022-12-06T12:04:23.000000Z"
 *          }
 *      }
 */
