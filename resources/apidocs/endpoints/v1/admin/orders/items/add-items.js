/**
 * @api {post} /v1/admin/orders/17/items Add Extra Cards
 * @apiName Add Extra Cards
 * @apiGroup Order Cards
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Card object
 * @apiParam {Integer} card_id Add the card id
 * @apiParam {float} value Add the the item value
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": {
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
 *                   "id": 195,
 *                   "order_item_status": {
 *                       "id": 4,
 *                       "name": "Confirmed",
 *                       "description": "Item is present in the shipped box and will be graded"
 *                   },
 *                   "notes": ""
 *               },
 *               "certificate_number": "00000579",
 *               "user_card": {
 *                   "overall_grade": 0,
 *                   "overall_grade_nickname": null
 *               }
 *           }
 *      }
 */
