/**
 * @api {get} /customer/orders/payment-plans/:id Show Payment Plan
 * @apiName Show Payment Plan
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Payment Plan unique ID
 *
 * @apiSuccess {Object} data Payment Plan data
 * @apiSuccess {Integer} data.id Payment plan unique ID
 * @apiSuccess {Float} data.price Payment plan price
 * @apiSuccess {Float} data.max_protection_amount Payment plan maximum protection amount
 * @apiSuccess {String} data.turnaround Payment plan turnaround time
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "price": 20.50,
 *              "max_protection_amount": 500.00,
 *              "turnaround": "20-30 Day"
 *         }
 *      }
 */
