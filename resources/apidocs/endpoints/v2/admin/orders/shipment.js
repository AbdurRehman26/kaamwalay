/**
 * @api {post} /v2/admin/orders/1/shipment Update Shipment
 * @apiName Update Shipment
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
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
 * @apiSuccess {Object} data OrderItemShipment object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                "id": 14,
 *                "shipment_date": "2021-09-20T20:12:48.000000Z",
 *                "shipping_provider": "usps",
 *                "tracking_number": "9400100000000000000000"
 *                "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=9400100000000000000000",
 *            }
 *        }
 */
