/**
 * @api {get} /v2/admin/cards/ Create Card Product
 * @apiName List Card Products
 * @apiGroup Admin Card Products
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching cards list list based on these columns: name, rarity, edition, surface, variant. E.g. filter[search]=Pokemon
 * @apiParam {Array} [filter[card_category]] For filtering records by categoryID. E.g. filter[card_category]=1
 * @apiParam {Array} [filter[release_date]] For filtering records by a release date range. E.g. filter[release_date]=2020-03-01,2020-03-21
 * @apiParam {string} sort For sorting records, supporting params are [population, -population]. E.g. sort=population
 * @apiSuccess {Object} data CardProduct data
 *
 * @apiSuccess {Object} data CardProduct object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": [{
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
 *          }]
 *      }
 */
