/**
 * @api {put} /v2/admin/cards/rarities/{rarity} Update Card Rarity
 * @apiName Update Card Rarity
 * @apiGroup Admin Card Rarities
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {cardRarityId} CardRarity resource ID
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "name": "AZ",
 *      "card_category_id": 13
 *  }
 *
 * @apiSuccess {Object} data CardRarity object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24104,
 *              "name": "Charizard AZ",
 *              "card_category": {
 *                  "name": "Pokemon",
 *                  "id": 1,
 *              },
 *          }
 *      }
 */
