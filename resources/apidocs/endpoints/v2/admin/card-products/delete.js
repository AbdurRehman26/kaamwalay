/**
 * @api {delete} /v2/admin/cards/{cardProduct} Create Card Product
 * @apiName Delete Card Product
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
 *   HTTP/1.1 204 NO_CONTENT
 *      {
 *          "data": []
 *      }
 */
