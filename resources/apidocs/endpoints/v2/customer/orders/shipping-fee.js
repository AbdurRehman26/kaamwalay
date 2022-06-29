/**
 * @api {post} /v2/customer/orders/shipping-fee Get shipping fee
 * @apiName Get Shipping Fee
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Number} shippingMethodId unique ID (optional for backward compatibility).
 * @apiParam {Array} items Items for shipping fee calculation
 * @apiParam {Array} shipping_address Shipping Address details for fee calculation in international shipping (optional for national shippings)
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
 *          ],
 *          "shipping_method_id": 1,
 *          "shipping_address": {
 *              "first_name": "test",
 *              "last_name": "test",
 *              "address": "1234 Test St",
 *              "city": "Vancouver",
 *              "state": "BC",
 *              "zip": "123 ABC",
 *              "phone": "123-456-7890",
 *              "country_code": "CA"
 *          }
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
