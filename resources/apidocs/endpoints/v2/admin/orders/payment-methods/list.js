/**
 * @api {get} /v2/admin/orders/payment-methods All Payment Methods
 * @apiName List All Payment Methods
 * @apiGroup Admin Payment-Methods
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data payment methods
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "code": "stripe",
 *                  "name": "Credit or Debit Card"
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "paypal",
 *                  "name": "Paypal"
 *              }
 *          ]
 *      }
 */
