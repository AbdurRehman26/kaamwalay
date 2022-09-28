/**
 * @api {get} /v2/admin/orders/{id}/labels Get Order Labels
 * @apiName Get Order Labels
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order unique ID
 * @apiSuccess {Array} data Order Card Labels data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "card_product_id": 1,
 *                 "card_label_id": 1,
 *                 "certificate_number": "09000000",
 *                 "grade": 8.5,
 *                 "nick_name": "NM-MT+",
 *                 "line_one": "2021 Pokemon SWSH 1",
 *                 "line_two": "SCATTERBUG",
 *                 "line_three": "Battle Styles",
 *                 "line_four": "#11",
 *                 "persist_changes": "true"
 *                 "card_product": {
 *                     "id": 11,
 *                     "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 11",
 *                     "short_name": "",
 *                     "name": "Scatterbug",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-03-19T00:00:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "011",
 *                     "image_path": "https://den-cards.pokellector.com/305/Scatterbug.SWSH05.11.37538.png",
 *                     "language": "English",
 *                     "variant": "",
 *                     "surface": "",
 *                     "edition": "",
 *                     "added_by_customer": false
 *                 }
 *             }
 *         ]
 *     }
 */
