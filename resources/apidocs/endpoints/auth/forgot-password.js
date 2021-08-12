/**
 * @api {post} /auth/password/forgot Forgot Password Request
 * @apiName Forgot Password Request
 * @apiGroup Authentication
 *
 * @apiUse header_main
 *
 * @apiParam { String } email email of the user
 *
 * @apiSuccess { String } message Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "message": "Successfully sent Password Reset Email"
 *      }
 */
