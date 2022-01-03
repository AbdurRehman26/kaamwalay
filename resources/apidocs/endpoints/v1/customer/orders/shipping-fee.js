/**
 * @api {post} /v1/customer/orders/shipping-fee Get shipping fee
 * @apiName Get Shipping Fee
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} items Items for shipping fee calculation
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "items": [
 *              {
 *                  "quantity": 1,
 *                  "declared_value_per_unit": 500
 *              },
 *              {
 *                  "quantity": 2,
 *                  "declared_value_per_unit": 1000
 *              }
 *          ]
 *      }
 *
 * @apiSuccess {Object} data Shipping Fee data
 * @apiSuccess {Float} data.shipping_fee Shipping fee amount
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "shipping_fee": 20
 *         }
 *      }
 */
