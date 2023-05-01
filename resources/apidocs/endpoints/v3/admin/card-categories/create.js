/**
 * @api {post} /v3/admin/cards/categories Create Card Category
 * @apiName Create Card Category
 * @apiGroup Admin Card Category
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "name": "Pokemon",
 *      "image_url": "https://www.reilly.com/vel-facere-fugit-beatae-inventore-molestiae",
 *  }
 *
 * @apiSuccess {Object} data Card Category object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 24104,
 *              "name": "Pokemon",
 *              "image_url": "https://www.reilly.com/vel-facere-fugit-beatae-inventore-molestiae",
 *          }
 *      }
 */
