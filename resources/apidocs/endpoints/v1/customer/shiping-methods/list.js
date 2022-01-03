/**
 * @api {get} /v1/customer/orders/shipping-methods List Shipping methods
 * @apiName List Shipping Methods
 * @apiGroup Shipping-Methods
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Shipment method data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "code": "insured_shipping",
 *                  "name": "Insured Shipping"
 *              }
 *          ]
 *      }
 */
