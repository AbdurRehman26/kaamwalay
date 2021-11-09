/**
 * @api {get} /admin/cards/options Get Card Creation Dropdowns Options
 * @apiName Get Card Creation Dropdowns Options
 * @apiGroup Admin Card Products
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Dropdowns options data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *          {
 *              "category": {
 *                  "1": "Pokemon"
 *              },
 *              "rarity": [
 *                  "Common",
 *                  "Uncommon",
 *                  "Rare"
 *              ],
 *              "edition": [
 *                  "1st Edition",
 *                  "Shadowless",
 *                  "Unlimited"
 *              ],
 *              "surface": [
 *                  "Holo",
 *                  "Cracked Ice Holo",
 *                  "Cosmos Holo",
 *                  "Reverse Holo",
 *                  "Reverse Foil"
 *              ],
 *              "language": [
 *                  "Japanese",
 *                  "English",
 *                  "Dutch",
 *                  "German",
 *                  "French",
 *                  "Italian",
 *                  "Spanish",
 *                  "Portuguese",
 *                  "(South) Korean",
 *                  "Traditional Chinese",
 *                  "Russian",
 *                  "Polish"
 *              ]
 *          }
 */
