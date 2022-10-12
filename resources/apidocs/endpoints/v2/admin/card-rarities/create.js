/**
 * @api {post} /v2/admin/cards/rarities Create Card Rarity
 * @apiName Create Card Rarity
 * @apiGroup Admin Card Rarities
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "name": "AZ",
 *      "card_category_id": 1,
 *  }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24104,
 *              "name": "AZ",
 *              "card_category": {
 *                  "id": 1,
 *                  "name": "Pokemon",
 *                  "image_url": "https::/kuhn.boz/"
 *              },
 *          }
 *      }
 */
