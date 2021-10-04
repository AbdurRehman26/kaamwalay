/**
 * @api {get} /customer/17/cards List cards
 * @apiName List Cards
 * @apiGroup User Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Unique customer id
 * @apiParam {Array} [filter[search]] For filtering cards by name, certificate # or submision # . E.g. filter[search]=charizard
 * @apiParam {String} [sort] For sorting cards by either card name or graded date # . E.g. sort=date
 *
 * @apiSuccess {Object} data User Cards data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "card_product": {
 *                     "id": 7,
 *                     "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 7 Cherubi",
 *                     "name": "Cherubi",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-10-04T20:21:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "007",
 *                     "image_path": "https://den-cards.pokellector.com/305/Cherubi.SWSH05.7.37534.png"
 *                 },
 *                 "certificate_number": "00000509",
 *                 "overall_grade": 0
 *             },
 *             {
 *                 "card_product": {
 *                     "id": 8,
 *                     "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 8 Cherrim",
 *                     "name": "Cherrim",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-10-04T20:21:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "008",
 *                     "image_path": "https://den-cards.pokellector.com/305/Cherrim.SWSH05.8.37535.png"
 *                 },
 *                 "certificate_number": "00000510",
 *                 "overall_grade": 0
 *             },
 *             {
 *                 "card_product": {
 *                     "id": 8,
 *                     "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 8 Cherrim",
 *                     "name": "Cherrim",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-10-04T20:21:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "008",
 *                     "image_path": "https://den-cards.pokellector.com/305/Cherrim.SWSH05.8.37535.png"
 *                 },
 *                 "certificate_number": "00000511",
 *                 "overall_grade": 0
 *             }
 *         ],
 *         "links": {
 *             "first": "http://robograding.test/api/customer/17/cards?page=1",
 *             "last": "http://robograding.test/api/customer/17/cards?page=1",
 *             "prev": null,
 *             "next": null
 *         },
 *         "meta": {
 *             "current_page": 1,
 *             "from": 1,
 *             "last_page": 1,
 *             "links": [
 *                 {
 *                     "url": null,
 *                     "label": "&laquo; Previous",
 *                     "active": false
 *                 },
 *                 {
 *                     "url": "http://robograding.test/api/customer/17/cards?page=1",
 *                     "label": "1",
 *                     "active": true
 *                 },
 *                 {
 *                     "url": null,
 *                     "label": "Next &raquo;",
 *                     "active": false
 *                 }
 *             ],
 *             "path": "http://robograding.test/api/customer/17/cards",
 *             "per_page": 15,
 *             "to": 3,
 *             "total": 3
 *         }
 *     }
 */
