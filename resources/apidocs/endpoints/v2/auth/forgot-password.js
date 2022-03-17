/**
 * @api {post} /v2/auth/password/forgot Forgot Password Request
 * @apiName Forgot Password Request
 * @apiGroup Authentication
 *
 * @apiVersion 2.0.0
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
 *          "message": "We sent you details, vheck your email and follow the link to reset your password."
 *      }
 */
