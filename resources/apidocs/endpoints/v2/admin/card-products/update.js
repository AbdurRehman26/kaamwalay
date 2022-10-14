/**
 * @api {put} /v2/admin/cards/{cardProduct} Create Card Product
 * @apiName Update Card Product
 * @apiGroup Admin Card Products
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {Number} cardProduct card product resource ID
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "image_path": "https://www.google.com",
 *      "name": "Charizard AZ",
 *      "release_date": "2021-11-06",
 *      "series_name": "Admin Series",
 *      "series_image": "https://www.google.com",
 *      "set_name": "admin new set",
 *      "set_image": "https://www.google.com",
 *      "card_number": "001",
 *      "language": "English",
 *      "rarity": "Common",
 *      "edition": "1st Edition",
 *      "surface": "Holo",
 *      "variant": "Lorem"
 *  }
 *
 * @apiSuccess {Object} data CardProduct object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24104,
 *              "long_name": "2021 Pokemon Admin Series Admin Set 001",
 *              "short_name": "",
 *              "name": "Charizard AZ",
 *              "card_category_name": "Pokemon",
 *              "card_set_name": "Admin Set",
 *              "card_series_name": "Admin Series",
 *              "release_date": "2021-11-08T20:21:00.000000Z",
 *              "release_year": 2021,
 *              "card_number_order": "001",
 *              "image_path": "https://www.google.com",
 *              "language": "English",
 *              "edition": "1st Edition",
 *              "surface": "Holo",
 *              "variant": "Lorem"
 *              "added_by_customer": false
 *          }
 *      }
 */
