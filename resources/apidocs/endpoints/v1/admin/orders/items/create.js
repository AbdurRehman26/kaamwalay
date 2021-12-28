/**
 * @api {post} /v1/admin/orders/13/cards Add Card to Order
 * @apiName Add Order Card
 * @apiGroup Order Cards
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "card_id": 75,
 *          "value": 1
 *      }
 *
 * @apiSuccess {Object} data Card object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *            "id": 91,
 *            "quantity": 1,
 *            "declared_value_per_unit": 1,
 *            "card_product": {
 *                "id": 75,
 *                "name": "Conkeldurr",
 *                "card_category_name": "Pokemon",
 *                "card_set_name": "Battle Styles",
 *                "card_series_name": "Sword & Shield Series",
 *                "release_year": 2021,
 *                "card_number_order": "075",
 *                "image_path": "https://den-cards.pokellector.com/305/Conkeldurr.SWSH05.75.37599.png"
 *            },
 *            "status": {
 *                "id": 93,
 *                "order_item_status": {
 *                    "id": 4,
 *                    "code": "confirmed",
 *                    "name": "Confirmed",
 *                    "description": "Item is present in the shipped box and will be graded",
 *                },
 *                "notes": null
 *            },
 *            "certificate_number": null
 *        }
 *    }
 */
