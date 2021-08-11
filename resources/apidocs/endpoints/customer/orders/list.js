/**
 * @api {get} /customer/orders List orders
 * @apiName List Orders
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse authorization
 *
 * @apiSuccess {Array} data Orders List
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 3,
 *                  "price": 2000.00,
 *                  "max_protection_amount": 100000.00,
 *                  "turnaround": "1 Day"
 *              }
 *          ]
 *      }
 */
