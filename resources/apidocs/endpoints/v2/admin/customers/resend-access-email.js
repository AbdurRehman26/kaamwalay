/**
 * @api {post} /v2/admin/customers/{userId}/send-access-email Resend Access Email to Customer
 * @apiName Resend Access Email to Customer
 * @apiGroup Admin Customers
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} userId ID of user that would receive access email. User must have not logged in to platform yet. Example: 10
 *
 * @apiSuccess {Object} data Response data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "success": true,
 *            "message": "Access email has been sent."
 *        }
 */
