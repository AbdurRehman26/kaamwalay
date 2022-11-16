/**
 * @api {get} /v2/admin/cards/surfaces/{surface} Show Card Surface
 * @apiName Get Card Surface
 * @apiGroup Admin Card Surfaces
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiQuery {cardSurfaceId} CardSurface resource ID
 *
 * @apiSuccess {Object} data CardSurface object
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
