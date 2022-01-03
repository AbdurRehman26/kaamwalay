/**
 * @api {get} /v1/customer/orders/payment-methods/4 Show Payment Method
 * @apiName Show Payment Method
 * @apiGroup Payment-Methods
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Payment Method unique ID
 *
 * @apiSuccess {Object} data Payment Method data
 * @apiSuccess {Integer} data.id Payment method unique ID
 * @apiSuccess {String} data.code Payment method code
 * @apiSuccess {String} data.name Payment method name
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
