/**
 * @api {get} /v2/admin/cards/rarities List Card Rarity
 * @apiName List Card Rarities
 * @apiGroup Admin Card Rarities
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching cards rarities list based on these columns: name. E.g. filter[search]=RZ
 * @apiParam {Array} [filter[card_category]] For filtering records by categoryID. E.g. filter[card_category]=1
 * @apiParam {string} sort For sorting records, supporting params are [name, -name]. E.g. sort=name
 * @apiSuccess {Object} data CardRarity data
 *
 * @apiSuccess {Object} data CardRarity object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": [{
 *              "id": 24104,
 *              "name": "AZ",
 *              "card_category": {
 *                  "id": 1,
 *                  "name": "Pokemon",
 *                  "image_path": "https://ujhas.biz"
 *              },
 *          }]
 *      }
 */
