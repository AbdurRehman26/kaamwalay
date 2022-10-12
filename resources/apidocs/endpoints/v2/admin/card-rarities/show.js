/**
 * @api {get} /v2/admin/cards/rarities/{rarity} Show Card Rarity
 * @apiName Get Card Rarity
 * @apiGroup Admin Card Rarities
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {cardRarityId} CardRarity resource ID
 *
 * @apiSuccess {Object} data CardRarity object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24104,
 *              "name": "AZ",
 *          }
 *      }
 */
