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
 *                "id": 29,
 *                "order_number": "RG000000029",
 *                "number_of_cards": 11,
 *                "total_declared_value": 5500,
 *                "service_fee": 20,
 *                "shipping_fee": 43,
 *                "grand_total": 263,
 *                "extra_charge_total": 0,
 *                "refund_total": 0,
 *                "created_at": {
 *                    "date": "2021-08-12 02:22:46.000000",
 *                    "timezone_type": 3,
 *                    "timezone": "UTC"
 *                },
 *                "reviewed_by": "John Doe",
 *                "reviewed_at": "2021-09-16T21:45:02.000000Z",
 *                "graded_by": null,
 *                "graded_at": null,
 *                "auto_saved_at": "2021-09-16T21:45:08.000000Z",
 *                "total_graded_items": 0,
 *                "shipping_method": {
 *                    "id": 1,
 *                    "code": "insured_shipping",
 *                    "name": "Insured Shipping"
 *                },
 *                "order_shipment": {
 *                    "id": 14,
 *                    "shipment_date": "2021-09-20T20:12:48.000000Z",
 *                    "shipping_provider": "usps",
 *                    "tracking_number": "9400100000000000000000"
 *                    "tracking_url": "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=9400100000000000000000",
 *                }
 *            }
 *        }
 */
