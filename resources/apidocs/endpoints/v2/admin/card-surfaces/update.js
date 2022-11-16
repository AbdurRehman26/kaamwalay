/**
 * @api {put} /v2/admin/cards/surfaces/{surface} Update Card Surface
 * @apiName Update Card Surface
 * @apiGroup Admin Card Surfaces
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {cardSurfaceId} CardSurface resource ID
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "name": "AZ",
 *      "card_category_id": 13
 *  }
 *
 * @apiSuccess {Object} data CardSurface object
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
