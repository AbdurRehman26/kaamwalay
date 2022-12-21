/**
 * @api {post} /v3/customer/push-notifications/stats Stats
 * @apiName Stats
 * @apiGroup Customer Push Notifications
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data Stats data
 * @apiSuccess {Number} data.unread_count Number of notifications which have not been read
 * @apiSuccess {Number} data.read_count Number of notifications which have been read
 * @apiSuccess {Number} data.total Number of total notifications
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "unread_count": 2,
 *              "read_count": 3,
 *              "total": 5
 *          }
 *      }
 */
