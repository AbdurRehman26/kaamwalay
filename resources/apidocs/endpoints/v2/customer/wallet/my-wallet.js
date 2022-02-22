/**
 * @api {get} /v2/customer/wallet Wallet Of User
 * @apiName Wallet Details of Logged In User
 * @apiGroup Wallet
 *
 * @apiVersion 2.0.0
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
