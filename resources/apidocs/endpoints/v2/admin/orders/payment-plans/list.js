/**
 * @api {get} /v2/admin/orders/payment-plans List payment plans
 * @apiName List Payment Plans
 * @apiGroup Admin Payment Plans
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data Payment plans data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "price": 20.50,
 *                  "max_protection_amount": 500.00,
 *                  "turnaround": "20-30 Day"
 *              },
 *              {
 *                  "id": 2,
 *                  "price": 40.00,
 *                  "max_protection_amount": 1000.00,
 *                  "turnaround": "10-20 Day"
 *              },
 *              {
 *                  "id": 3,
 *                  "price": 2000.00,
 *                  "max_protection_amount": 100000.00,
 *                  "turnaround": "1 Day"
 *              }
 *          ]
 *      }
 */
