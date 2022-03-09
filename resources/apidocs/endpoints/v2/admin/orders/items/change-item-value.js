/**
 * @api {put} /v2/admin/orders/17/items/20 Change Order Item Values
 * @apiName Change Order Item Values
 * @apiGroup Order Cards
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Card object
 * @apiParam {Integer} card_id Change the item card id
 * @apiParam {Float} value Change the the item value
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 20,
 *              "order_id": 17,
 *              "quantity": 1,
 *              "declared_value_per_unit": 3,
 *              "card_product": {
 *                  "id": 102,
 *                  "full_name": "1973 Keely Claire Kayli 233 Oleta",
 *                  "name": "Oleta",
 *                  "card_category_name": "Keely",
 *                  "card_set_name": "Kayli",
 *                  "card_series_name": "Claire",
 *                  "release_year": 1973,
 *                  "card_number_order": "233",
 *                  "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *               },
 *               "status": {
 *                   "id": 16,
 *                   "order_item_status": {
 *                       "id": 4,
 *                       "name": "Confirmed",
 *                       "description": "Item is present in the shipped box and will be graded"
 *                   },
 *                   "notes": ""
 *               },
 *               "certificate_number": "00000501",
 *               "user_card": {
 *                   "overall_grade": 0,
 *                   "overall_grade_nickname": null
 *               }
 *           }
 *      }
 */
