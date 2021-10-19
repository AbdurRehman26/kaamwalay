/**
 * @api {post} /customer/orders/1/customer-shipment Update Customer Shipment
 * @apiName Update Customer Shipment
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 * @apiParamExample {json} Request-Example:
 *      {
 *          "shipping_provider": "usps",
 *          "tracking_number": "9400100000000000000000"
 *      }
 *
 * @apiSuccess {Object} data Order object
 * @apiSuccess {Integer} data.id Customer Shipment ID
 * @apiSuccess {string} data.shipping_provider Shipping Provider
 * @apiSuccess {string} data.tracking_number Tracking number
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 2,
 *                "shipping_provider": "usps",
 *                "tracking_number": "9400100000000000000000"
 *            }
 *        }
 */
