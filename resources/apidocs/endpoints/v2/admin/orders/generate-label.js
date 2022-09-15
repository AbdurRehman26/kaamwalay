/**
 * @api {post} /v2/admin/orders/1 Generate Label
 * @apiName Generate Label
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 * @apiSuccess {Object} data Order object
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
 *                "order_label": {
 *                    "id": 1,
                      "order_id": 1,
                      "path": "https://show.me/fake.png",
 *                    "created_at": {
 *                        "date": "2021-08-12 02:22:46.000000",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                    "updated_at": {
 *                        "date": "2021-08-12 02:22:46.000000",
 *                        "timezone_type": 3,
 *                        "timezone": "UTC"
 *                    },
 *                },
 *            }
 *        }
 */
