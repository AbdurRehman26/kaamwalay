/**
 * @api {get} /v2/admin/cards/1/label Get Card Label
 * @apiName Get Card Label
 * @apiGroup Admin Card Labels
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Card Product unique ID
 * @apiSuccess {Object} data Card Label object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *         "data": {
 *              "card_label_id": 3,
 *              "line_one": "2021 Pokemon SWSH 3",
 *              "line_two": "SALANDIT",
 *              "line_three": "Battle Styles",
 *              "line_four": "#27",
 *              "card_product": {
 *                  "id": 27,
 *                  "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 27",
 *                  "short_name": "",
 *                  "name": "Salandit",
 *                  "card_category_name": "Pokemon",
 *                  "card_set_name": "Battle Styles",
 *                  "card_series_name": "Sword & Shield Series",
 *                  "release_date": "2021-03-19T00:00:00.000000Z",
 *                  "release_year": 2021,
 *                  "card_number_order": "027",
 *                  "image_path": "https://den-cards.pokellector.com/305/Salandit.SWSH05.27.37553.png",
 *                  "language": "English",
 *                  "variant": "",
 *                  "surface": "",
 *                  "edition": "",
 *                  "added_by_customer": false
 *              }
 *          }
 */
