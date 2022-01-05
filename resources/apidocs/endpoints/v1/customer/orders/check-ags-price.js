/**
 * @api {get} /v1/customer/orders/{order}/ags Calculate AGS Price
 * @apiName Calculate AGS Price for order
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 * 
 * @apiParam {Integer} id Order unique ID
 *
 * @apiSuccess {float} value AGS equivalent for order total value
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
            "value": 123.45,
        }
 */
