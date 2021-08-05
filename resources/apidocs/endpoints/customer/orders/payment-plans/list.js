/**
 * @api {get} /customer/orders/payment-plans List payment plans
 * @apiName List Payment Plans
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse authorization
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
