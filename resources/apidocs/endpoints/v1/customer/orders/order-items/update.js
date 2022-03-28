/**
 * @api {put} /v1/customer/orders/{orderId}/orderItems/{orderItemId} Update Order Item
 * @apiName Update Order Item
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "card_product_id": 1,
 *          "quantity": 1,
 *          "declared_value_per_unit": 10
 *      }
 *
 * @apiSuccess {Array} data of OrderItem Collection
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": [{
 *              "id": 98,
 *              "order_id": 17,
 *              "quantity": 1,
 *              "declared_value_per_unit": 2,
 *              "card_product": {
 *                   "id": 101,
 *                   "full_name": "1991 Vincenzo Patsy Felipe 216 Nicole",
 *                   "name": "Nicole",
 *                   "card_category_name": "Vincenzo",
 *                   "card_set_name": "Felipe",
 *                   "card_series_name": "Patsy",
 *                   "release_year": 1991,
 *                   "card_number_order": "216",
 *                   "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *               },
 *               "status": {
 *                    "id": 4,
 *                    "name": "Confirmed",
 *                    "description": "Item is present in the shipped box and will be graded"
 *               },
 *               "user_card": null
 *           }]
 *      }
 */
