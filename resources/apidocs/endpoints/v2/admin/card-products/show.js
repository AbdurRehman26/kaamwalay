/**
 * @api {get} /v2/admin/cards/{cardProduct} Get Card Product
 * @apiName Get Card Product
 * @apiGroup Admin Card Products
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {Number} cardProduct card product resource ID
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
 *              "added_by_customer": false,
 *              "card_category": {
 *                  "id": 1,
 *                  "name": "Pokemon",
 *                  "image_url": "https:\/\/robograding-live.s3.us-west-2.amazonaws.com\/platform\/categories\/Pokemon.png"
 *              }
 *          }
 *      }
 */
