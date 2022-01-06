/**
 * @api {get} /v1/wallet/payments Users Payment Methods
 * @apiName List Wallet Payments
 * @apiGroup Wallet
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data wallet payments list
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": "pm_1JLxgyJCai8r8pbfCVXFjZo5",
 *                  "object": "payment_method",
 *                  "created": 1628374113,
 *                  "customer": "cus_JznJFVaa5nnDfj",
 *                  "livemode": false,
 *                  "metadata": [],
 *                  "type": "card"
 *              }
 *          ]
 *      }
 */
