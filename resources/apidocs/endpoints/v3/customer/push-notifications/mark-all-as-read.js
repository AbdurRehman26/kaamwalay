/**
 * @api {post} /v3/customer/push-notifications/mark-all-as-read Mark All as Read
 * @apiName Mark All as Read
 * @apiGroup Customer Push Notifications
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "message": "All notifications have been marked as read"
 *      }
 */
