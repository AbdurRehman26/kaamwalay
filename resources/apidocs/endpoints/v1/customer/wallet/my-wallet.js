/**
 * @api {get} /v1/wallet/me Wallet Of User
 * @apiName Wallet Details of Logged In User
 * @apiGroup Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data containing wallet details
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *                  "balance": 18.00,
 *              }
 *      }
 */
