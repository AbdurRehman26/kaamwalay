/**
 * @api {get} /v2/customer/orders/{order}/collector-coin Calculate Collector Coin Price
 * @apiName Calculate Collector Coin Price for order
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 * 
 * @apiParam {Integer} id Order unique ID
 *
 * @apiSuccess {float} value Collector Coin equivalent for order total value
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
            "value": 123.45,
            "wallet": "0xABCDEF123456"
        }
 */
