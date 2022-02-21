/**
 * @api {post} /v2/auth/password/reset Reset Password
 * @apiName Reset Password
 * @apiGroup Authentication
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 *
 * @apiParam { String } token password reset token attached in the reset link
 * @apiParam { String } email email of the user attached in the link
 * @apiParam { String } password new password of the user
 * @apiParam { String } password_confirmation password confirmation of the user
 *
 * @apiSuccess { String } message success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "message": "Your password has been reset!"
 *      }
 */
