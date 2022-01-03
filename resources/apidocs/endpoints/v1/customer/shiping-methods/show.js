/**
 * @api {get} /v1/customer/orders/shipping-methods/3 Show Shipping method
 * @apiName Show Shipping method
 * @apiGroup Shipping-Methods
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Shipping Method unique ID
 *
 * @apiSuccess {Object} data Shipping Method data
 * @apiSuccess {Integer} data.id Shipping method unique ID
 * @apiSuccess {String} data.code Shipping method code
 * @apiSuccess {String} data.name Shipping method name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "code": "magnam",
 *              "name": "Blanche"
 *         }
 *      }
 */
