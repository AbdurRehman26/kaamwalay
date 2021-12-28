/**
 * @api {post} /v1/customer/cards Create Card Product
 * @apiName Create Card Product
 * @apiGroup Customer Card Products
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "name": "Charizard XY",
 *          "description": "Big Set 2021, #50 Holo",
 *          "image_path": "http://www.google.com"
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24103,
 *              "long_name": "Big Set 2021, #50 Holo",
 *              "short_name": "Added Manually",
 *              "name": "Charizard XY",
 *              "card_category_name": null,
 *              "card_set_name": null,
 *              "card_series_name": null,
 *              "release_date": null,
 *              "release_year": null,
 *              "card_number_order": null,
 *              "image_path": "http://www.google.com",
 *              "language": null,
 *              "variant": null,
 *              "surface": null,
 *              "edition": null,
 *              "added_by_customer": true
 *          }
 *      }
 */
